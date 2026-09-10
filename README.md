# LogiPilot AI

### Enterprise AI Copilot for Freight & Transportation Operations

> A portfolio-grade proof of concept demonstrating how Generative AI can interact with enterprise transportation data through tool calling, SAP-style OData services, RAG, and multi-step agent orchestration.

---

## 1. Project Overview

**LogiPilot AI** is a chat-based freight operations copilot that allows logistics and transportation users to interact with shipment data using natural language instead of navigating complex enterprise transportation screens.

A user can ask questions such as:

- "Show me all delayed shipments to Germany this week."
- "What's the status of freight order 4500001234?"
- "Which carrier has the highest delay rate?"
- "Show shipment costs by carrier."
- "What are the top three destinations affected by our worst-performing carrier?"
- "What does the DELAYED status mean according to our freight process?"

The application combines:

1. **Next.js** for the web application and dashboard.
2. **Vercel AI SDK** for streaming AI interactions and tool calling.
3. **OpenAI** for natural-language understanding and reasoning.
4. **SAP CAP** for a SAP-style enterprise backend and OData API.
5. **LangChain.js** for RAG and advanced multi-step orchestration.
6. **TypeScript** across the application and service layers.
7. **SQLite** initially for a simple, local, deterministic POC database.

The POC intentionally uses **SAP CAP with mock freight data** rather than requiring access to a real SAP TM system. The CAP service is designed to represent the integration boundary that can later be replaced or connected to real SAP TM OData APIs.

---

## 2. Why This Project?

The purpose of LogiPilot AI is not to build another generic AI chatbot.

The project demonstrates a practical enterprise AI architecture:

```text
Natural Language
      ↓
LLM
      ↓
Tool Calling
      ↓
Enterprise API
      ↓
Transportation Data
      ↓
AI Reasoning
      ↓
Business Answer
```

The key idea is:

> The AI does not need to know the enterprise data beforehand. It uses controlled tools to retrieve the required information from enterprise systems and then reasons over the returned data.

This makes the project relevant to modern **AI + enterprise systems** architectures.

---

# 3. Product Vision

## Vision

Build an AI assistant that acts as a natural-language interface to transportation and freight operations.

Instead of:

```text
SAP screen
   ↓
Open Freight Orders
   ↓
Apply filters
   ↓
Search carrier
   ↓
Open shipment
   ↓
Analyze dates
```

the user can simply ask:

```text
"Which carrier has the most delayed shipments this month?"
```

The AI determines what information is required, calls the appropriate enterprise tools, analyzes the results, and presents the answer.

---

# 4. Core Capabilities

## 4.1 Freight Order Search

Example:

> What's the status of freight order 4500001234?

The AI retrieves the freight order and summarizes:

- Status
- Carrier
- Origin
- Destination
- Planned delivery
- Actual delivery
- Cost

---

## 4.2 Natural-Language Shipment Search

Example:

> Show me all delayed shipments to Germany this week.

The AI converts the request into structured filters:

```json
{
  "status": "DELAYED",
  "destinationCountry": "DE",
  "dateFrom": "2026-08-17",
  "dateTo": "2026-08-20"
}
```

The tool queries the enterprise service and returns matching shipments.

---

## 4.3 Carrier Performance Analysis

Example:

> Which carrier has the highest delay rate?

The system calculates:

```text
Carrier          Shipments    Delayed    Delay Rate
----------------------------------------------------
DHL                  50           3          6%
DSV                  40           2          5%
DB Schenker          45           9         20%
DACHSER              38           3          8%
```

The AI then explains the result in natural language.

---

## 4.4 Shipment Explanation

A user can open a shipment and select:

```text
Explain with AI
```

The AI gathers:

- Freight order
- Shipment
- Carrier
- Location
- Planned delivery
- Actual delivery
- Shipment notes

and produces a human-readable explanation of the shipment status.

---

## 4.5 Enterprise Knowledge / RAG

