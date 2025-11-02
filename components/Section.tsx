
import React from 'react';
import { Icon } from './Icon';

interface SectionProps {
    title?: string;
    iconPrompt?: string;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, iconPrompt, children }) => (
    <section className="mt-8 md:mt-12 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
        {title && (
            <div className="flex items-center mb-6">
                {iconPrompt && <Icon prompt={iconPrompt} className="w-8 h-8 mr-4 text-indigo-600" />}
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                    {title}
                </h2>
            </div>
        )}
        <div className="prose prose-slate max-w-none prose-h3:text-xl prose-h3:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
            {children}
        </div>
    </section>
);
