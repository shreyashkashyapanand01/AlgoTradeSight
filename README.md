# AlgoTradeSight — AI Trading Coach & Portfolio Optimizer

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.3-brightgreen?style=flat-square&logo=springboot" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-teal?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/LangGraph-Agentic%20AI-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/Redis-Cache-red?style=flat-square&logo=redis" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql" />
</p>

---




------------------------------------------------------------

## 🔗 Project Repositories

- 🤖 **AI Engine (Python + LangGraph)**  
  https://github.com/shreyashkashyapanand01/migrating_Stock_AI_Engine

- ⚙️ **Backend API (Spring Boot)**  
  https://github.com/shreyashkashyapanand01/AI_Trading_BACKEND

- 🎨 **Frontend (React 19)**  
  https://github.com/shreyashkashyapanand01/AI_Trading_UI

---

## 📌 Note on Repository Structure

AlgoTradeSight was originally developed as a **distributed system across three separate repositories** — one for the AI Engine, one for the Backend API, and one for the Frontend UI. This separation was intentionally designed to follow **real-world software engineering practices**, enabling independent development, scalability, and a clear separation of concerns.

This repository serves as a **centralized project hub**, created specifically to provide a **unified overview of the entire system**. It consolidates all components in one place to make it easier for reviewers, recruiters, and collaborators to understand the complete architecture, system flow, and integration between services without navigating multiple repositories individually.

By combining the documentation here, the project becomes more **accessible, well-structured, and resume-friendly**, while the actual implementation remains modular and maintained in their respective repositories.

------------------------------------------------------------



## 🚀 Overview

**AlgoTradeSight** is a full-stack, AI-powered stock trading intelligence platform built for retail investors in the Indian equity market. It combines a **multi-agent AI engine** (powered by LangGraph + Groq/Gemini LLMs) with a **Spring Boot API gateway** and a **React 19 dashboard** to deliver real-time stock analysis, autonomous market scanning, trade behavior coaching, and portfolio health assessment.

### Problem It Solves
Retail investors lack access to institutional-grade tools that simultaneously evaluate technical signals, fundamental health, market sentiment, and portfolio risk in one place. AlgoTradeSight bridges this gap by orchestrating specialized AI agents that collaborate to generate structured, data-grounded investment decisions — in seconds.

### Who It's For
- Retail equity investors trading on NSE/BSE
- Quantitative finance enthusiasts building AI-powered trading tools
- Software engineers learning multi-agent LLM system design

---

## 🧠 Features

- **Multi-Agent Stock Analysis** — Parallel AI agents analyze Technical, Fundamental, and News signals independently and feed results into a Decision Agent that synthesizes a final verdict (Strong Buy / Buy / Hold / Wait / Avoid).
- **Quantitative Decision Scoring** — A deterministic scoring layer (Technical 40% + Fundamental 40% + News Sentiment 20%) grounds LLM decisions in hard numbers before generating the advisory summary.
- **Autonomous Market Scanner** — A 4-stage LangGraph pipeline that fetches top NSE sector performers, runs the full AI analysis on each, scores opportunities on momentum + AI signals, and returns a ranked opportunity list.
- **Trade Behavior Coach** — Upload a CSV or paste JSON trades and receive a psychological analysis: trader archetype classification, behavioral mistake detection (e.g. overtrading, revenge trading), and 3 personalized coaching suggestions.
- **Portfolio Health Engine** — A 6-node LangGraph pipeline that calculates portfolio metrics (Sharpe Ratio, Beta, Volatility), runs sector diversification analysis, simulates market crash / interest rate stress tests, performs per-stock sentiment analysis concurrently, and produces an overall health score with actionable rebalancing suggestions.
- **Redis Caching Layer** — Dual-layer Redis caching (Python AI Engine + Spring Boot Gateway) with a 2-hour TTL ensures repeated stock queries are served instantly without burning LLM API quota.
- **Live TradingView Charts** — Embedded real-time candlestick charts from TradingView for every analyzed stock.
- **User & Portfolio Management** — MySQL-backed CRUD for users and their holdings, managed through the Spring Boot backend.
- **One-Command Startup** — A single `start_all.bat` launches Redis, the Python AI Engine, the Java Gateway, and the React UI in four separate terminals.

