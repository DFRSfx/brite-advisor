<div align="center">

# 🏛️ BRITE Advisor

### *Business-Referenced Integration Technology Election*
**AI-Powered Enterprise Integration Architecture Diagnostic & Advisory Platform**

[![CI Build Status](https://github.com/DFRSfx/brite-advisor/actions/workflows/ci.yml/badge.svg)](https://github.com/DFRSfx/brite-advisor/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4.svg?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-the-brite-framework">BRITE Framework</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

</div>

---

## 📋 Overview

Modern enterprise integration often suffers from two opposing traps: **costly over-engineering** (implementing complex distributed event meshes when simple REST APIs suffice) and **fragile under-engineering** (relying on point-to-point batch files when real-time omnichannel consistency is required).

**BRITE Advisor** solves this dilemma. It is an interactive, full-stack decision-support system implementing the **BRITE Framework** (*Business-Referenced Integration Technology Election*). Through a structured 4-step diagnostic wizard, BRITE Advisor evaluates an organization's:
1. **Ecosystem Complexity (Axis X)** — Sales channels, external integrations, partner networks, and omnichannel boundaries.
2. **Synchronization Demand (Axis Y)** — Latency tolerance, real-time inventory visibility, real-time personalization, and mission-critical transactions.

It maps the company into one of four architectural quadrants and leverages **Google Gemini 2.0 Flash** to synthesize tailored, pragmatic architectural guidance, technology stack recommendations, and a progressive migration roadmap.

---

## 🧭 The BRITE Framework

The BRITE Framework establishes a deterministic, business-grounded 2x2 decision matrix:

```
    Synchronization Demand (Axis Y)
       ▲
       │
Real-  │      [ Q2: Agility / iPaaS ]          │    [ Q4: State of the Art ]
Time   │      Linear Ecosystem                 │    Distributed Ecosystem
       │      Synchronous / Real-Time          │    Synchronous / Real-Time
       │      • REST APIs & Managed iPaaS      │    • Event-Driven (Kafka / Mesh)
       │      • Low latency SLAs               │    • Microservices & CDC
       ├───────────────────────────────────────┼────────────────────────────────────────
Batch  │      [ Q1: Basic / Direct ]           │    [ Q3: Legacy / Pipeline ]
 /     │      Linear Ecosystem                 │    Distributed Ecosystem
Async  │      Batch / Delayed Tolerant         │    Batch / Asynchronous
       │      • Point-to-Point & Webhooks      │    • ESB / EDI & ETL Pipelines
       │      • CSV/SFTP Data Transfers        │    • Monolithic ERP Data Hubs
       │
       └───────────────────────────────────────┴────────────────────────────────────────►
                  Linear                                  Distributed / Omnichannel
                               Ecosystem Complexity (Axis X)
```

### Quadrant Classifications

| Quadrant | Architecture Archetype | Core Tech Stack | Typical Business Context |
|---|---|---|---|
| **Q1 (Basic)** | Direct Point-to-Point / Batch | Scheduled ETL, Webhooks, REST, SFTP | Startups and early-stage companies with 1-2 channels and tolerance for deferred sync. |
| **Q2 (Agility)** | Managed iPaaS / Central API Gateway | MuleSoft, Boomi, Workato, AWS API Gateway | Fast-growing SMEs needing real-time customer data across a contained set of endpoints. |
| **Q3 (Legacy)** | Enterprise Service Bus / Data Hub | IBM MQ, BizTalk, Airflow, Batch EDI | Established enterprises with vast legacy ERPs and high transaction volumes without sub-second demands. |
| **Q4 (State of the Art)**| Composable Event-Driven Mesh | Apache Kafka, Flink, Event Mesh, GraphQL Federation | Large-scale enterprises with omnichannel commerce, multi-region partners, and real-time inventory SLAs. |

> **Evolutionary Path**: The framework advocates a pragmatic migration trajectory (**Q1 → Q2 → Q4**), deliberately bypassing high-overhead legacy ESB patterns (**Q3**) unless constrained by legacy systems.

---

## ✨ Key Features

- **⚡ 4-Step Interactive Diagnostic Wizard**:
  - Step 1: Company Profile (Industry, Business Model, Size)
  - Step 2: Ecosystem Complexity Assessment (Channel count, integration density, omnichannel footprint)
  - Step 3: Synchronization Demand Assessment (Latency tolerance, real-time inventory, mission-critical transactions)
  - Step 4: Verification & Diagnostic Execution
- **🤖 Grounded AI Architectural Diagnosis**:
  - Deterministic mathematical classifier computes normalized scores (0–10) for both axes.
  - Passes deterministic quadrant boundaries to **Google Gemini 2.0 Flash** with a senior consultant system prompt.
  - Implements exponential backoff and `Retry-After` rate-limit handling for high reliability.
  - AI analysis can be regenerated on demand.
- **📊 2x2 Architectural Matrix Visualizer**:
  - Interactive SVG-driven 2x2 matrix dynamically highlights the organization's classified quadrant with coordinate indicators.
- **🗺️ Adaptive Migration Roadmap**:
  - Step-by-step phased transition roadmap (Immediate, Medium-Term, Long-Term target state).
- **📄 Executive PDF Report Generation**:
  - Generates polished, printable executive PDF reports on the fly via server-side `PDFKit` streaming.
- **📈 Global Analytics Dashboard**:
  - Visualizes aggregate assessments across industries, company sizes, and quadrant distributions using `Recharts`.
- **🔐 Frictionless Authentication & Session Management**:
  - Assessments can be executed anonymously and saved later.
  - Secure HTTP-only cookie-based authentication with `JWT` and `bcryptjs`.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client (React 18 + Vite + Tailwind)"]
        UI[Wizard & UI Components]
        Store[Zustand & React State]
        Matrix[2x2 Visual Matrix]
        Analytics[Recharts Analytics]
    end

    subgraph Server ["Server (Node.js + Express)"]
        API[Express REST API]
        Limiter[Rate Limiter & Cookie Parser]
        Classifier[Deterministic BRITE Classifier]
        PDFGen[PDFKit Report Generator]
        AuthService[JWT & Bcrypt Auth]
    end

    subgraph External ["External Services & Storage"]
        Gemini[Google Gemini 2.0 Flash]
        Postgres[(PostgreSQL Database)]
    end

    UI -->|HTTP / JSON| API
    API --> Limiter
    Limiter --> Classifier
    Classifier -->|Axis Scores & Quadrant| API
    API -->|Prompt with Grounded Context| Gemini
    Gemini -->|Architectural Diagnosis| API
    API -->|Store Assessment| Postgres
    API -->|Generate Report| PDFGen
    PDFGen -->|Binary PDF Stream| Client
    Postgres -->|Analytics Data| Analytics
```

### Diagnostic Decision Flow

```mermaid
flowchart LR
    A[User Form Inputs] --> B[Calculate Ecosystem Score 0-10]
    A --> C[Calculate Sync Score 0-10]
    B --> D{Score <= 5.0?}
    C --> E{Score <= 5.0?}
    D -- Linear --> F{Sync <= 5.0?}
    D -- Distributed --> G{Sync <= 5.0?}
    F -- Batch --> Q1[Quadrant Q1: Basic]
    F -- Real-Time --> Q2[Quadrant Q2: Agility]
    G -- Batch --> Q3[Quadrant Q3: Legacy]
    G -- Real-Time --> Q4[Quadrant Q4: State of the Art]
    Q1 & Q2 & Q3 & Q4 --> H[Gemini 2.0 Consultant Synthesis]
    H --> I[Executive Output & PDF Report]
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + Base UI
- **State & Forms**: [Zustand](https://github.com/pmndrs/zustand) + [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations & Graphics**: [Framer Motion](https://www.framer.com/motion/) + MagicUI meteors and shiny text
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) + `remark-gfm`
- **Routing**: [React Router v7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js 20+](https://nodejs.org/) with ES Modules
- **Framework**: [Express 4](https://expressjs.com/) + TypeScript
- **Database Client**: [postgres.js](https://github.com/porsager/postgres) with connection pooling and SSL support
- **AI Integration**: [Google Gemini 2.0 Flash](https://ai.google.dev/) via REST API with exponential backoff
- **PDF Generation**: [PDFKit](https://pdfkit.org/) streaming directly to HTTP response
- **Security & Validation**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [cookie-parser](https://github.com/expressjs/cookie-parser), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [cors](https://github.com/expressjs/cors), [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later
- **PostgreSQL**: Local database or cloud instance (e.g. Neon, Supabase, Railway)
- **Google Gemini API Key**: Free tier key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/DFRSfx/brite-advisor.git
cd brite-advisor
```

### 2. Environment Configuration

#### Frontend (`.env`)
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
```env
# Frontend environment variables
VITE_API_URL=http://localhost:3001
```

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:
```bash
cp server/.env.example server/.env
```
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
ALLOWED_ORIGIN=http://localhost:5173
JWT_SECRET=your-random-32-char-secret-string
```

> **Note**: Database tables (`users`, `assessments`) and extensions (`pgcrypto`) are automatically created on first server startup via safe `CREATE TABLE IF NOT EXISTS` migrations.

### 3. Install Dependencies

Install root (frontend) and server dependencies:

```bash
# Install frontend dependencies
npm install

# Install server dependencies
npm --prefix server install
```

### 4. Run Locally

Open two terminal windows (or use the npm scripts):

**Terminal 1 — Server:**
```bash
npm run server:dev
```
*Server starts on `http://localhost:3001`.*

**Terminal 2 — Frontend:**
```bash
npm run dev
```
*Frontend starts on `http://localhost:5173`.*

---

## 📜 NPM Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite frontend dev server with hot module reloading (`localhost:5173`) |
| `npm run build` | Typechecks and compiles frontend into static bundle in `dist/` |
| `npm run preview` | Previews production build of the frontend locally |
| `npm run server:dev` | Runs backend in watch mode using `tsx` (`localhost:3001`) |
| `npm run server:build` | Compiles backend TypeScript to `server/dist/` |
| `npm run server:start` | Runs compiled backend from `server/dist/index.js` |
| `npm run build:all` | Compiles both client and server sequentially |

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/diagnose` | Run BRITE classification, call Gemini AI, save assessment | Optional |
| `POST` | `/api/diagnose/:id/regenerate`| Regenerate AI architectural analysis for existing assessment | Optional |
| `POST` | `/api/assessments/:id/save` | Associate an anonymous assessment with the logged-in user | Cookie Auth |
| `GET` | `/api/report/:id` | Generate and stream executive PDF report | Public |
| `GET` | `/api/analytics` | Fetch aggregated diagnostic benchmarks and quadrant metrics | Public |
| `POST` | `/api/auth/register` | Register a new user account and set HTTP-only cookie | Public |
| `POST` | `/api/auth/login` | Log into account and receive HTTP-only session cookie | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Cookie Auth |
| `POST` | `/api/auth/logout` | Clear authentication cookie | Public |
| `GET` | `/health` | Healthcheck endpoint (`{"status": "ok"}`) | Public |

---

## 📁 Project Structure

```
brite-advisor/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (typecheck & production builds)
├── public/                      # Static assets (favicons, icons)
├── server/                      # Express backend service
│   ├── src/
│   │   ├── classifier.ts        # BRITE scoring & quadrant classifier
│   │   ├── db.ts                # PostgreSQL schema & database queries
│   │   ├── index.ts             # Express server setup & API routes
│   │   ├── pdf.ts               # PDFKit executive report generator
│   │   ├── prompts.ts           # Gemini system prompt & prompt builders
│   │   └── types.ts             # Backend TypeScript interfaces
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Backend dependencies
│   └── tsconfig.json            # Server TypeScript configuration
├── src/                         # React frontend application
│   ├── components/
│   │   ├── brite/
│   │   │   ├── AuthModal.tsx    # Sign-in / registration modal
│   │   │   ├── WizardShell.tsx  # Multi-step wizard coordinator
│   │   │   ├── results/         # Result display & matrix components
│   │   │   ├── shared/          # Badges & step indicators
│   │   │   └── steps/           # Steps 1 to 4 form screens
│   │   ├── magicui/             # Visual animation primitives
│   │   └── ui/                  # Reusable UI primitives (shadcn)
│   ├── hooks/                   # Custom React hooks (wizard state, API calls)
│   ├── lib/                     # Client utilities & classification helpers
│   ├── pages/                   # Diagnostic, Analytics, Legal pages
│   ├── types/                   # Frontend TypeScript types
│   ├── App.tsx                  # Application layout & client routes
│   ├── index.css                # Tailwind CSS design system tokens
│   └── main.tsx                 # Client entry point
├── .env.example                 # Frontend environment template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point with Open Graph metadata
├── LICENSE                      # MIT License
├── package.json                 # Project configuration & npm scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # Frontend TypeScript configuration
└── vite.config.ts               # Vite configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/DFRSfx">DFRSfx</a> to make enterprise architecture decisions transparent, grounded, and accessible.</sub>
</div>
