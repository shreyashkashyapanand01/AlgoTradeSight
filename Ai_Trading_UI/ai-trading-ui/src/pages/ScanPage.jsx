import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender
} from "@tanstack/react-table";
import { scanMarket } from "../services/api";
import {
  Radar, TrendingUp, TrendingDown, Loader2, AlertCircle,
  Filter, BarChart2, ChevronUp, ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge, SkeletonBlock } from "../components/ui";

/* ── helpers ─────────────────────────────────────────── */
function scoreColor(score) {
  if (score >= 7) return "text-emerald-400";
  if (score >= 4) return "text-yellow-400";
  return "text-red-400";
}
function scoreBar(score, max = 10) {
  const pct = Math.min(100, (score / max) * 100);
  const color = score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500";
  return { pct, color };
}

// Table replaces StockCard

/* ── skeleton grid ───────────────────────────────────── */
function ScanSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-44" />
      ))}
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
function ScanPage({ onAnalyze }) {
  // ── unchanged business logic ──
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [scanned, setScanned] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setScanned(false);
    try {
      const res = await scanMarket();
      setData(res.data.opportunities || []);
      setScanned(true);
      toast.success("Market scan complete!");
    } catch (err) {
      toast.error("Failed to scan market. Make sure the backend is running on port 8080.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── TanStack Table Setup ──
  const [sorting, setSorting] = useState([{ id: 'score', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(() => [
    {
      header: "Symbol & Sector",
      accessorKey: "symbol",
      cell: ({ row }) => {
        const item = row.original;
        const isTopPick = (item.score >= 5 && row.index === 0 && sorting.length > 0 && sorting[0].id === 'score' && sorting[0].desc);
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-base font-mono">{item.symbol}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">{item.sector}</span>
              {isTopPick && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded border border-violet-500/30">
                  Top Pick 🎯
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 w-full max-w-2xl leading-relaxed text-wrap">{item.summary}</p>
          </div>
        );
      }
    },
    {
      header: "AI Score",
      accessorKey: "score",
      cell: ({ row }) => {
        const item = row.original;
        const { pct, color } = scoreBar(item.score);
        return (
          <div className="flex items-center gap-3">
            <span className={`font-mono font-bold text-lg ${scoreColor(item.score)} ${item.score >= 10 ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''}`}>
              {item.score.toFixed(1)} {item.score >= 10 && '🔥'}
            </span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden md:block">
              <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }
    },
    {
      header: "Momentum",
      accessorKey: "momentum",
      cell: ({ row }) => {
        const item = row.original;
        const isUp = item.momentum > 10;
        return (
          <div className={`flex items-center gap-1 font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {item.momentum.toFixed(1)}
          </div>
        );
      }
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => (
        <div className="text-right">
          <button 
            onClick={() => onAnalyze && onAnalyze(row.original.symbol)}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Analyze
          </button>
        </div>
      )
    }
  ], [onAnalyze, sorting]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-5">
      {/* ── Trigger button ─────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleScan}
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Scanning…</>
            : <><Radar className="w-4 h-4" />Scan Market</>}
        </button>

        {scanned && data.length > 0 && (
          <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            {data.length} opportunities found
          </span>
        )}
      </div>

      {loading && <ScanSkeleton />}

      {/* ── Filters (TanStack) ─────────────────────────── */}
      {scanned && data.length > 0 && !loading && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Search:
          </div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search symbol, sector..."
            className="px-4 py-2 w-full max-w-sm rounded-xl text-sm bg-slate-900 border border-slate-700/60 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
      )}

      {/* ── Table ─────────────────────────────────────── */}
      <AnimatePresence>
        {table.getRowModel().rows.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900"
          >
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id} 
                        className={`px-6 py-4 font-semibold ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className={`flex items-center gap-2 ${header.id === 'action' ? 'justify-end' : ''}`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="w-3.5 h-3.5" />,
                            desc: <ChevronDown className="w-3.5 h-3.5" />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, idx) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty / initial states */}
      {scanned && data.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500 text-sm">
          No opportunities found in the current scan.
        </div>
      )}
      {!scanned && !error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Radar className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-slate-300 font-semibold mb-1">Ready to scan</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Click <span className="text-emerald-400 font-semibold">Scan Market</span> to find AI-ranked trading opportunities.
          </p>
        </div>
      )}
    </div>
  );
}

export default ScanPage;