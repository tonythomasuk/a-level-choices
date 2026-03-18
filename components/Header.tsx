import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
    >
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">The Architect</h2>
        <p className="text-slate-500 text-lg font-medium">"I know my subjects. Show me my future."</p>
    </motion.div>
);
