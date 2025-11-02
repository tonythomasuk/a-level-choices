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
        <div className="space-y-4">
            <div 
                className="text-lg text-slate-700" 
                dangerouslySetInnerHTML={{ __html: introHtml }} 
            />
            <div 
                className="text-base" 
                dangerouslySetInnerHTML={{ __html: bodyHtml }} 
            />
            <div 
                className="p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded-r-lg" 
                dangerouslySetInnerHTML={{ __html: conclusionHtml }} 
            />
        </div>
    );
};