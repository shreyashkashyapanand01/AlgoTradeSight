import { PieChart, Activity, BrainCircuit, Radar, TrendingUp, TrendingDown, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage({ setActivePage }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome & Quick Stats */}
      <h2 className="text-xl font-bold tracking-tight text-white mb-4">Welcome back to AlgoTradeSight</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors group cursor-pointer" onClick={() => setActivePage("portfolio")}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">Total Value</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">₹0.00</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-slate-400">No active holdings</span>
            </p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors group cursor-pointer" onClick={() => setActivePage("scanner")}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Radar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">Opportunities</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">5</h3>
            <p className="text-xs font-medium mt-1 flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>Hot Sectors</span>
            </p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors group cursor-pointer" onClick={() => setActivePage("trades")}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">Win Rate</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">0%</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              <span>Import trades to compute</span>
            </p>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors group cursor-pointer" onClick={() => setActivePage("advisor")}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-slate-800 text-slate-400">Quick Scan</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mt-2 bg-slate-950/50 border border-slate-800 rounded-lg p-2">
               <Search className="w-3.5 h-3.5 text-slate-500" />
               <span className="text-xs text-slate-500">Analyze next stock...</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Activity Space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-3">
               <div className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800/50 flex items-center justify-center mx-auto">
                 <Clock className="w-5 h-5 text-slate-500" />
               </div>
               <p className="text-sm font-medium text-slate-300">No Recent Activity</p>
               <p className="text-xs text-slate-500 max-w-[250px]">Start by tracking your portfolio or analyzing some new stock opportunities.</p>
            </div>
         </motion.div>
         
         <motion.div variants={itemVariants} className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 shadow-xl shadow-violet-900/20 text-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Market Summary</h3>
              <p className="text-sm text-violet-100/80 leading-relaxed font-medium">
                The overall market condition exhibits mixed signals. While top opportunities show strong momentum, broader macro factors remain neutral. Consider balancing your portfolio with defensive assets.
              </p>
            </div>
            <button 
              onClick={() => setActivePage("scanner")}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors backdrop-blur-sm border border-white/10"
            >
              View Top Picks
            </button>
         </motion.div>
      </div>

    </motion.div>
  );
}
