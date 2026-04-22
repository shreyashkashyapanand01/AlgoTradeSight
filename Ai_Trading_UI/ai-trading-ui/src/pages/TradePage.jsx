import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { analyzeTrades, uploadTradesCSV } from "../services/api";
import {
  Plus, Trash2, UploadCloud, Loader2, BrainCircuit,
  AlertCircle, ChevronDown, BarChart2, Lightbulb,
  ShieldAlert, Activity, FileText, CheckCircle2, Download
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Badge, DataRow, SectionLabel, SkeletonCard, AlertBox, TypingText
} from "../components/ui";

/* ── helpers ─────────────────────────────────────────────────── */
const emptyTrade = () => ({
  id: Date.now() + Math.random(),
  symbol: "",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  type: "intraday",
  side: "buy",
  holdingMinutes: "",
  profitLoss: "",
});

const transformTrades = (trades) =>
  trades.map((t) => ({
    symbol: t.symbol,
    entry_price: Number(t.entryPrice),
    exit_price: Number(t.exitPrice),
    quantity: Number(t.quantity),
    entry_time: null,
    exit_time: null,
    type: t.type,
    side: t.side,
    holdingMinutes: Number(t.holdingMinutes),
    profitLoss: Number(t.profitLoss),
  }));

function riskLabel(score) {
  if (score == null) return null;
  if (score <= 33) return "Low";
  if (score <= 66) return "Medium";
  return "High";
}