The assistant can also answer questions from internal freight documentation.

Example:

> What does DELAYED mean according to our freight process?

The answer comes from the project's knowledge base rather than from the transaction database.

---

## 4.6 Multi-Step Analysis

Example:

> What are the top three destinations affected by our worst-performing carrier?

The AI can perform:

```text
1. Get carrier performance
        ↓
2. Identify worst carrier
        ↓
3. Find shipments for that carrier
        ↓
4. Group shipments by destination
        ↓
5. Return top three destinations
```

This demonstrates agentic orchestration rather than simple question answering.

---

# 5. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │         User          │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      Next.js App      │
                         │                       │
                         │  Chat UI              │
                         │  Dashboard            │
                         │  Shipment Table       │
                         │  Shipment Details     │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    Vercel AI SDK      │
                         │                       │
                         │ Streaming             │
                         │ Tool Calling          │
                         │ AI Interaction        │
                         └───────────┬───────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
                     ▼                               ▼
          ┌─────────────────────┐          ┌─────────────────────┐
          │      AI Tools       │          │    LangChain.js     │
          │                     │          │                     │
          │ getFreightOrder()   │          │ RAG                 │
          │ searchShipments()   │          │ Retrieval           │
          │ getCarrier()        │          │ Agent orchestration  │
          │ getCosts()          │          │ Multi-step workflows │
          │ getPerformance()    │          │                     │
          └──────────┬──────────┘          └──────────┬──────────┘
                     │                                │
                     └──────────────┬─────────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │     Freight Service   │
                         │                       │
                         │ Node.js / TypeScript  │
                         │ SAP CAP               │
                         │ OData                 │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Mock SAP TM Data    │
                         │                       │
                         │ Freight Orders        │
                         │ Freight Units         │
                         │ Shipments             │
                         │ Carriers              │
                         │ Locations             │
                         └───────────────────────┘
```

---

# 6. AI Request Flow

A typical request follows this flow:

```text
User
 │
 │ "Show delayed shipments to Germany"
 ▼
Next.js Chat UI
 │
 ▼
Vercel AI SDK
 │
 ▼
LLM
 │
 │ Determines that shipment data is required
 ▼
searchShipments()
 │
 ▼
CAP OData Service
 │
 ▼
SQLite / CAP persistence
 │
 ▼
Shipment records
 │
 ▼
LLM
 │
 ▼
Natural-language response
```

The AI is therefore acting as an **orchestrator**, not as the system of record.

---

# 7. Technology Stack

| Layer              | Technology                                |
| ------------------ | ----------------------------------------- |
| Frontend           | Next.js                                   |
| Language           | TypeScript                                |
| UI                 | Tailwind CSS + shadcn/ui                  |
| AI UI / Streaming  | Vercel AI SDK                             |
| LLM                | OpenAI                                    |
| Tool Calling       | Vercel AI SDK tools                       |
| Agent / RAG        | LangChain.js                              |
| Backend            | Node.js                                   |
| Enterprise Service | SAP CAP                                   |
| API                | OData                                     |
| Data Model         | CDS                                       |
| Database           | SQLite                                    |
| Validation         | Zod                                       |
| Version Control    | Git                                       |
| Deployment         | Vercel + SAP BTP / CAP-compatible runtime |
| Documentation      | Markdown                                  |

---

# 8. Project Structure

The target project structure is:

```text
logipilot-ai/
│
├── README.md
├── package.json
├── .env.example
├── .gitignore
│
├── docs/
│   ├── architecture.md
│   ├── lessons.md
│   └── demo-scenarios.md
│
├── apps/
│   └── web/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── chat/
│       │   ├── dashboard/
│       │   ├── shipments/
│       │   └── api/
│       │       └── chat/
│       │
│       ├── components/
│       │   ├── chat/
│       │   ├── dashboard/
│       │   ├── shipments/
│       │   └── ui/
│       │
│       └── lib/
│
├── ai/
│   ├── tools/
│   │   ├── freight-order.ts
│   │   ├── shipments.ts
│   │   ├── carriers.ts
│   │   └── costs.ts
│   │
│   ├── agents/
│   │   └── freight-agent.ts
│   │
│   └── rag/
│       ├── loader.ts
│       ├── embeddings.ts
│       └── retriever.ts
│
├── services/
│   └── freight/
│
├── cap/
│   ├── app/
│   ├── db/
│   │   ├── schema.cds
│   │   └── data/
│   │
│   ├── srv/
│   │   └── freight-service.cds
│   │
│   └── package.json
│
├── docs-data/
│   ├── freight-order-process.md
│   ├── shipment-statuses.md
│   ├── carrier-management.md
│   └── sap-tm-glossary.md
│
└── tests/
    ├── tools/
    ├── services/
    └── ai/
