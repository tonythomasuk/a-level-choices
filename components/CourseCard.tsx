import React from 'react';
import { motion } from 'motion/react';

interface CourseCardProps {
    title: string;
    university: string;
    typicalOffer?: string;
    mandatorySubjects: string[];
    helpfulSubjects: string[];
    helpfulGCSEs: string[];
    specialConditions: string;
    subjectFitAnalysis?: string;
    url?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    title,
    university,
    typicalOffer,
    mandatorySubjects,
    helpfulSubjects,
    helpfulGCSEs,
    specialConditions,
    subjectFitAnalysis,
    url
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8"
        >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 mb-4">
                        {university}
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
                </div>
                {typicalOffer && (
                    <div className="flex-shrink-0">
                        <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-center">
                            <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Typical Offer</span>
                            <span className="text-lg font-black">{typicalOffer}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mandatory A-Levels</h4>
                        <div className="flex flex-wrap gap-2">
                            {mandatorySubjects.map(s => (
                                <span key={s} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Helpful A-Levels</h4>
                        <div className="flex flex-wrap gap-2">
                            {helpfulSubjects.map(s => (
                                <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Helpful GCSEs</h4>
                        <div className="flex flex-wrap gap-2">
                            {helpfulGCSEs.map(s => (
                                <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Special Conditions</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{specialConditions}</p>
                    </div>
                </div>
            </div>

            {subjectFitAnalysis && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-2">Subject Fit Analysis</span>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{subjectFitAnalysis}</p>
                </div>
            )}
            
            {url && (
                <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors"
                    >
                        View Course Details 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>
            )}
        </motion.div>
    );
};
