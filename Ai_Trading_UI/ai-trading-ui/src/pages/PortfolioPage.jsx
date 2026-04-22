import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from "recharts";
import {
  addHolding,
  getHoldings,
  analyzePortfolio,
  updateHolding,
  deleteHolding,
  createUser
} from "../services/api";
import {
  Briefcase, Plus, Edit2, Trash2, PieChart, Loader2, Target, TrendingUp, AlertTriangle, Activity, Check, X, Shield, BarChart3, Fingerprint, Zap, UserPlus, FileText, CheckCircle2, Download
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge, SkeletonBlock, TypingText } from "../components/ui";

const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

const PortfolioPage = () => {
  const [userId, setUserId] = useState(1);
  const [holdings, setHoldings] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    buy_price: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: "", buy_price: "" });

  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [createdUserId, setCreatedUserId] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);

  // TanStack Table for Holdings
  const [sorting, setSorting] = useState([]);
  const columns = useMemo(() => [
    { accessorKey: "symbol", id: "symbol" },
    { accessorKey: "quantity", id: "quantity" },
    { accessorKey: "buyPrice", id: "buy_price" },
    { id: "amount", accessorFn: row => row.quantity * row.buyPrice }
  ], []);

  const table = useReactTable({
    data: holdings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    setCreatingUser(true);
    try {
      const res = await createUser({ name: newUser.name, email: newUser.email });
      const newId = res.data.id;
      setCreatedUserId(newId);
      setUserId(newId);
      setNewUser({ name: "", email: "" });
      toast.success(`User Created! ID: ${newId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user.");
    } finally {
      setCreatingUser(false);
    }
  };

  // Load holdings
  const loadHoldings = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getHoldings(userId);
      setHoldings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load holdings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, [userId]);

  // Add holding
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.symbol || !form.quantity || !form.buy_price) return;
    
    try {
      await addHolding(userId, {
        symbol: form.symbol,
        quantity: Number(form.quantity),
        buy_price: Number(form.buy_price)
      });
      setForm({ symbol: "", quantity: "", buy_price: "" });
      toast.success("Holding added!");
      loadHoldings();
    } catch (err) {
      toast.error("Failed to add holding.");
    }
  };

  // Start editing
  const startEdit = (h) => {
    setEditingId(h.id);
    setEditForm({ quantity: h.quantity, buy_price: h.buyPrice });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ quantity: "", buy_price: "" });
  };

  // Save edit
  const saveEdit = async (h) => {
    if (!editForm.quantity || !editForm.buy_price) return;
    try {
      await updateHolding(h.id, {
        symbol: h.symbol,
        quantity: Number(editForm.quantity),
        buy_price: Number(editForm.buy_price),
      });
      setEditingId(null);
      toast.success("Holding updated!");
      loadHoldings();
    } catch (err) {
      toast.error("Failed to update holding.");
    }
  };

  // Delete holding
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this holding?")) return;
    try {
      await deleteHolding(id);
      toast.success("Holding deleted!");
      loadHoldings();
    } catch (err) {
      toast.error("Failed to delete holding.");
    }
  };

  // Analyze portfolio
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await analyzePortfolio(userId);
      setAnalysis(res.data);
      toast.success("Portfolio analysis complete!");
    } catch (err) {
      toast.error("Failed to analyze portfolio.");
    } finally {
      setAnalyzing(false);
    }
  };

  const exportCSV = () => {
    if (!holdings || holdings.length === 0) {
      toast.error("No holdings to export.");
      return;
    }
    const header = "Symbol,Quantity,Buy Price,Total Invested\n";
    const rows = holdings.map(h => `${h.symbol},${h.quantity},${h.buyPrice},${h.quantity * h.buyPrice}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_${userId}_holdings.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV successfully!");
  };

  // Helpers for UI
  const getScoreColorHex = (score) => {
    if (score >= 70) return "#34d399";
    if (score >= 40) return "#fbbf24";
    return "#f87171";
  };
  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getRiskColor = (risk) => {
    const r = risk?.toLowerCase() || "";
    if (r.includes("low")) return "text-emerald-400";
    if (r.includes("high")) return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-6">

      {/* Add New User Temporary Section */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-violet-400" /> Add New User
        </h2>
        <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <button
            type="submit"
            disabled={!newUser.name || !newUser.email || creatingUser}
            className="w-full md:w-32 py-2.5 rounded-xl text-sm font-bold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {creatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
          </button>
        </form>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-violet-400" />
            Portfolio Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and analyze your stock holdings with AI</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <Fingerprint className="w-4 h-4 text-slate-500" />
            <input
              type="number"
              className="bg-transparent text-sm text-white focus:outline-none w-24"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || holdings.length === 0}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:from-violet-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Analyze Portfolio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Add & List Holdings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Form */}
          <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-emerald-400" /> Add New Holding
            </h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Stock Symbol (e.g. INFY)"
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Buy Price (₹)"
                  value={form.buy_price}
                  onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={!form.symbol || !form.quantity || !form.buy_price}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Asset
              </button>
            </form>
          </div>

          {/* Holdings List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Current Holdings ({holdings.length})
              </h2>
              <div className="flex items-center gap-2">
                {holdings.length > 0 && (
                  <select 
                    className="bg-slate-900 border border-slate-700/60 rounded-lg text-xs px-2 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                    onChange={(e) => {
                      if(e.target.value === "") setSorting([]);
                      else setSorting([{ id: e.target.value, desc: true }]);
                    }}
                  >
                    <option value="">Sort...</option>
                    <option value="amount">Invested (High)</option>
                    <option value="quantity">Quantity (High)</option>
                  </select>
                )}
                {holdings.length > 0 && (
                  <button onClick={exportCSV} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors hidden sm:flex">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-24 rounded-2xl" />)
              ) : holdings.length === 0 ? (
                <div className="text-center py-10 bg-slate-900 border border-slate-800/60 rounded-2xl border-dashed">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No holdings found.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {table.getRowModel().rows.map((row) => {
                    const h = row.original;
                    return (
                      <motion.div
                        key={h.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 hover:border-slate-700 transition-colors"
                    >
                      {editingId === h.id ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-white">{h.symbol}</span>
                            <span className="text-slate-500">Editing</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                              value={editForm.quantity}
                              onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                              placeholder="Qty"
                            />
                            <input
                              type="number"
                              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                              value={editForm.buy_price}
                              onChange={(e) => setEditForm({...editForm, buy_price: e.target.value})}
                              placeholder="Price"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(h)} className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold flex justify-center items-center gap-1">
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button onClick={cancelEdit} className="flex-1 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-semibold flex justify-center items-center gap-1">
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-white">{h.symbol}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <span>Qty: <span className="text-slate-300">{h.quantity}</span></span>
                                <span>Avg: <span className="text-slate-300">₹{h.buyPrice}</span></span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => startEdit(h)} className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(h.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                            <span className="text-slate-500">Invested</span>
                            <span className="font-medium text-slate-300">₹{(h.quantity * h.buyPrice).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Analysis Results */}
        <div className="lg:col-span-2">
          {analyzing ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-900/50 border border-slate-800/60 rounded-3xl">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" />
              <p className="text-slate-400 text-sm animate-pulse">Running AI Portfolio Analysis...</p>
            </div>
          ) : analysis ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6" 
            >
              {/* Top Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center relative">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1 w-full justify-start">
                    <Target className="w-4 h-4 text-violet-400" /> Health Score
                  </div>
                  <div className="w-24 h-24 mb-[-20px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8}
                        data={[{ name: "Health", value: analysis.portfolioHealthScore || 0 }]}
                        startAngle={225} endAngle={-45}
                      >
                        <RadialBar
                          minAngle={15} background={{ fill: '#1e293b' }} clockWise
                          dataKey="value" fill={getScoreColorHex(analysis.portfolioHealthScore)}
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`text-xl absolute bottom-5 font-bold font-mono ${getScoreColor(analysis.portfolioHealthScore)}`}>
                    {analysis.portfolioHealthScore}
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
                    <Shield className="w-4 h-4 text-blue-400" /> Risk Level
                  </div>
                  <div className={`text-xl font-bold ${getRiskColor(analysis.riskLevel)}`}>
                    {analysis.riskLevel}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
                    <Briefcase className="w-4 h-4 text-slate-300" /> Total Inv.
                  </div>
                  <div className="text-xl font-bold text-white">
                    ₹{analysis.metrics?.totalInvestment?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Est. Return
                  </div>
                  <div className={`text-xl font-bold ${analysis.metrics?.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {analysis.metrics?.totalReturn}%
                  </div>
                </div>
              </div>

              {/* Advanced Metrics Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl flex flex-col items-center shadow-inner">
                  <div className="text-xs text-slate-500 font-medium mb-1 tracking-wide uppercase">Beta</div>
                  <div className="text-lg font-bold text-white">{analysis.metrics?.beta}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl flex flex-col items-center shadow-inner">
                  <div className="text-xs text-slate-500 font-medium mb-1 tracking-wide uppercase">Sharpe Ratio</div>
                  <div className="text-lg font-bold text-white">{analysis.metrics?.sharpeRatio}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl flex flex-col items-center shadow-inner">
                  <div className="text-xs text-slate-500 font-medium mb-1 tracking-wide uppercase">Volatility</div>
                  <div className="text-lg font-bold text-white">{analysis.metrics?.volatility}%</div>
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Diversification & Exposure */}
                <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl flex flex-col">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                    <PieChart className="w-4 h-4 text-indigo-400" /> Diversification
                  </h3>
                  
                  <p className="text-sm flex items-center gap-2 mb-5">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-slate-200">{analysis.diversification?.risk || "Unknown"}</span>
                  </p>
                  
                  {analysis.diversification?.sectorExposure && (
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <div className="w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={Object.entries(analysis.diversification.sectorExposure).map(([name, value]) => ({ name, value }))}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {Object.keys(analysis.diversification.sectorExposure).map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                               wrapperStyle={{ outline: 'none' }}
                               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                               itemStyle={{ color: '#c1c7d0' }}
                             />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {Object.entries(analysis.diversification.sectorExposure).map(([sector, pct], idx) => (
                          <div key={sector} className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            {sector} ({pct}%)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: Stress Test + Sentiment */}
                <div className="space-y-6">
                  {/* Stress Test */}
                  <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-yellow-500" /> Stress Test
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800/50">
                        <span className="text-xs text-slate-400 font-medium">Market Crash Impact</span>
                        <span className="text-sm font-bold text-red-400">{analysis.stressTest?.marketCrashImpact || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800/50">
                        <span className="text-xs text-slate-400 font-medium">Interest Rate Impact</span>
                        <span className="text-sm font-bold text-yellow-400">{analysis.stressTest?.interestRateImpact || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-blue-400" /> Asset Sentiment
                    </h3>
                    <div className="space-y-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                      {analysis.sentiment && Object.entries(analysis.sentiment).map(([stock, data]) => {
                        const isBull = data.sentiment?.toLowerCase() === 'bullish';
                        const isBear = data.sentiment?.toLowerCase() === 'bearish';
                        
                        return (
                          <div key={stock} className="flex items-center justify-between border-b border-slate-800/60 pb-2 last:border-0 last:pb-0">
                            <span className="font-mono text-sm font-bold text-white">{stock.toUpperCase()}</span>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                isBull ? 'bg-emerald-500/10 text-emerald-400' :
                                isBear ? 'bg-red-500/10 text-red-400' :
                                'bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {data.sentiment}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                {Math.round(data.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                      {(!analysis.sentiment || Object.keys(analysis.sentiment).length === 0) && (
                        <p className="text-xs text-slate-500">No sentiment data available.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Actionable Insights */}
              <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" /> Recommended Actions
                </h3>
                <ul className="space-y-3">
                  {analysis.actions && analysis.actions.length > 0 ? (
                    analysis.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 bg-yellow-500/10 p-3.5 rounded-xl border border-yellow-500/20 shadow-sm shadow-yellow-900/10">
                        <div className="mt-0.5 p-1 rounded-full bg-yellow-500/20 text-yellow-500 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-yellow-100/90 font-medium">{action}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">No immediate actions recommended.</li>
                  )}
                </ul>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-violet-500/20 p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Comprehensive Summary
                </h3>
                <div className="text-sm text-slate-300 leading-relaxed min-h-[60px]">
                  <TypingText text={analysis.summary || ""} speed={15} />
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-900/30 border border-slate-800/60 rounded-3xl border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <PieChart className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-slate-300 font-semibold mb-1">Portfolio Unanalyzed</h3>
              <p className="text-sm text-slate-500 max-w-sm text-center">
                Add your holdings on the left and click "Analyze Portfolio" to get AI-driven insights on risk, sentiment, and diversification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;