import React from 'react';
import { marked } from 'marked';
import type { FutureStory as FutureStoryType } from '../types';

interface FutureStoryProps {
    story: FutureStoryType;
}

export const FutureStory: React.FC<FutureStoryProps> = ({ story }) => {
    if (!story) return null;

    const introHtml = marked.parse(story.introduction || '');
    const bodyHtml = marked.parse(story.body || '');
    const conclusionHtml = marked.parse(story.conclusion || '');

    return (
        <div className="space-y-8">
            <div 
                className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic border-l-4 border-indigo-200 pl-6" 
                dangerouslySetInnerHTML={{ __html: introHtml }} 
            />
            <div 
                className="text-lg text-slate-600 leading-relaxed space-y-4" 
                dangerouslySetInnerHTML={{ __html: bodyHtml }} 
            />
            <div 
                className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-xl shadow-indigo-200" 
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-black">!</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white/70">The Vision</span>
                </div>
                <div className="text-xl font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: conclusionHtml }} />
            </div>
        </div>
    );
};