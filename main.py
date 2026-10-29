import json
import logging 
import os
import re
import time
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from google import genai
from pydantic import BaseModel

load_dotenv()

logging.basicConfig(
    filename="ai_service.log",
    level=logging.INFO,
    format="%(asctime)s | %(message)s"
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "schema3388")

app = FastAPI(title="AI & Data Microservice", version="1.0.0")


class SQLRequest(BaseModel):
    schema: str
    question: str
    glossary: str | None = None


def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=403, detail="Unauthorized: Invalid or missing API Key"
        )
    return x_api_key


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "python-ai-microservice"}


@app.post("/api/generate-sql")
async def generate_sql(
    request: SQLRequest, api_key: str = Depends(verify_api_key)
):
    try:
        prompt = f"""
        You are an expert AI Business Analyst.
        Given the database schema:
        {request.schema}

        Business Glossary (Semantic Rules):
        {request.glossary if request.glossary else "None"}

        User Question:
        "{request.question}"

        Perform the following tasks:
        1. Write an accurate SQL query.
        2. Determine the best chart type to visualize this data (choose from: "bar", "line", "pie", "table").
        3. Provide 2-3 relevant follow-up suggestion questions that the user might want to ask next based on this data.

        You MUST return ONLY a valid JSON object in this exact format (no extra text or markdown):
        {{
          "sql": "SELECT ...",
          "explanation": "A plain English explanation of what this query does and what results to expect.",
          "chart_type": "bar",
          "suggestions": ["Suggestion 1?", "Suggestion 2?"]
        }}
        """

        response = None
        last_error = None
        models_to_try = ["gemini-3.3-flash"]

                for model_name in models_to_try:
                    for attempt in range(3):
                        try:
                            start_time = time.time()
                            response = client.models.generate_content(
                                model=model_name, contents=prompt
                            )
                            elapsed_ms = round((time.time() - start_time) * 1000, 2)
                            if response and response.text:
                                break
                        except Exception as e:
                            last_error = e
                            if "503" in str(e) or "UNAVAILABLE" in str(e):
                                time.sleep(2)
                                continue
                            else:
                                break
                    if response and response.text:
                        break

        if not response or not response.text:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Google Gemini AI service is currently overloaded (503"
                    f" Unavailable). Details: {str(last_error)}"
                ),
            )

        # Clean and parse JSON response from LLM
        raw_text = response.text.strip()
        cleaned_json_text = re.sub(
            r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.IGNORECASE
        ).strip()

        try:
            parsed_data = json.loads(cleaned_json_text)
            final_sql = parsed_data.get("sql", "")
            explanation = parsed_data.get("explanation", "")
            chart_type = parsed_data.get("chart_type", "table")
            suggestions = parsed_data.get("suggestions", [])
        except json.JSONDecodeError:
            final_sql = clean_sql_output(raw_text)
            explanation = ""
            chart_type = "table"
            suggestions = []

        logging.info(
            f"question={request.question!r} | "
            f"glossary_used={request.glossary is not None} | "
            f"sql={final_sql!r} | "
            f"chart_type={chart_type} | "
            f"generation_ms={elapsed_ms}"
        )

        return {
            "schema": request.schema,
            "glossary": request.glossary,
            "question": request.question,
            "generated_sql": final_sql,
            "explanation": explanation,
            "chart_type": chart_type,
            "suggestions": suggestions,
            "error": None,
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def clean_sql_output(raw_text: str) -> str:
    cleaned = re.sub(r"```sql\s*|\s*```", "", raw_text)
    return cleaned.strip()