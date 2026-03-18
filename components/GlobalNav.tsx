import React from 'react';
import { motion } from 'motion/react';

interface GlobalNavProps {
    currentView: 'architect' | 'builder' | 'dreamer' | 'nexus';
    onNavigate: (view: 'architect' | 'builder' | 'dreamer' | 'nexus') => void;
}

export const GlobalNav: React.FC<GlobalNavProps> = ({ currentView, onNavigate }) => {
    const navItems = [
        { id: 'architect', label: 'Architect', color: 'bg-indigo-600', textColor: 'text-indigo-600' },
        { id: 'builder', label: 'Builder', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
        { id: 'dreamer', label: 'Dreamer', color: 'bg-purple-600', textColor: 'text-purple-600' },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
            <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
                <button 
                    onClick={() => onNavigate('nexus')}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-black text-xs">N</span>
                    </div>
                    <span className="font-black tracking-tighter text-slate-900 hidden sm:block">A-LEVEL <span className="text-indigo-600">NEXUS</span></span>
                </button>

                <div className="flex items-center gap-1 sm:gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`relative px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                currentView === item.id 
                                    ? 'text-slate-900' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {item.label}
                            {currentView === item.id && (
                                <motion.div 
                                    layoutId="nav-active"
                                    className={`absolute -bottom-1 left-3 right-3 h-1 ${item.color} rounded-full`}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};
