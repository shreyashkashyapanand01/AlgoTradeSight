import { useState } from "react";
import {
  LayoutDashboard, BrainCircuit, Radar,
  ChevronRight, TrendingUp, Hexagon, Activity,
  PieChart
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard",           icon: LayoutDashboard },
  { id: "advisor",  label: "Stock Advisor",          icon: BrainCircuit },
  { id: "scanner",  label: "Opportunity Finder",     icon: Radar },
  { id: "trades",   label: "Trade Analyser",         icon: Activity },
  { id: "portfolio", label: "Portfolio", icon: PieChart },
];

export function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-950 border-r border-slate-800/60 min-h-screen">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-violet-500" strokeWidth={1.5} />
            <TrendingUp className="w-3.5 h-3.5 text-violet-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">AlgoTradeSight</p>
            <p className="text-[10px] text-slate-500 leading-tight">Coach</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Modules</p>
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-violet-500" />}
            
            {item.badge && (
            <span className="text-[9px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
              {item.badge}
            </span>
          )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="px-4 pb-5">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">All Systems Live</span>
          </div>
          <div className="space-y-1">
            {[["Spring Boot", "8080"], ["FastAPI", "8000"]].map(([name, port]) => (
              <div key={port} className="flex justify-between text-[10px]">
                <span className="text-slate-500">{name}</span>
                <span className="text-slate-400 font-mono">:{port}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
