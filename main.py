import json
import logging 
import os
import re
import time
import requests
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from langchain_core.language_models import LLM
# from google import genai
from pydantic import BaseModel

load_dotenv()

logging.basicConfig(
    filename="ai_service.log",
    level=logging.INFO,
    format="%(asctime)s | %(message)s"
)

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "schema3388")

class CustomLLM(LLM):
    model: str
    endpoint_url: str = os.getenv("API_URL", "")
    headers: dict = {
        "Content-Type": "application/json",
        "X-API-KEY": os.getenv("API_KEY", "")
    }
    temperature: float = 0.5
    top_p: float = 0.9
    max_tokens: int = 2000

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": self.temperature,
            "top_p": self.top_p,
            "max_tokens": self.max_tokens
        }
        response = requests.post(self.endpoint_url, headers=self.headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    @property
    def _llm_type(self) -> str:
        return "custom-llm"

llm = CustomLLM(model=os.getenv("MODEL_NAME", "gpt-5-2"))


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

        elapsed_ms = 0.0
        max_attempts = 4
        base_delay = 2
        raw_text = None
        last_error = None

        for attempt in range(max_attempts):
            try:
                start_time = time.time()
                raw_text = llm.invoke(prompt)
                elapsed_ms = round((time.time() - start_time) * 1000, 2)
                if raw_text:
                    break
            except Exception as e:
                last_error = e
                is_retryable = any(
                    code in str(e) for code in ["503", "502", "overloaded", "unavailable"]
                )
                if is_retryable and attempt < max_attempts - 1:
                    delay = base_delay * (2 ** attempt)
                    logging.warning(
                        f"LLM attempt {attempt + 1}/{max_attempts} failed. "
                        f"Retrying in {delay}s. Error: {str(e)}"
                    )
                    time.sleep(delay)
                    continue
                else:
                    break

        if not raw_text:
            raise HTTPException(
                status_code=503,
                detail=f"LLM service unavailable after {max_attempts} attempts. Details: {str(last_error)}"
            )

        raw_text = raw_text.strip()

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