```

The exact structure can evolve during implementation.

---

# 9. Enterprise Data Model

The POC intentionally uses a small subset of transportation concepts.

## FreightOrder

```text
FreightOrder
------------
ID
status
creationDate
plannedStart
plannedEnd
actualStart
actualEnd
origin
destination
carrierId
totalCost
currency
```

## FreightUnit

```text
FreightUnit
-----------
ID
freightOrderId
weight
weightUnit
volume
volumeUnit
```

## Shipment

```text
Shipment
--------
ID
freightOrderId
status
plannedDelivery
actualDelivery
origin
destination
```

## Carrier

```text
Carrier
-------
ID
name
country
rating
```

## Location

```text
Location
--------
ID
name
country
city
postalCode
```

---

# 10. Sample Business Data

The seed data should look realistic rather than like generic test records.

### Freight Orders

```text
4500001234
4500001235
4500001236
4500001237
...
```

### Carriers

```text
DHL
DB Schenker
DSV
Kuehne+Nagel
DACHSER
```

### Locations

```text
Frankfurt
Hamburg
Munich
Berlin
Cologne
Stuttgart
Rotterdam
Paris
Warsaw
Prague
```

### Shipment Statuses

```text
PLANNED
IN_TRANSIT
DELIVERED
DELAYED
CANCELLED
```

The data should intentionally contain meaningful patterns so the AI can perform analysis.

Example:

```text
DHL
50 shipments
3 delayed

DB Schenker
45 shipments
9 delayed

DSV
40 shipments
2 delayed
```

This allows meaningful questions such as:

> Which carrier has the highest delay rate?

---

# 11. AI Tools

The AI should interact with enterprise data through controlled tools.

Recommended initial tools:

```text
getFreightOrder
searchFreightOrders
getShipment
searchShipments
getCarrier
getCarrierPerformance
getShipmentCosts
getDelayedShipments
```

Example:

```typescript
searchShipments({
  status?: string;
  destinationCountry?: string;
  carrierId?: string;
  dateFrom?: string;
  dateTo?: string;
})
```

The LLM should never directly construct arbitrary database queries in the first version.

Instead:

```text
User Request
     ↓
LLM
     ↓
Validated Tool Parameters
     ↓
Tool
     ↓
CAP Service
     ↓
Data
```

This creates a much safer and more controllable architecture.

---

# 12. AI Tool Calling Example

User:

```text
Show me delayed shipments to Germany this week.
```

The LLM determines:

```json
{
  "status": "DELAYED",
  "destinationCountry": "DE",
  "dateFrom": "2026-08-17",
  "dateTo": "2026-08-20"
}
```

It then calls:

```text
searchShipments()
```

The tool calls:

```text
CAP OData API
```

The CAP service returns shipment data.

The LLM converts that data into a business-friendly response.

---

# 13. RAG Architecture

RAG is used for enterprise knowledge rather than transactional data.

Example documentation:

```text
docs-data/
├── freight-order-process.md
├── shipment-statuses.md
├── carrier-management.md
└── sap-tm-glossary.md
```

The pipeline is:

```text
Documentation
      ↓
