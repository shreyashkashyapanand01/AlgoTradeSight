import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav  } from "./components/TopNav";
import { Toaster } from "react-hot-toast";
import StockPage   from "./pages/StockPage";
import ScanPage    from "./pages/ScanPage";
import TradePage   from "./pages/TradePage";
import PortfolioPage from "./pages/PortfolioPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode,   setDarkMode]   = useState(true);
  const [targetSymbol, setTargetSymbol] = useState("");

  const handleAnalyzeSymbol = (symbol) => {
    setTargetSymbol(symbol);
    setActivePage("advisor");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)', // violet border
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1e293b' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        {/* Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            activePage={activePage}
            setActivePage={setActivePage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
            <div className={activePage === "dashboard" ? "block" : "hidden"}>
              <DashboardPage setActivePage={setActivePage} />
            </div>
            <div className={activePage === "advisor" ? "block" : "hidden"}>
              <StockPage targetSymbol={targetSymbol} setTargetSymbol={setTargetSymbol} />
            </div>
            <div className={activePage === "scanner" ? "block" : "hidden"}>
              <ScanPage onAnalyze={handleAnalyzeSymbol} />
            </div>
            <div className={activePage === "trades" ? "block" : "hidden"}>
              <TradePage />
            </div>
            <div className={activePage === "portfolio" ? "block" : "hidden"}>
              <PortfolioPage />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/60 px-6 py-3 flex items-center justify-between text-[10px] text-slate-600">
            <span>AlgoTradeSight © 2026</span>
            <span className="flex items-center gap-3">
              <span>React 19</span>
              <span>·</span>
              <span>Spring Boot :8080</span>
              <span>·</span>
              <span>FastAPI :8000</span>
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;