---

## 🛠 Tech Stack

### Languages
| Language | Role |
|---|---|
| Java 17 | Backend API gateway and data persistence |
| Python 3.11 | AI engine and multi-agent orchestration |
| JavaScript (React 19) | Frontend dashboard |

### Frameworks & Libraries

**Python AI Engine**
| Library | Purpose |
|---|---|
| FastAPI + Uvicorn | High-performance async API server |
| LangGraph | Stateful multi-agent graph orchestration |
| LangChain + LangChain-Groq | LLM integration and ReAct agent framework |
| Groq API (Llama 3.3 70B) | Primary LLM for agent reasoning |
| Google Gemini API | Alternate LLM provider |
| yfinance | Real-time and historical stock data |
| Tavily | AI-optimized web search for news retrieval |
| Redis (redis-py) | Response caching |
| Pydantic | Schema validation |
| Pandas / NumPy | Quantitative metrics computation |

**Spring Boot Backend**
| Library | Purpose |
|---|---|
| Spring Boot 4.0.3 (WebMVC) | REST API gateway |
| Spring Data JPA + Hibernate | ORM and database management |
| Spring Data Redis + Spring Cache | Redis integration with annotation-based caching |
| MySQL Connector 8.0.33 | RDBMS driver |
| Yahoo Finance API | Market ticker data |
| Lombok | Boilerplate reduction |

**React Frontend**
| Library | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework and build tool |
| TailwindCSS 4 | Utility-first styling |
| Framer Motion | Animation and page transitions |
| Recharts | Portfolio charts and data visualization |
| TanStack Table | Trade history table with sorting/filtering |
| react-ts-tradingview-widgets | Embedded live TradingView charts |
| Axios | HTTP API client |
| react-hot-toast | Notification toasts |
| Lucide React | Icon library |

### Infrastructure & Tools
- **Docker / Docker Compose** — Redis containerization
- **Maven** — Java build and dependency management
- **uv** — Fast Python package manager
- **MySQL** — Relational database for users and holdings
- **Redis** — In-memory cache (TTL: 2 hours)

---

## 📂 Project Structure