Document Loader
      ↓
Chunking
      ↓
Embeddings
      ↓
Vector Store
      ↓
Retriever
      ↓
LangChain
      ↓
LLM
```

Example question:

> What does DELAYED mean according to our freight process?

The retriever finds the relevant documentation and the LLM generates the answer.

---

# 14. Why Use Both Vercel AI SDK and LangChain?

They serve different purposes in this POC.

### Vercel AI SDK

Use it for:

- Chat UI
- Streaming responses
- Client/server AI interaction
- Tool calling
- User experience

### LangChain.js

Use it for:

- RAG
- Document retrieval
- Multi-step orchestration
- Agent workflows
- Complex chains

The architecture deliberately avoids forcing LangChain into every request.

Simple request:

```text
Next.js
  ↓
AI SDK
  ↓
Tool
  ↓
CAP
```

Complex request:

```text
Next.js
  ↓
AI SDK
  ↓
Agent / LangChain
  ↓
Multiple tools
  ↓
CAP + RAG
  ↓
AI
```

This separation keeps the architecture understandable.

---

# 15. Multi-Step Agent Example

Question:

```text
What are the top three destinations affected by our worst-performing carrier?
```

Possible execution:

```text
Step 1
Get carrier performance
        ↓
Step 2
Identify highest delay rate
        ↓
Step 3
Search shipments for that carrier
        ↓
Step 4
Group shipments by destination
        ↓
Step 5
Rank destinations
        ↓
Step 6
Generate explanation
```

This demonstrates genuine multi-step enterprise reasoning.

---

# 16. Dashboard

The dashboard should provide a normal enterprise application experience alongside the AI interface.

Recommended metrics:

```text
┌────────────────┐ ┌────────────────┐
│ Total Shipments│ │ Delayed        │
│      248       │ │      17        │
└────────────────┘ └────────────────┘

┌────────────────┐ ┌────────────────┐
│ In Transit     │ │ Delivered      │
│      63        │ │      168       │
└────────────────┘ └────────────────┘
```

Recommended views:

- Shipment table
- Carrier performance
- Shipment status distribution
- Cost by carrier
- Delayed shipments
- Shipment detail page

---

# 17. Shipment Detail

Example:

```text
4500001234
────────────────────────────────

Status:       DELAYED

Carrier:      DHL

Origin:       Rotterdam
Destination:  Frankfurt

Planned:      Aug 18, 2026
Actual:       Aug 20, 2026

Cost:         €1,240

