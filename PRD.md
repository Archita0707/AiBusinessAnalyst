# Schema-Aware AI Business Analyst — Product Requirements Document

## 1\. Project Overview

**Project Name:** Schema-Aware AI Business Analyst

**Project Type:** AI-Assisted Business Intelligence Platform

**Purpose**

The Schema-Aware AI Business Analyst is a web-based analytics platform that enables non-technical users to extract insights from relational databases using natural language. By leveraging Large Language Models (LLMs) combined with database schema context and a configurable Business Glossary, the system generates accurate SQL queries. A core "Glass-Box" feature ensures transparency by allowing users to review, edit, and safely execute these generated queries in a read-only environment, translating complex data into immediate visual dashboards.

\---

## 2\. Tech Stack

|Concern|Technology|
|-|-|
|Frontend|React.js, HTML5, CSS3|
|Backend Orchestrator|ASP.NET Core Web API (C#)|
|AI Microservice|Python, FastAPI, Pandas|
|Database|Microsoft SQL Server 2022|
|ORM|Entity Framework Core|
|Authentication|ASP.NET Identity / JWT|
|AI/LLM Provider|Gemini / OpenAI API|
|Visualization|Chart.js / Recharts|

The backend ecosystem is divided into a C# ASP.NET Core API for routing, state management, and database execution, and a Python FastAPI microservice dedicated to prompt engineering and LLM communication. The React frontend consumes JSON responses. User authentication and role-based access are managed via JWTs and ASP.NET Identity.

\---

## 3\. Objectives

The system should allow users to:

* Query structured business data using conversational natural language.
* Manage a Business Glossary that maps company-specific terms to SQL logic.
* Automatically profile connected database schemas.
* Review AI-generated SQL and its plain-text explanation before execution.
* Prevent database modification through strict read-only execution constraints.
* Automatically generate appropriate charts (bar, line, pie) from query results.
* Maintain a history of analytical queries and conversations.
* Secure platform access using role-based authorization.

\---

## 4\. User Roles

Two primary roles — System Administrator (Data Steward) and Business User (Analyst).

### System Administrator

* Login / Logout
* Manage Users and Roles
* Connect new SQL Server databases or upload datasets
* Manage the Business Glossary (Add/Edit/Delete terms)
* View system logs and query history
* Access full dashboard and query capabilities

### Business User

* Login / Logout
* Ask natural language questions
* View generated SQL and explanations
* Edit generated SQL
* Execute read-only queries
* View generated charts and dashboards
* Export reports

```
Action                         Admin   Business User
----------------------------------------------------
Manage Database Connections      ✔       ✖
Manage Business Glossary         ✔       ✖
Manage Users                     ✔       ✖
Ask Natural Language Queries     ✔       ✔
Edit \\\& Execute SQL               ✔       ✔
View \\\& Export Dashboards         ✔       ✔

```

\---

## 5\. Functional Requirements

\---

### Module 1 — Authentication \& Authorization

**Purpose:** Authenticate users and protect application endpoints using JWT.

**Features:**

* Login with Username/Email and Password
* ASP.NET Identity handles password hashing
* JWT token generation and validation
* Role-based authorization via `\\\[Authorize(Roles)]`

**Backend Topics Covered:**

* ASP.NET Identity
* JWT Bearer Authentication middleware
* Role-based access control

\---

### Module 2 — Data Source Management \& Profiling

**Purpose:** Connect the platform to the data that needs to be queried.

**Features:**

* Register SQL Server connection strings
* Extract database schema (tables, columns, primary/foreign keys, data types)
* Store schema metadata locally for fast LLM context retrieval

**Backend APIs:**

```
GET    /api/datasources
POST   /api/datasources/connect
GET    /api/datasources/{id}/schema

```

**Topics Covered:**

* ADO.NET / EF Core dynamic connections
* Database reflection (System.Data metadata)

\---

### Module 3 — Business Glossary

**Purpose:** Provide semantic business context to the LLM to improve SQL accuracy.

**Each Glossary Term Contains:**

|Field|Type|Description|
|-|-|-|
|TermName|string|e.g., "Net Profit"|
|Description|string|Plain text meaning of the term|
|SQLExpression|string|e.g., `SUM(Revenue) - SUM(Cost)`|
|DataSourceId|FK|Links to the specific database schema|

**Features:** Add, Edit, Delete, View glossary terms.

**Backend APIs:**

```
GET    /api/glossary
POST   /api/glossary
PUT    /api/glossary/{id}
DELETE /api/glossary/{id}

```

**Topics Covered:**

* CRUD operations via EF Core
* Foreign key relationships

\---

### Module 4 — Schema-Aware AI Generation (Python Microservice)

**Purpose:** Translate natural language into SQL using structured context.

**System Behaviour:**

1. ASP.NET API sends the user's question, the relevant DB schema, and matching Glossary terms to the FastAPI service.
2. FastAPI constructs a highly constrained prompt.
3. The LLM generates the SQL and a brief explanation.
4. FastAPI returns the structured JSON to the ASP.NET API.

**Microservice APIs (Python):**

```
POST   /api/ai/generate-sql
Payload: { "question": "...", "schema": \\\[...], "glossary": \\\[...] }

```

**Topics Covered:**

* FastAPI endpoint creation
* Prompt engineering (few-shot prompting, schema-linking)
* LLM API integration (Gemini/OpenAI)

\---

### Module 5 — Glass-Box Validation \& Safe Execution

**Purpose:** Allow user review and safely execute the query.

**Features:**

* Display the generated SQL in a code editor UI.
* Display the natural language explanation.
* User can edit the query manually.
* Validate query to block `DROP`, `UPDATE`, `INSERT`, `DELETE`, `ALTER`.
* Execute query using a read-only database user credential.

**Backend APIs:**

```
POST   /api/query/validate
POST   /api/query/execute

```

**Topics Covered:**

* SQL parsing/regex for safety validation
* Executing raw SQL via EF Core (`DbCommand` / DataReader)
* Dynamic JSON serialization of query results

\---

### Module 6 — Dynamic Visualization \& Dashboards

**Purpose:** Turn tabular SQL results into understandable business charts.

**System Behaviour:**

1. Analyze result column data types (e.g., categorical vs. numerical/datetime).
2. Auto-select the best chart type (Line chart for time-series, Bar chart for categories, KPI cards for single values).
3. Render using React chart libraries.

**Topics Covered:**

* React state management
* Dynamic component rendering
* Chart.js / Recharts data mapping

\---

### Module 7 — Query History

**Purpose:** Maintain an audit trail and allow users to revisit past insights.

**Features:**

* Log user question, generated SQL, execution status, and timestamp.
* Display history in a sidebar.

**Backend APIs:**

```
GET    /api/history

```

\---

## 6\. Non-Functional Requirements

### Security

* ASP.NET Identity with JWT for stateless, secure API communication.
* Strict input sanitization to prevent prompt injection attacks.
* Execution of user-approved SQL must use a restricted SQL Server login with `db\\\_datareader` permissions only.

### Performance

* The LLM SQL generation process (natural language to SQL response) should complete in under 5 seconds.
* Schema metadata should be cached in memory to reduce latency during prompt construction.

### Reliability

* Graceful error handling for LLM API timeouts or token limits.
* If the LLM generates invalid SQL, the execution endpoint must catch the SQL exception and return a user-friendly database error to the UI.

### Maintainability

* Microservice architecture: Decouples the AI logic (Python) from the enterprise data management logic (C#).
* Dependency Injection utilized across the ASP.NET Core API.

\---

## 7\. System Architecture

```
User Browser (React UI)
      │  HTTP/REST (JSON)
      ▼
ASP.NET Core Web API (Orchestrator)
      │
      ├──────────────────────────────┐
      │                              │ HTTP POST (Internal)
      ▼                              ▼
SQL Server (Metadata \\\& App Data)   Python FastAPI (AI Service)
      │                              │
      │                              ▼
      │                          LLM API (Gemini/OpenAI)
      ▼
SQL Server (Target Business DB - Read Only)

```

\---

## 8\. Module Flow

```
                     Login (JWT)
                          │
            Select Database Connection
                          │
            Ask Natural Language Question
                          │
          Fetch Schema \\\& Glossary Context
                          │
           Python Microservice Generates SQL
                          │
             Glass-Box UI (Review \\\& Edit)
                          │
               Backend Safety Validation
                          │
            Read-Only Database Execution
                          │
            Dynamic Charting \\\& Visualization

```

\---

## 9\. Database Overview

|Table|Purpose|
|-|-|
|AspNetUsers|Identity user accounts|
|AspNetRoles|Identity roles (Admin, Business User)|
|DataSources|Connection strings and alias names for target databases|
|SchemaMetadata|Cached tables, columns, and relationships for prompt context|
|GlossaryTerms|Mappings of business terms to SQL expressions|
|QueryHistory|Audit log of asked questions, generated SQL, and timestamps|

*Note: The actual business data being queried (e.g., Sales, Inventory, HR tables) exists in a separate database or schema, accessed via the `DataSources` configurations.*

\---

## 10\. Topics Demonstrated

|Topic|Where Used|
|-|-|
|C# \& ASP.NET Core MVC|Core orchestrator, API controllers|
|Python \& FastAPI|AI microservice, prompt construction|
|Prompt Engineering|Schema-linking, few-shot generation|
|Entity Framework Core|Application database CRUD, migrations|
|ADO.NET (Raw SQL Execution)|Executing dynamic, user-approved queries|
|JWT Authentication|API security and user sessions|
|SQL Server Security|Read-only database user enforcement|
|React.js|Single Page Application frontend|
|Dynamic Data Visualization|Mapping SQL results to React charts|
|Microservice Communication|C# Web API calling Python REST API|



