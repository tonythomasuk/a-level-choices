
import React from 'react';
import { Icon } from './Icon';
import { motion } from 'motion/react';

interface SectionProps {
    title?: string;
    iconPrompt?: string;
    children: React.ReactNode;
    delay?: number;
}

export const Section: React.FC<SectionProps> = ({ title, iconPrompt, children, delay = 0 }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className="mt-8 md:mt-12 bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100"
    >
        {title && (
            <div className="flex items-center mb-6">
                {iconPrompt && (
                    <div className="p-2 bg-indigo-50 rounded-lg mr-4">
                        <Icon prompt={iconPrompt} className="w-6 h-6 text-indigo-600" />
                    </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {title}
                </h2>
            </div>
        )}
        <div className="prose prose-slate max-w-none prose-h3:text-xl prose-h3:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
            {children}
        </div>
    </motion.section>
);