[ Explain with AI ]
```

The AI explanation can combine multiple enterprise entities and shipment notes.

---

# 18. Development Roadmap

The project should be developed incrementally.

## Phase 1 — Foundation

- [ ] Create Git repository
- [ ] Initialize Next.js
- [ ] Configure TypeScript
- [ ] Configure Tailwind CSS
- [ ] Add shadcn/ui
- [ ] Create application shell
- [ ] Configure environment variables

---

## Phase 2 — SAP CAP Backend

- [ ] Initialize CAP project
- [ ] Learn CDS
- [ ] Define FreightOrder
- [ ] Define FreightUnit
- [ ] Define Shipment
- [ ] Define Carrier
- [ ] Define Location
- [ ] Add associations
- [ ] Add seed data
- [ ] Expose OData services
- [ ] Test APIs

---

## Phase 3 — Dashboard

- [ ] Build dashboard
- [ ] Connect to CAP
- [ ] Display shipment KPIs
- [ ] Display shipment table
- [ ] Add filtering
- [ ] Add shipment detail page
- [ ] Add carrier performance view
- [ ] Add cost analysis

---

## Phase 4 — AI Foundation

- [ ] Configure OpenAI
- [ ] Install Vercel AI SDK
- [ ] Build chat endpoint
- [ ] Build chat UI
- [ ] Implement streaming
- [ ] Add system prompt
- [ ] Test basic conversations

---

## Phase 5 — Enterprise Tools

- [ ] Implement getFreightOrder
- [ ] Implement searchShipments
- [ ] Implement getCarrier
- [ ] Implement getCarrierPerformance
- [ ] Implement getShipmentCosts
- [ ] Add Zod validation
- [ ] Connect tools to CAP
- [ ] Test tool calls

---

## Phase 6 — Natural-Language Analytics

- [ ] Natural-language filtering
- [ ] Carrier analysis
- [ ] Delay analysis
- [ ] Cost analysis
- [ ] Date-based queries
- [ ] Destination analysis
- [ ] Result summarization

---

## Phase 7 — RAG

- [ ] Create freight documentation
- [ ] Load documents
- [ ] Chunk documents
- [ ] Generate embeddings
- [ ] Configure vector store
- [ ] Create retriever
- [ ] Integrate LangChain
- [ ] Test knowledge questions

---

## Phase 8 — Agent Orchestration

- [ ] Create agent
- [ ] Define tool selection
- [ ] Implement multi-step workflows
- [ ] Add carrier analysis workflow
- [ ] Add destination analysis workflow
- [ ] Add shipment explanation workflow

---

## Phase 9 — Enterprise UX

- [ ] Add suggested prompts
- [ ] Add tool execution indicators
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Add responsive UI
- [ ] Improve accessibility

---

## Phase 10 — Demo & Production Readiness

- [ ] Add automated tests
- [ ] Add tool tests
- [ ] Add API tests
- [ ] Add AI evaluation cases
- [ ] Add logging
- [ ] Add architecture documentation
- [ ] Add demo scenarios
- [ ] Prepare production architecture
- [ ] Deploy POC

---

# 19. Learning Roadmap

This project is also designed as a structured learning program.

## Lesson 01 — Next.js Architecture

Learn:

- App Router
- Server components
- Client components
- API routes
- Project organization

Outcome:

> Build the application shell.

---

## Lesson 02 — TypeScript Service Architecture

Learn:

- Interfaces
- Types
- Service layers
- Dependency boundaries
- Error handling

Outcome:

> Create maintainable backend/service code.

---

## Lesson 03 — SAP CAP Fundamentals

Learn:

- CAP
- CDS
- Entities
- Associations
- Services
- Local development

Outcome:

> Build a SAP-style enterprise service.

---

## Lesson 04 — OData

Learn:

- OData concepts
- Entity sets
- Filtering
- Selecting fields
- Expanding relationships

Outcome:

> Consume enterprise APIs.

---

## Lesson 05 — Data Modeling

Learn:

- Freight orders
- Freight units
- Shipments
- Carriers
- Locations
- Relationships

Outcome:

> Understand the domain model.

---

## Lesson 06 — Dashboard Development

Learn:

- Data fetching
- Tables
- Filters
- KPIs
- Charts
- Detail views

Outcome:

> Build the traditional enterprise UI.

---

## Lesson 07 — Vercel AI SDK

Learn:

- Chat
- Streaming
- Messages
- Server-side AI
- Tool calling

Outcome:

> Build the AI interaction layer.

---

## Lesson 08 — LLM Tool Calling

Learn:

- Tool definitions
- Parameters
- Schema validation
- Tool execution
- Tool results

Outcome:

> Connect an LLM to enterprise APIs.

---

## Lesson 09 — Enterprise AI

Learn:

- AI + APIs
- Grounding
- Deterministic tools
- Enterprise data boundaries
- Hallucination control

Outcome:

> Build a reliable enterprise AI interaction pattern.

---

## Lesson 10 — LangChain

Learn:

- Chains
- Retrievers
- Agents
- Tool integration
- Orchestration

Outcome:

> Build more complex AI workflows.

---

## Lesson 11 — RAG

Learn:

- Document loading
- Chunking
- Embeddings
- Vector search
- Retrieval
- Context injection

Outcome:

> Build an enterprise knowledge assistant.

---

## Lesson 12 — Multi-Step Agents

Learn:

- Agent planning
- Tool selection
- Sequential execution
- Intermediate results
- Final synthesis

Outcome:

> Build agentic enterprise workflows.

---

## Lesson 13 — AI UX

Learn:

- Streaming
- Tool status
- Loading states
- Citations
- Error handling
- Human-readable output

Outcome:

> Make AI feel like a real product.

---

## Lesson 14 — Testing AI Systems

Learn:

- Tool unit tests
- API tests
- Prompt test cases
- Evaluation datasets
- Failure scenarios

Outcome:

> Test AI behavior instead of relying only on manual demos.

---

## Lesson 15 — Production Architecture

Learn:

- Authentication
- Authorization
- Observability
- Rate limiting
- Secrets
- Enterprise API integration
- SAP BTP deployment

Outcome:

> Understand how the POC evolves into a production system.

---

# 20. Demo Scenarios

The final demonstration should focus on five scenarios.

## Demo 1 — Freight Order Status

User:

```text
What's the status of freight order 4500001234?
```

Expected behavior:

```text
AI
 ↓
