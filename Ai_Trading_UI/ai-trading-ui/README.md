# 🤖 AI Trading Coach

A full-stack AI-powered stock analysis and market scanning web application. Enter any stock symbol to get real-time technical analysis, fundamental data, news sentiment, and AI-generated summaries.

## 🏗️ Architecture

```
React UI (Vite + Tailwind CSS)
        ↓
Spring Boot REST API  :8080
        ↓
Python FastAPI AI Engine  :8000
```

The frontend communicates only with Spring Boot, which orchestrates calls to the Python AI engine internally.

---

## ✨ Features

- 📈 **Stock Analyzer** — Enter any NSE/BSE symbol to get AI-driven analysis
- 🛰️ **Market Scanner** — Automatically scans and ranks top trading opportunities
- 🧠 **AI Summaries** — Natural language insights on trends, momentum, RSI, and fundamentals
- 🌐 **News Sentiment** — Real-time headline analysis integrated into stock scoring
- 🎨 **Premium Dark UI** — Built with Tailwind CSS v4, glassmorphism, and smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend API | Spring Boot 4, Java 22 |
| AI Engine | Python FastAPI, LLM integration |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Java](https://www.oracle.com/java/technologies/downloads/) 22+
- [Maven](https://maven.apache.org/) 3.9+
- [Python](https://www.python.org/) 3.10+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-trading-coach.git
cd ai-trading-coach
```

---

### 2. Start the Python AI Engine (Port 8000)

```bash
cd python-ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Verify: open `http://localhost:8000/docs`

---

### 3. Start the Spring Boot Backend (Port 8080)

```bash
cd Ai_Trading_Coach_backend
mvn spring-boot:run
```

Verify: open `http://localhost:8080/stock/TCS`

---

### 4. Start the React Frontend (Port 5173)

```bash
cd ai-trading-ui
npm install
```

Create a `.env` file in `ai-trading-ui/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Then start the dev server:

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📁 Project Structure

```
ai-trading-coach/
├── ai-trading-ui/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── StockPage.jsx        # Stock analyzer UI
│   │   │   └── ScanPage.jsx         # Market scanner UI
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx
│   │   └── index.css                # Tailwind + global styles
│   ├── .env                         # Local env (⚠️ create this, do not commit)
│   ├── .env.production              # Production env template
│   └── vite.config.js
│
├── Ai_Trading_Coach_backend/        # Spring Boot API
│   └── src/main/java/
│       ├── config/
│       │   ├── WebConfig.java       # CORS configuration
│       │   └── RestTemplateConfig.java
│       ├── controller/
│       │   └── StockController.java
│       └── service/
│           ├── StockService.java
│           └── AiServiceClient.java
│
└── python-ai-engine/                # FastAPI AI service
    └── main.py
```

---

## ⚙️ Environment Variables

### Frontend — `ai-trading-ui/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Spring Boot API base URL | `http://localhost:8080` |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🌐 API Endpoints (Spring Boot)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stock/{symbol}` | Full AI analysis for a stock symbol |
| `GET` | `/stock/scan` | Scan market for top opportunities |

---

## 🔒 CORS Configuration

CORS is configured globally in `WebConfig.java`. For local dev, these origins are allowed by default:
- `http://localhost:5173`
- `http://localhost:5174`

For production, add your deployed frontend URL:

```java
.allowedOrigins(
    "http://localhost:5173",
    "https://your-production-frontend.com"  // ← add this
)
```

---

## 🏭 Production Deployment

### Frontend
```bash
cd ai-trading-ui
# Set VITE_API_BASE_URL in .env.production to your real API URL
npm run build
# Deploy the dist/ folder to Netlify, Vercel, S3, etc.
```

### Spring Boot
```bash
cd Ai_Trading_Coach_backend
mvn clean package
java -jar target/*.jar
```

### FastAPI
```bash
cd python-ai-engine
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| Input field not visible | Hard refresh with `Ctrl + F5` |
| CORS error in browser console | Ensure `WebConfig.java` includes your frontend's origin |
| API calls fail / show error | Make sure all 3 services are running simultaneously |
| Spring Boot shows no request logs | Normal behavior. Enable with `logging.level.org.springframework.web=DEBUG` in `application.properties` |
| Port already in use (Windows) | Run `taskkill /F /IM node.exe` to kill stale Node processes |

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Shreyas** — [GitHub](https://github.com/your-username)