```
Migration/
│
├── docker-compose.yml              # Redis container configuration
├── start_all.bat                   # One-click launcher for all 4 services
│
├── stock_trading_ai_engine/        # 🐍 Python AI Engine (FastAPI, Port 8000)
│   ├── app/
│   │   ├── main.py                 # FastAPI app factory, CORS, router registration
│   │   ├── config.py               # Global config loader
│   │   ├── logging_config.py       # Structured logging setup
│   │   │
│   │   ├── api/                    # FastAPI route handlers
│   │   │   ├── stock_api.py        # GET /analyze-stock/{symbol} (with Redis cache)
│   │   │   ├── scan_api.py         # GET /scan-market
│   │   │   ├── trade_api.py        # POST /analyze-trades, POST /upload-trades
│   │   │   └── portfolio_api.py    # POST /portfolio-analyze
│   │   │
│   │   ├── graphs/                 # LangGraph pipeline definitions
│   │   │   ├── stock_graph.py      # Fan-out (Technical|News|Fundamental) → Decision
│   │   │   ├── scan_graph.py       # Universe → Analysis → Scoring → Ranking
│   │   │   ├── trade_graph.py      # Metrics → Pattern → Behaviour
│   │   │   └── portfolio_graph.py  # Metrics → Diversification → Stress → Sentiment → Decision → Finalizer
│   │   │
│   │   ├── agents/                 # Specialized LLM agents (ReAct pattern)
│   │   │   ├── technical_agent.py  # Technical indicators + trend analysis
│   │   │   ├── fundamental_agent.py# PE ratio, revenue growth, valuation classification
│   │   │   ├── news_agent.py       # Headlines scraping + sentiment
│   │   │   ├── decision_agent.py   # Weighted scoring + LLM advisory summary
│   │   │   ├── behaviour_agent.py  # Trader psychology + coaching suggestions
│   │   │   ├── sentiment_agent.py  # Concurrent per-holding news sentiment (ThreadPoolExecutor)
│   │   │   └── portfolio_agent.py  # Portfolio health scoring + rebalancing actions
│   │   │
│   │   ├── tools/                  # LangChain tool definitions
│   │   │   ├── stock_tools.py      # get_technical_indicators, get_fundamental_data, get_news_headlines
│   │   │   ├── market_data_tool.py # fetch_latest_price, get_stock_name
│   │   │   ├── portfolio_tools.py  # assess_portfolio_health, run_portfolio_stress_test
│   │   │   ├── trade_tools.py      # classify_trader_profile
│   │   │   └── indicator_tool.py   # RSI, momentum, volatility calculators
│   │   │
│   │   ├── analysis/               # Pure computation utilities (no LLM)
│   │   │   ├── metrics_calculator.py       # Win rate, RR ratio, drawdown
│   │   │   ├── pattern_detector.py         # Behavioral mistake detection
│   │   │   ├── portfolio_metrics_calculator.py  # Sharpe, Beta, Volatility
│   │   │   └── diversification_analyzer.py      # Sector exposure mapping
│   │   │
│   │   ├── scoring/
│   │   │   └── opportunity_scorer.py  # Rule-based AI signal → opportunity score
│   │   │
│   │   ├── state/                  # LangGraph TypedDict state schemas
│   │   │   ├── stock_state.py
│   │   │   ├── scan_state.py
│   │   │   ├── trade_state.py
│   │   │   └── portfolio_state.py
│   │   │
│   │   ├── schemas/                # Pydantic request/response models
│   │   └── data/                   # Universe providers (NSE sector data)
│   │
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── run.py
│
├── Ai_Trading_Coach_backend/       # ☕ Spring Boot Gateway (Port 8080)
│   ├── src/main/java/com/shreyas/
│   │   └── Ai_Trading_Coach_backend/
│   │       ├── controller/
│   │       │   ├── StockController.java       # Proxies to Python AI engine
│   │       │   ├── ScanController.java
│   │       │   ├── TradeController.java
│   │       │   ├── PortfolioController.java   # Holdings CRUD + AI analysis
│   │       │   ├── MarketController.java      # Live ticker data (Yahoo Finance)
│   │       │   └── UserController.java        # User management CRUD
│   │       ├── service/
│   │       │   ├── AiServiceClient.java       # RestTemplate HTTP client to Python engine
│   │       │   ├── StockService.java
│   │       │   ├── ScanService.java
│   │       │   ├── TradeService.java
│   │       │   ├── PortfolioService.java
│   │       │   ├── MarketService.java
│   │       │   └── UserService.java
│   │       ├── entity/
│   │       │   ├── User.java                  # JPA entity
│   │       │   └── Holding.java               # User stock holding
│   │       ├── repo/
│   │       │   ├── UserRepository.java
│   │       │   └── HoldingRepository.java
│   │       ├── dto/                           # Request/Response DTOs
│   │       ├── parser/
│   │       │   └── TradeParserService.java    # CSV trade file parser
│   │       └── config/
│   │           ├── WebConfig.java             # CORS configuration
│   │           └── RestTemplateConfig.java
│   ├── src/main/resources/
│   │   └── application.properties             # DB, Redis, API keys, market symbols
│   └── pom.xml
│
└── Ai_Trading_UI/ai-trading-ui/   # ⚛️ React 19 Frontend (Port 5173)
    ├── src/
    │   ├── App.jsx                 # Root layout: Sidebar + TopNav + page routing
    │   ├── pages/
    │   │   ├── DashboardPage.jsx   # Overview cards and quick-access
    │   │   ├── StockPage.jsx       # Stock analysis + TradingView chart
    │   │   ├── ScanPage.jsx        # Market opportunity scanner results
    │   │   ├── TradePage.jsx       # Trade upload, CSV import, behavior coaching
    │   │   └── PortfolioPage.jsx   # Holdings CRUD + AI portfolio analysis
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── TopNav.jsx
    │   │   └── ui.jsx              # Shared UI primitives (Badge, MetricBar, TypingText, etc.)
    │   ├── services/
    │   │   └── api.js              # Axios API client — all service calls
    │   ├── context/
    │   ├── hooks/
    │   └── utils/
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Installation & Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Java JDK | 17+ |
| Apache Maven | 3.9+ |
| Python | 3.11+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| Docker Desktop | Latest (for Redis) |
| uv (Python package manager) | Latest |

Install `uv`:
```bash
pip install uv
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/shreyashkashyapanand01/AlgoTradeSight.git
cd AlgoTradeSight
```

---

### 2. Configure Environment Variables

#### Python AI Engine — `stock_trading_ai_engine/.env`
```env
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
NEWS_API_KEY=your_newsapi_key