getFreightOrder()
 ↓
CAP
 ↓
Freight Order
 ↓
Response
```

---

## Demo 2 — Delayed Shipments

User:

```text
Show me all delayed shipments to Germany this week.
```

Expected output:

```text
I found 7 delayed shipments.

The largest concentration is in Frankfurt and Munich.
```

Then display the shipment table.

---

## Demo 3 — Carrier Performance

User:

```text
Which carrier has the highest delay rate?
```

Expected response:

```text
DB Schenker currently has the highest delay rate at 20%.

9 of 45 shipments are delayed.
```

---

## Demo 4 — Multi-Step Analysis

User:

```text
What are the top three destinations affected by our worst-performing carrier?
```

The agent:

```text
Get performance
      ↓
Find worst carrier
      ↓
Search shipments
      ↓
Group destinations
      ↓
Rank
      ↓
Answer
```

---

## Demo 5 — Knowledge Retrieval

User:

```text
What does DELAYED mean according to our freight process?
```

Expected behavior:

```text
Question
   ↓
LangChain Retriever
   ↓
Freight documentation
   ↓
LLM
   ↓
Answer
```

---

# 21. Recommended Demo Sequence

The strongest five-minute demo is:

```text
1. "What's the status of 4500001234?"

2. "Show me delayed shipments to Germany this week."

3. "Which carrier has the highest delay rate?"

4. "What are the top three destinations affected
   by our worst-performing carrier?"

5. "What does DELAYED mean according to our
   freight process?"
```

This demonstrates:

```text
Retrieval
   +
Filtering
   +
Analytics
   +
Agentic reasoning
   +
