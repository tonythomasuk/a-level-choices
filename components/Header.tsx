import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => (
    <header className="relative text-center mb-12 md:mb-20 pt-8">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <span className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
                UK GCSE Student Guide
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tighter">
                A-level <br className="md:hidden" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    & Beyond
                </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                An interactive exploration of how your subject choices today <br className="hidden md:block" />
                shape the incredible possibilities of your tomorrow.
            </p>
        </motion.div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-64 bg-gradient-to-b from-indigo-50/50 to-transparent blur-3xl opacity-50" />
    </header>
);