# Choose your LLM provider
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
# or
# LLM_PROVIDER=gemini
# GEMINI_MODEL=gemini-1.5-flash

REDIS_URL=redis://localhost:6379/0
```

#### Spring Boot Backend — `Ai_Trading_Coach_backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_trading
spring.datasource.username=root
spring.datasource.password=your_password

alphavantage.api.key=your_alphavantage_key
spring.cache.redis.time-to-live=2h
```

#### React Frontend — `Ai_Trading_UI/ai-trading-ui/.env`
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

### 3. Set Up MySQL Database

```sql
CREATE DATABASE ai_trading;
```

> Tables are auto-created by Hibernate on first boot (`spring.jpa.hibernate.ddl-auto=update`).

---

### 4. Install Dependencies

**Python AI Engine:**
```bash
cd stock_trading_ai_engine
uv sync
```

**React Frontend:**
```bash
cd Ai_Trading_UI/ai-trading-ui
npm install
```

**Spring Boot Backend** (Maven downloads dependencies automatically on build/run).

---

## ▶️ Usage

### Option A — One-Click Launch (Windows)

From the project root:
```bash
start_all.bat
```

This launches all 4 services in sequence:
1. **Redis** on port `6379` (via Docker)
2. **Python AI Engine** on port `8000`
3. **Spring Boot Gateway** on port `8080`
4. **React UI** on port `5173`

---

### Option B — Manual Launch

**Step 1 — Start Redis:**
```bash
docker-compose up -d
```

**Step 2 — Start Python AI Engine:**
```bash
cd stock_trading_ai_engine
uv run uvicorn app.main:app --reload --port 8000
```

**Step 3 — Start Spring Boot Backend:**
```bash
cd Ai_Trading_Coach_backend
./mvnw spring-boot:run
```

**Step 4 — Start React Frontend:**
```bash
cd Ai_Trading_UI/ai-trading-ui
npm run dev
```

Open your browser at **http://localhost:5173**

---

### Example Workflows

**Analyze a stock:**
```
Dashboard → Stock Advisor → Type "TCS" → Click Analyze
```

**Scan the market:**
```
Dashboard → Market Scanner → Click "Scan Now"
→ Returns ranked NSE opportunities with AI scores
```

**Upload trades for behavior coaching:**
```
Dashboard → Trade Analysis → Upload CSV or paste JSON
→ Receive trader archetype, behavioral mistakes, coaching tips
```

**Analyze your portfolio:**
```
Dashboard → Portfolio → Add Holdings → Click "Analyze with AI"
→ Health score, stress test, sentiment, rebalancing actions
```

---

## 📊 API Endpoints

### Python AI Engine (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analyze-stock/{symbol}` | Run full multi-agent analysis for a stock. Redis-cached (2h TTL). |
| `GET` | `/scan-market` | Autonomous 4-stage NSE market scan — returns ranked opportunities. |
| `POST` | `/analyze-trades` | Analyze trade list (JSON) — metrics, patterns, behavior coaching. |
| `POST` | `/upload-trades` | Upload `.csv` trade file — same analysis pipeline. |
| `POST` | `/portfolio-analyze` | Full 6-node portfolio analysis — health score, stress test, sentiment. |