RAG
```

---

# 22. Setup Instructions

## Prerequisites

Install:

- Node.js 20+
- npm
- Git

You do **not** need Docker for the initial POC.

---

## Clone the repository

```bash
git clone <repository-url>
cd logipilot-ai
```

---

## Install dependencies

```bash
npm install
```

If the project uses separate workspaces:

```bash
npm install --workspace apps/web
npm install --workspace cap
```

---

## Configure environment variables

Create:

```text
.env.local
```

Example:

```env
OPENAI_API_KEY=your_openai_api_key
CAP_SERVICE_URL=http://localhost:4004
```

Never commit real API keys.

---

## Start the CAP service

```bash
cd cap
npm install
npm run watch
```

The CAP service should expose the freight OData API locally.

---

## Start Next.js

From the web application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 23. Environment Configuration

Use `.env.example` as the template.

Example:

```env
OPENAI_API_KEY=
CAP_SERVICE_URL=
NEXT_PUBLIC_APP_NAME=LogiPilot AI
```

For production, secrets must be managed through the deployment platform's secret management system.

---

# 24. Security Principles

Even though this is a POC, the architecture should follow enterprise security principles.

## Never expose API keys

The OpenAI key must remain server-side.

## Validate tool inputs

Use Zod or equivalent schema validation.

## Don't allow unrestricted SQL

The initial implementation should expose controlled business tools rather than allowing the LLM to execute arbitrary SQL.

## Treat AI output as untrusted

AI-generated text should not directly trigger sensitive business operations without validation and authorization.

## Separate read and write operations

The first POC should primarily support:

```text
READ
```

rather than autonomous:

```text
WRITE
```

operations.

---

# 25. Error Handling

The AI must handle:

### Shipment not found

```text
I couldn't find freight order 4500001234.
Please verify the freight order number.
```

### CAP service unavailable

```text
I'm unable to retrieve freight data right now.
The transportation service may be unavailable.
```

### No matching shipments

```text
I couldn't find any delayed shipments matching
those criteria.
```

### Invalid tool parameters

Reject the tool call before it reaches the enterprise service.

---

# 26. Observability

A production implementation should track:

```text
Request ID
User
Timestamp
Tool invoked
Tool parameters
Execution time
Tool result status
LLM latency
Token usage
Errors
```

Do not log sensitive enterprise data unnecessarily.

---

# 27. POC vs Production

## POC

```text
Next.js
+
Vercel AI SDK
+
OpenAI
+
LangChain
+
CAP
+
SQLite
```

## Production

```text
Next.js
        ↓
Enterprise Identity
        ↓
AI Gateway / Agent Service
        ↓
Tool Layer
        ↓
SAP TM / S/4HANA
        ↓
Enterprise Data
```

Additional production components:

- Enterprise authentication
- Role-based access control
- SAP authorization
- Observability
- Audit logging
- Rate limiting
- Secrets management
- AI evaluation
- Guardrails
- Data privacy controls

---

# 28. Production Architecture

```text
                           ┌────────────────────┐
                           │        User        │
                           └─────────┬──────────┘
                                     │
                                     ▼
                           ┌────────────────────┐
                           │     Next.js UI     │
                           └─────────┬──────────┘
                                     │
                                     ▼
                           ┌────────────────────┐
                           │ Enterprise Identity│
                           │   Authentication   │
                           └─────────┬──────────┘
                                     │
                                     ▼
                           ┌────────────────────┐
                           │ AI Gateway / Agent  │
                           │      Service       │
                           └─────────┬──────────┘
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                     │
              ▼                      ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │ AI Tools     │      │ RAG Service   │      │ Analytics    │
       └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │ SAP TM APIs  │      │ Vector Store │      │ Data Platform│
       └──────┬───────┘      └──────────────┘      └──────────────┘
              │
              ▼
       ┌──────────────────┐
       │ SAP S/4HANA / TM │
       └──────────────────┘
```

The POC CAP service can therefore be replaced by the real SAP integration layer without fundamentally changing the user experience.

---

# 29. SAP Integration Strategy

The POC uses **SAP CAP** to model the enterprise boundary.

This provides:

- SAP-native development concepts
- CDS modeling
- OData services
- Node.js development
- Local development
- Deterministic demo data

The eventual production integration can connect the same business concepts to real SAP transportation services.

Conceptually:

```text
POC

AI
 ↓
CAP
 ↓
SQLite
```

becomes:

```text
Production

AI
 ↓
Enterprise Tool Layer
 ↓
SAP OData APIs
 ↓
