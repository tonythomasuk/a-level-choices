
import React from 'react';
import { SkipSubjectInfo } from '../types';

interface SkipSubjectProps {
    info: SkipSubjectInfo[] | null;
}

export const SkipSubject: React.FC<SkipSubjectProps> = ({ info }) => {

    if (info === null) {
        return <p>Analyzing university requirements...</p>;
    }

    if (info.length === 0) {
        return <p>Could not retrieve information for the selected subjects.</p>;
    }

    return (
        <div>
            <p className="mb-8 text-slate-500 font-medium italic">Can you still study a subject at university if you don't take it for A-level? Here's a look based on your selections.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {info.map((item, index) => (
                    <div key={index} className="p-6 rounded-2xl border-2 bg-white shadow-sm transition-all hover:shadow-md" style={{ borderColor: item.canSkip ? '#f0fdf4' : '#fef2f2' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-black text-lg text-slate-900">{item.subject}</h4>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.canSkip ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.canSkip ? "Skip Possible" : "Required"}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