function riskBgClass(score) {
  if (score == null) return "bg-slate-500/15 border-slate-500/25 text-slate-300";
  if (score <= 33) return "bg-emerald-500/15 border-emerald-500/25 text-emerald-400";
  if (score <= 66) return "bg-yellow-500/15 border-yellow-500/25 text-yellow-400";
  return "bg-red-500/15 border-red-500/25 text-red-400";
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/* ── sub-components ──────────────────────────────────────────── */
const inputCls =
  "w-full bg-slate-800 text-white placeholder-slate-500 px-3 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition-all text-sm font-medium";

const selectCls =
  "w-full bg-slate-800 text-white px-3 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition-all text-sm font-medium appearance-none cursor-pointer";

function TradeRow({ trade, index, onChange, onRemove }) {
  const fields = [
    { key: "symbol",        label: "Symbol",          type: "text",   placeholder: "e.g. TCS" },
    { key: "entryPrice",    label: "Entry Price",     type: "number", placeholder: "0.00" },
    { key: "exitPrice",     label: "Exit Price",      type: "number", placeholder: "0.00" },
    { key: "quantity",      label: "Quantity",        type: "number", placeholder: "1" },
    { key: "holdingMinutes",label: "Hold (mins)",     type: "number", placeholder: "30" },
    { key: "profitLoss",    label: "Profit / Loss",   type: "number", placeholder: "0" },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 space-y-3"
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
          Trade #{index + 1}
        </span>
        <button
          onClick={() => onRemove(trade.id)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Remove trade"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of text/number inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1 font-semibold">
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={trade[key]}
              onChange={(e) => onChange(trade.id, key, e.target.value)}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1 font-semibold">Type</label>
          <div className="relative">
            <select
              value={trade.type}
              onChange={(e) => onChange(trade.id, "type", e.target.value)}
              className={selectCls}
            >
              <option value="intraday">Intraday</option>
              <option value="swing">Swing</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1 font-semibold">Side</label>
          <div className="relative">
            <select
              value={trade.side}
              onChange={(e) => onChange(trade.id, "side", e.target.value)}
              className={selectCls}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
      <span className="text-xl font-bold text-white font-mono">
        {value != null ? String(value) : "—"}
      </span>
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
function TradePage() {
  const [trades, setTrades] = useState([emptyTrade()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // CSV tab
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState(null);
  const fileRef = useRef(null);

  // Active input tab
  const [inputTab, setInputTab] = useState("manual"); // "manual" | "csv"

  /* ── trade CRUD ── */
  const addTrade = () => setTrades((prev) => [...prev, emptyTrade()]);
  const removeTrade = (id) =>
    setTrades((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev));
  const updateTrade = (id, key, value) =>
    setTrades((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)));

  /* ── validation ── */
  const validateTrades = () => {
    for (const t of trades) {
      if (!t.symbol.trim()) return "Symbol is required for all trades.";
      if (t.entryPrice === "" || t.exitPrice === "" || t.quantity === "" ||
          t.holdingMinutes === "" || t.profitLoss === "") {
        return "All numeric fields are required for every trade.";
      }
    }
    return null;
  };

  /* ── manual submit ── */
  const handleAnalyze = async () => {
    const validationErr = validateTrades();
    if (validationErr) { toast.error(validationErr); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeTrades({ trades: transformTrades(trades) });
      setResult(res.data);
      toast.success("Trades analyzed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to analyze trades. Please ensure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── csv submit ── */
  const handleCsvUpload = async () => {
    if (!csvFile) { toast.error("Please select a CSV file first."); return; }
    setCsvLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      const res = await uploadTradesCSV(formData);
      setResult(res.data);
      toast.success("CSV analyzed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to upload CSV. Please ensure the file format is correct."
      );
    } finally {
      setCsvLoading(false);
    }
  };

  const exportTradesCSV = () => {
    if (!trades || trades.length === 0 || !trades[0].symbol) {
      toast.error("No valid trades to export.");
      return;
    }
    const header = "Symbol,Entry Price,Exit Price,Quantity,Type,Side,Hold Mins,P&L\n";
    const rows = trades.map(t => `${t.symbol},${t.entryPrice},${t.exitPrice},${t.quantity},${t.type},${t.side},${t.holdingMinutes},${t.profitLoss}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Trades exported as CSV!");
  };

  /* ── derived result data ── */
  const m = result?.metrics ?? {};
  const fmt = (v, decimals = 1) => v != null ? String(Number(v).toFixed(decimals)) : "—";
  const metricItems = [
    { label: "Win Rate",               value: m.winRate         != null ? `${(m.winRate * 100).toFixed(1)}%`          : "—" },
    { label: "Avg Win Hold (mins)",    value: fmt(m.avgWinHoldMinutes)  },
    { label: "Avg Loss Hold (mins)",   value: fmt(m.avgLossHoldMinutes) },
    { label: "Risk / Reward Ratio",    value: fmt(m.avgRiskReward)      },
    { label: "Max Drawdown",           value: fmt(m.maxDrawdown, 0)     },
    { label: "Loss Streak Frequency",  value: fmt(m.lossStreakFrequency) },
    { label: "Position Size Variance", value: fmt(m.positionSizeVariance) },
  ];

  const riskScore  = result?.riskScore  ?? null;   // number 0-100
  const traderType = result?.traderType ?? result?.trader_type ?? "";
  const mistakes     = result?.mistakes     ?? [];
  const suggestions  = result?.suggestions  ?? [];
  const summaryText  = result?.summary      ?? "";

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Trade Behaviour Analyzer</h1>
          <p className="text-xs text-slate-500">Analyze your trades and get AI-powered insights to improve your strategy.</p>
        </div>
      </div>

      {/* ── Tab toggle ── */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800/60 rounded-2xl p-1 w-fit">
        {[
          { key: "manual", label: "Manual Entry",  icon: FileText },
          { key: "csv",    label: "CSV Upload",    icon: UploadCloud },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setInputTab(key); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${inputTab === key
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                : "text-slate-400 hover:text-slate-200"
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Manual Entry Panel ── */}
      {inputTab === "manual" && (
        <div className="space-y-4">
          <AnimatePresence>
            {trades.map((trade, i) => (
              <TradeRow
                key={trade.id}
                trade={trade}
                index={i}
                onChange={updateTrade}
                onRemove={removeTrade}
              />
            ))}
          </AnimatePresence>

          {/* Add trade + Analyze row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={addTrade}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Trade
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:from-violet-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</>
                : <><BrainCircuit className="w-4 h-4" />Analyze Trades</>
              }
            </button>
          </div>

          {loading && <SkeletonCard />}
        </div>
      )}

      {/* ── CSV Upload Panel ── */}
      {inputTab === "csv" && (
        <div className="space-y-4">
          <div
            className="bg-slate-900 border-2 border-dashed border-slate-700/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-violet-500/30 transition-all">
              <UploadCloud className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                {csvFile ? csvFile.name : "Click to select a CSV file"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB — ready to upload` : "Accepts .csv files only"}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => { setCsvFile(e.target.files[0] || null); }}
            />
          </div>

          {csvFile && (
            <div className="flex items-center justify-between bg-slate-900 border border-emerald-500/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300 font-medium">{csvFile.name}</span>
              </div>
              <button
                onClick={() => { setCsvFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          <button
            onClick={handleCsvUpload}
            disabled={csvLoading || !csvFile}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:from-violet-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
          >
            {csvLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading & Analyzing…</>
              : <><UploadCloud className="w-4 h-4" />Upload &amp; Analyze</>
            }
          </button>

          {csvLoading && <SkeletonCard />}
        </div>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="results"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Header divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-slate-800/80" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Analysis Results</span>
                <button onClick={exportTradesCSV} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
              </div>
              <div className="h-px flex-1 bg-slate-800/80" />
            </motion.div>

            {/* Summary Card */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-2xl p-5"
            >
              <div className="absolute top-3 right-3 opacity-10">
                <BrainCircuit className="w-16 h-16 text-violet-400" />
              </div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-violet-400 shrink-0" />
                  <SectionLabel>AI Summary</SectionLabel>
                </div>
                {riskScore != null && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${riskBgClass(riskScore)}`}>
                    Risk {riskScore} — {riskLabel(riskScore)}
                  </span>
                )}
              </div>
              {traderType && (
                <div className="mb-3">
                  <DataRow label="Trader Type" value={traderType} />
                </div>
              )}
              {summaryText && (
                <p className="text-sm text-slate-200 leading-relaxed min-h-[60px]">
                  <TypingText text={summaryText} speed={15} />
                </p>
              )}
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 flex flex-col items-center justify-center">
                <SectionLabel>Win Rate</SectionLabel>
                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Wins", value: (m.winRate || 0) * 100 },
                          { name: "Losses", value: (1 - (m.winRate || 0)) * 100 }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold mt-2">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Wins
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Losses
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 flex flex-col items-center justify-center">
                <SectionLabel>Risk Score</SectionLabel>
                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15}
                      data={[{ name: "Risk", value: riskScore || 0 }]}
                      startAngle={180} endAngle={0}
                    >
                      <RadialBar
                        minAngle={15} background={{ fill: '#1e293b' }} clockWise
                        dataKey="value" fill={riskScore > 66 ? "#ef4444" : riskScore > 33 ? "#eab308" : "#10b981"}
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xl font-bold font-mono mt-[-20px]">{riskScore || 0}/100</div>
              </motion.div>
            </div>

            {/* Mistakes & Suggestions (Alert Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mistakes.length > 0 && (
                <motion.div variants={fadeUp} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <SectionLabel>Detected Mistakes</SectionLabel>
                  </div>
                  <ul className="space-y-3">
                    {mistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-red-200 bg-slate-900/50 p-3 rounded-xl border border-red-500/10">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {suggestions.length > 0 && (
                <motion.div variants={fadeUp} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <SectionLabel>AI Suggestions</SectionLabel>
                  </div>
                  <ul className="space-y-3">
                    {suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-100 bg-slate-900/50 p-3 rounded-xl border border-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!result && !loading && !csvLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-slate-300 font-semibold mb-1">Ready to analyze</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Enter your trades manually or upload a CSV file, then click{" "}
            <span className="text-violet-400 font-semibold">Analyze Trades</span> to get AI-powered insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default TradePage;