SAP TM / S/4HANA
```

This keeps the POC realistic without requiring access to a production SAP landscape.

---

# 30. Architecture Principles

The project follows these principles:

### 1. AI is not the system of record

Enterprise systems remain authoritative.

### 2. Tools provide controlled access

The LLM accesses enterprise data through explicitly defined tools.

### 3. RAG handles knowledge

Transactional data and documentation are treated differently.

### 4. Deterministic operations stay deterministic

Filtering, calculations, and database access should happen through code rather than relying on the LLM to perform them mentally.

### 5. Start simple

Only introduce LangChain where orchestration or retrieval actually requires it.

### 6. Design for replacement

Mock services should have clear interfaces so they can later be replaced with real enterprise APIs.

---

# 31. Future Enhancements

Possible future versions could add:

- [ ] Real SAP TM integration
- [ ] SAP BTP deployment
- [ ] Microsoft Entra / enterprise authentication
- [ ] Role-based access control
- [ ] Shipment map
- [ ] Route visualization
- [ ] Real-time tracking
- [ ] Email drafting
- [ ] Carrier notification workflow
- [ ] Exception management
- [ ] Predictive delay detection
- [ ] Cost anomaly detection
- [ ] Natural-language report generation
- [ ] Voice interface
- [ ] Human approval workflows
- [ ] Agent evaluation framework
- [ ] Enterprise observability
- [ ] Audit trails

---

# 32. What This Project Demonstrates

This project demonstrates practical knowledge across several areas.

### Frontend

- Next.js
- React
- TypeScript
- Enterprise dashboards
- AI chat interfaces

### Backend

- Node.js
- Service architecture
- REST/OData concepts
- Data modeling
- API integration

### SAP

- SAP CAP
- CDS
- OData
- Enterprise service modeling
- SAP TM domain concepts

### AI

- LLM integration
- Streaming
- Tool calling
- Structured outputs
- Agent orchestration
- RAG
- Embeddings
- Enterprise grounding

### Architecture

- AI + enterprise systems
- Service boundaries
- Controlled tool access
- Production evolution
- Security considerations

---

# 33. Portfolio / Interview Story

A concise way to explain the project:

> **LogiPilot AI is an enterprise freight operations copilot built with Next.js, TypeScript, Vercel AI SDK, OpenAI, LangChain.js, and SAP CAP. It allows logistics users to query transportation data using natural language. The AI uses controlled tool calling to retrieve freight orders, shipments, carrier performance, and costs from a SAP-style OData service. LangChain is used for enterprise-document RAG and multi-step agent workflows. The POC uses CAP with mock data but is architected so the service layer can later connect to real SAP TM APIs.**

---

# 34. Definition of Done

The POC is considered complete when a user can:

- [ ] Open the LogiPilot AI dashboard
- [ ] View shipment KPIs
- [ ] Browse freight orders
- [ ] View shipment details
- [ ] Ask natural-language questions
- [ ] Retrieve real data from CAP
- [ ] Use AI tool calling
- [ ] Search delayed shipments
- [ ] Analyze carrier performance
- [ ] Analyze shipment costs
- [ ] Ask knowledge-base questions
- [ ] Receive RAG-grounded answers
- [ ] Execute at least one multi-step AI workflow
- [ ] See tool execution states
- [ ] Handle errors gracefully
- [ ] Run the entire POC locally
- [ ] Demonstrate the application in approximately five minutes

---

# 35. Final Architecture Summary

The core architecture can be summarized as:

```text
                 LOGIPILOT AI

                    User
                     │
                     ▼
                Next.js UI
                     │
                     ▼
               Vercel AI SDK
                     │
                     ▼
                    LLM
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       AI Tools             LangChain
          │                     │
          │                 ┌───┴────┐
          │                 │        │
          │                RAG     Agents
          │                 │        │
          └─────────┬───────┴────────┘
                    │
                    ▼
                CAP Service
                    │
                    ▼
                OData API
                    │
                    ▼
             Freight Data
```

The central principle is:

> **Natural language becomes a controlled interface to enterprise systems.**

---

# 36. License

This project is intended as a portfolio and educational proof of concept.

Add the appropriate license before public distribution.

---

## Project Status

**Status:** 🚧 Proof of Concept

**Project:** LogiPilot AI

**Focus:** Enterprise AI + SAP Transportation + Generative AI + Agentic Workflows

**Primary Stack:** Next.js · TypeScript · Vercel AI SDK · OpenAI · LangChain.js · SAP CAP · OData
