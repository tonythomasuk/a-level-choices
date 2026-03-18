import React from 'react';
import { motion } from 'motion/react';

interface NexusProps {
    onSelectArchitect: () => void;
    onSelectBuilder: () => void;
    onSelectDreamer: () => void;
    onSelectChaos: () => void;
}

export const Nexus: React.FC<NexusProps> = ({ onSelectArchitect, onSelectBuilder, onSelectDreamer, onSelectChaos }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 relative z-10"
            >
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                    PATHFINDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">NEXUS</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    Many paths to your future. One choice to start.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
                {/* The Dreamer */}
                <motion.div 
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectDreamer}
                    className="group cursor-pointer relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 transition-all hover:border-purple-500/50 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">The Dreamer</h2>
                        <p className="text-slate-400 font-medium mb-6 text-sm">"I have a dream. Show me the map."</p>
                        <div className="flex items-center text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                            Start Dreaming 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* The Architect */}
                <motion.div 
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectArchitect}
                    className="group cursor-pointer relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">The Architect</h2>
                        <p className="text-slate-400 font-medium mb-6 text-sm">"I know my subjects. Show me my future."</p>
                        <div className="flex items-center text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                            Start Building 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* The Builder */}
                <motion.div 
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectBuilder}
                    className="group cursor-pointer relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">The Builder</h2>
                        <p className="text-slate-400 font-medium mb-6 text-sm">"I want to construct my own degree path."</p>
                        <div className="flex items-center text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                            Start Constructing 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onSelectChaos}
                className="mt-12 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all relative z-10"
            >
                🎲 Chaos Mode
            </motion.button>
        </div>
    );
};
