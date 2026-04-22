import { useState, useEffect } from "react";

// Reusable Badge component
export function Badge({ label, variant = "neutral" }) {
  const variants = {
    bullish:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    bearish:  "bg-red-500/15    text-red-400    border border-red-500/25",
    neutral:  "bg-slate-500/15  text-slate-300  border border-slate-500/25",
    caution:  "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
    buy:      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    sell:     "bg-red-500/15    text-red-400    border border-red-500/30",
    hold:     "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant] ?? variants.neutral}`}>
      {label}
    </span>
  );
}

// Metric progress bar
export function MetricBar({ label, value, max = 100, colorClass = "bg-brand-500" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>{label}</span>
        <span className="font-mono text-slate-200">{typeof value === "number" ? value.toFixed(2) : value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Data row with label + value
export function DataRow({ label, value, valueClass = "text-slate-200" }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

// Section title inside a card
export function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">{children}</p>
  );
}

// Skeleton loader block
export function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-800/80 rounded-xl ${className}`} />
  );
}

// Skeleton circle loader
export function SkeletonCircle({ className = "w-24 h-24" }) {
  return (
    <div className={`animate-pulse bg-slate-800/80 rounded-full flex items-center justify-center ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-24" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
      </div>
      <SkeletonBlock className="h-32" />
    </div>
  );
}

// Alert box
export function AlertBox({ message, variant = "error" }) {
  const colors = {
    error:   "bg-red-500/10 border-red-500/30 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    info:    "bg-brand-500/10 border-brand-500/30 text-brand-400",
  };
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${colors[variant]}`}>
      <span className="mt-0.5">⚠</span>
      {message}
    </div>
  );
}

// Meter component (gauge-like)
export function Meter({ label, value, valuePct, min = 0, max = 100, colorClass = "bg-violet-500" }) {
  const pct = valuePct !== undefined ? valuePct : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-end">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className="text-sm font-semibold text-slate-200">{value}</span>
      </div>
      <div className="flex w-full h-2 rounded-full overflow-hidden bg-slate-800">
        <div className={`h-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

// TypingText for AI summary
export function TypingText({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}