### Spring Boot Gateway (Port 8080)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stock/{symbol}` | Proxied stock analysis (Spring Cache layer) |
| `GET` | `/stock/scan` | Proxied market scan |
| `POST` | `/trade/analyze` | Proxied trade analysis |
| `POST` | `/trade/upload` | CSV trade upload (parsed by Spring, forwarded to Python) |
| `GET` | `/portfolio/analyze/{userId}` | Fetch holdings and trigger AI portfolio analysis |
| `GET` | `/portfolio/holding/{userId}` | Get all holdings for a user |
| `POST` | `/portfolio/holding/{userId}` | Add a new holding |
| `PUT` | `/portfolio/holding/{holdingId}` | Update a holding |
| `DELETE` | `/portfolio/holding/{holdingId}` | Delete a holding |
| `POST` | `/user` | Create a new user |
| `GET` | `/user` | List all users |
| `GET` | `/user/{id}` | Get user by ID |
| `PUT` | `/user/{id}` | Update user |
| `DELETE` | `/user/{id}` | Delete user |
| `GET` | `/api/market/ticker` | Live market ticker (Yahoo Finance) |

---

## 🧪 Testing

### Python AI Engine — FastAPI Swagger UI
```
http://localhost:8000/docs
```
Interactive Swagger UI for testing all AI Engine endpoints directly.

### Spring Boot — Run Tests
```bash
cd Ai_Trading_Coach_backend
./mvnw test
```

### Manual API Testing (curl)
```bash
# Analyze a stock
curl http://localhost:8000/analyze-stock/TCS

# Trigger market scan
curl http://localhost:8000/scan-market

# Analyze trades from JSON
curl -X POST http://localhost:8000/analyze-trades \
  -H "Content-Type: application/json" \
  -d '{"trades": [{"symbol": "TCS", "entry_price": 3200, "exit_price": 3350, "quantity": 10, "type": "equity", "side": "long", "holdingMinutes": 120, "profitLoss": 1500}]}'
```

---

## 📸 Screenshots / Demo

> The application features a dark-themed dashboard (`bg-slate-950`) with violet accent colors and smooth Framer Motion animations.

**Key UI Pages:**
- `Dashboard` — Quick-access summary cards and navigation shortcuts
- `Stock Advisor` — Symbol search → AI analysis cards + embedded live TradingView chart
- `Market Scanner` — Opportunity table sorted by AI composite score
- `Trade Analysis` — Upload CSV or JSON trades → behavioral coaching output
- `Portfolio` — Holdings CRUD table + AI health score panel with stress test results

---

## 🚧 Future Improvements

- **Authentication & Authorization** — JWT-based user authentication; currently user management has no auth guards.
- **Async Trade Analysis** — Move heavy LangGraph executions to Celery/Redis queues for non-blocking API responses.
- **WebSocket Live Alerts** — Push notifications when market scanner detects high-score opportunities.
- **Backtesting Engine** — Evaluate AI recommendations against historical price data (Backtrader / Zipline integration).
- **Options Chain Analysis** — Extend stock analysis to include IV, OI, PCR signals for F&O traders.
- **Production Deployment** — Containerize all services with Docker Compose, deploy to AWS/GCP with auto-scaled workers.
- **Database Caching Optimization** — Add read replicas and query-level caching for portfolio holdings at scale.
- **Unit Test Coverage** — Add pytest suites for analysis modules and agent output validations.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow existing code patterns:
   - New AI agents → `stock_trading_ai_engine/app/agents/`
   - New LangGraph pipelines → `stock_trading_ai_engine/app/graphs/`
   - New Spring Boot endpoints → add Controller + Service + wire to `AiServiceClient`
4. Ensure your agent includes a graceful fallback (all agents follow the primary parse → fallback pattern)
5. Submit a pull request with a clear description of the change

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Shreyash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<p align="center">
  Built with 🧠 LangGraph · ⚡ FastAPI · ☕ Spring Boot · ⚛️ React 19
</p>
