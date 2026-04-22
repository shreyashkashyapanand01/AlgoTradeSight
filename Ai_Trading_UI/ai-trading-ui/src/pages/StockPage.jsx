import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeStock } from "../services/api";
import {
  Search, TrendingUp, TrendingDown, AlertCircle, Loader2,
  BrainCircuit, BarChart2, Newspaper, DollarSign, Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import {
  Badge, MetricBar, DataRow, SectionLabel, SkeletonCard, Meter, TypingText
} from "../components/ui";

/* ── helpers ─────────────────────────────────────────── */
function trendVariant(trend = "") {
  const t = trend.toLowerCase();
  if (t.includes("bull")) return "bullish";
  if (t.includes("bear")) return "bearish";
  return "neutral";
}
function sentimentVariant(text = "") {
  const t = text.toLowerCase();
  if (t.includes("positive") || t.includes("bull")) return "bullish";
  if (t.includes("negative") || t.includes("bear")) return "bearish";
  if (t.includes("neutral")) return "neutral";
  return "caution";
}
function recommendVariant(rec = "") {
  const r = rec.toLowerCase();
  if (r === "buy") return "buy";
  if (r === "sell") return "sell";
  return "hold";
}
function momentumPct(m = "") {
  const t = m.toLowerCase();
  if (t === "strong") return 85;
  if (t === "moderate" || t === "medium") return 55;
  if (t === "weak") return 25;
  return 50;
}
function rsiColor(rsi = "") {
  const t = rsi.toLowerCase();
  if (t === "overbought") return "text-red-400";
  if (t === "oversold")   return "text-emerald-400";
  return "text-yellow-400";
}
function volPct(v = "") {
  const t = v.toLowerCase();
  if (t.includes("high")) return 85;
  if (t.includes("medium") || t.includes("moderate")) return 50;
  if (t.includes("low")) return 15;
  return 50;
}
function volColor(v = "") {
  const t = v.toLowerCase();
  if (t.includes("high")) return "bg-red-500";
  if (t.includes("low")) return "bg-emerald-500";
  return "bg-yellow-500";
}

/* ── card animation variant ─────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/* ── component ───────────────────────────────────────── */
import { useEffect } from "react";

function StockPage({ targetSymbol, setTargetSymbol }) {
  const [symbol, setSymbol] = useState("");
  const [data,   setData]   = useState(null);
  const [loading, setLoading] = useState(false);

  // ── unchanged business logic ──
  const handleAnalyze = async (overrideSymbol) => {
    const symToAnalyze = typeof overrideSymbol === 'string' ? overrideSymbol : symbol;
    if (!symToAnalyze || !symToAnalyze.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const res = await analyzeStock(symToAnalyze.toUpperCase());
      setData(res.data);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to fetch analysis. Make sure the backend is running on port 8080.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (targetSymbol) {
      setSymbol(targetSymbol);
      handleAnalyze(targetSymbol);
      if (typeof setTargetSymbol === "function") {
        setTargetSymbol("");
      }
    }
  }, [targetSymbol]);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleAnalyze(); };

  const tech  = data?.technical   ?? {};
  const fund  = data?.fundamental ?? {};
  const news  = data?.news        ?? {};

  return (
    <div className="space-y-6">
      {/* ── Search bar ─────────────────────────────────── */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            className="w-full bg-slate-900 text-white placeholder-slate-500 pl-11 pr-4 py-3.5 rounded-2xl border border-slate-700/60 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition-all font-medium text-sm"
            placeholder="Enter stock symbol — e.g. TCS, INFY, HDFCBANK"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !symbol.trim()}
          className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:from-violet-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center gap-2 whitespace-nowrap"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</>
            : <><TrendingUp className="w-4 h-4" />Analyze</>}
        </button>
      </div>

      {/* ── States ─────────────────────────────────────── */}

      {loading && <SkeletonCard />}

      {/* ── Results ────────────────────────────────────── */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            key="results"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Header row */}
            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-mono">{data.symbol}</h2>
                <p className="text-xs text-slate-500 mt-0.5">AI Analysis Report</p>
              </div>
              {data.recommendation && (
                <Badge label={data.recommendation} variant={recommendVariant(data.recommendation)} />
              )}
            </motion.div>

            {/* Technical + Fundamental grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Technical */}
              <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <SectionLabel>Technical Signals</SectionLabel>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Trend</span>
                    <Badge label={tech.trend ?? "—"} variant={trendVariant(tech.trend)} />
                  </div>
                  <MetricBar
                    label="Momentum"
                    value={momentumPct(tech.momentum)}
                    colorClass={
                      tech.momentum?.toLowerCase() === "strong" ? "bg-emerald-500"
                       : tech.momentum?.toLowerCase() === "weak" ? "bg-red-500"
                       : "bg-yellow-500"
                    }
                  />
                  <DataRow
                    label="RSI Condition"
                    value={tech.rsi ?? "—"}
                    valueClass={rsiColor(tech.rsi)}
                  />
                  <Meter 
                    label="Volatility" 
                    value={tech.volatility ?? "—"} 
                    valuePct={volPct(tech.volatility)}
                    colorClass={volColor(tech.volatility)}
                  />
                </div>
              </motion.div>

              {/* Fundamental */}
              <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  <SectionLabel>Fundamental Data</SectionLabel>
                </div>
                <div className="space-y-2">
                  <DataRow label="Valuation"     value={fund.valuation    ?? "—"} />
                  <DataRow label="Growth"         value={fund.growth       ?? "—"} />
                  <DataRow
                    label="Profit Margin"
                    value={fund.profit_margin != null ? `${(fund.profit_margin * 100).toFixed(2)}%` : "—"}
                    valueClass={fund.profit_margin > 0.15 ? "text-emerald-400" : "text-red-400"}
                  />
                  <DataRow
                    label="Debt / Equity"
                    value={fund.debt_to_equity != null ? fund.debt_to_equity.toFixed(2) : "—"}
                    valueClass={fund.debt_to_equity > 5 ? "text-red-400" : "text-emerald-400"}
                  />
                </div>
              </motion.div>
            </div>

            {/* News Sentiment */}
            {news.headlines && (
              <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-sky-400" />
                    <SectionLabel>News Sentiment</SectionLabel>
                  </div>
                  <Badge
                    label={sentimentVariant(news.analysis ?? "")}
                    variant={sentimentVariant(news.analysis ?? "")}
                  />
                </div>
                <ul className="space-y-1.5 mb-4">
                  {news.headlines.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                {news.analysis && (
                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                    {news.analysis.replace(/\*\*/g, "").replace(/\*/g, "")}
                  </p>
                )}
              </motion.div>
            )}

            {/* AI Summary */}
            {data.summary && (
              <motion.div variants={fadeUp} className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-2xl p-5">
                <div className="absolute top-3 right-3 opacity-10">
                  <BrainCircuit className="w-16 h-16 text-violet-400" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-4 h-4 text-violet-400" />
                  <SectionLabel>AI Decision Summary</SectionLabel>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed min-h-[60px]">
                  <TypingText text={data.summary} speed={20} />
                </div>
              </motion.div>
            )}

            {/* TradingView Chart */}
            <motion.div variants={fadeUp} className="h-[500px] w-full mt-6 rounded-2xl overflow-hidden border border-slate-800/60">
              <AdvancedRealTimeChart 
                symbol={`BSE:${data.symbol}`} 
                theme="dark" 
                autosize
                backgroundColor="#0f172a"
                hide_side_toolbar={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-slate-300 font-semibold mb-1">Ready to analyze</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Type a stock symbol above and press <kbd className="text-violet-400 font-mono">Enter</kbd> or click <span className="text-violet-400 font-semibold">Analyze</span>.
          </p>
        </div>
      )}
    </div>
  );
}

export default StockPage;