import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Menu, BrainCircuit, Radar, Activity, PieChart, LayoutDashboard, Search } from "lucide-react";
import { getLiveTicker } from "../services/api";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",      Icon: LayoutDashboard },
  { id: "advisor", label: "Stock Advisor",    Icon: BrainCircuit },
  { id: "scanner", label: "Opportunity Finder", Icon: Radar },
  { id: "trades",  label: "Trade Analyser",   Icon: Activity },
  { id: "portfolio", label: "Portfolio",      Icon: PieChart },
];

const PAGE_TITLES = {
  dashboard: { title: "Dashboard",         sub: "Overview of your trading activities" },
  advisor: { title: "Stock Advisor",       sub: "AI-powered single stock analysis" },
  scanner: { title: "Opportunity Finder",  sub: "AI market scan for top opportunities" },
  trades:  { title: "Trade Analyser",      sub: "Analyze your trades and improve your strategy" },
  portfolio: { title: "Portfolio",         sub: "Manage and analyze your stock holdings with AI" },
};

export function TopNav({ activePage, setActivePage, darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tickerData, setTickerData] = useState([]);
  const page = PAGE_TITLES[activePage] ?? PAGE_TITLES.advisor;

  useEffect(() => {
    let mounted = true;
    const fetchTicker = async () => {
      try {
        const res = await getLiveTicker();
        if (mounted && res.data) setTickerData(res.data);
      } catch (err) {
        console.error("Failed to fetch live ticker", err);
      }
    };
    
    fetchTicker();
    const interval = setInterval(fetchTicker, 60000); // refresh every minute
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* Ticker Tape */}
      {tickerData.length > 0 && (
        <div className="w-full bg-slate-950 border-b border-slate-800/60 py-1.5 overflow-hidden flex items-center relative z-50">
          <div className="flex animate-marquee whitespace-nowrap">
            {tickerData.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2 mx-6 text-[10px] sm:text-[11px] font-mono">
                <span className="text-slate-300 font-bold">{val.symbol}</span>
                <span className="text-slate-400">{val.price}</span>
                <span className={val.up ? "text-emerald-400" : "text-red-400"}>{val.change}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerData.map((val, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-2 mx-6 text-[10px] sm:text-[11px] font-mono">
                <span className="text-slate-300 font-bold">{val.symbol}</span>
                <span className="text-slate-400">{val.price}</span>
                <span className={val.up ? "text-emerald-400" : "text-red-400"}>{val.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">

          {/* Left: Mobile branding + hamburger & Title */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="md:hidden font-bold text-white text-sm">AlgoTradeSight</span>
            <div className="hidden md:block">
              <h1 className="text-sm font-semibold text-white">{page.title}</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">{page.sub}</p>
            </div>
          </div>

          {/* Center: Search input */}
          <div className="hidden md:flex flex-1 max-w-sm mx-auto items-center relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search stocks..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 px-2">Navigation</p>
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => { setActivePage(id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${activePage === id ? "bg-violet-500/10 text-violet-300" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
