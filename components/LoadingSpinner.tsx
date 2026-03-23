
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingSpinnerProps {
    messages?: string[];
}

const defaultMessages = [
    "Analyzing A-Level Synergy...",
    "Consulting Russell Group Guidance...",
    "Cross-referencing University Courses...",
    "Calculating HESA Earnings Data...",
    "Mapping Career Pathways...",
    "Crafting Your Future Story...",
];

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ messages = defaultMessages }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, [messages]);

    return (
        <div className="flex flex-col items-center justify-center my-20 py-10">
            <div className="relative w-24 h-24">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-indigo-100 rounded-full"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-indigo-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                </div>
            </div>
            
            <div className="mt-8 h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] text-center"
                    >
                        {messages[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};
