import React from 'react';
import { PopularCareer, EarningPotential } from '../types';
import { marked } from 'marked';
import { Icon } from './Icon';

interface PopularCareersProps {
    careers: PopularCareer[];
    earningPotential: EarningPotential;
}

export const PopularCareers: React.FC<PopularCareersProps> = ({ careers, earningPotential }) => {
    if (!earningPotential) return null;

    const summaryHtml = marked.parse(earningPotential.summary || '');
    const outlookHtml = marked.parse(earningPotential.outlook || '');

    return (
        <div className="space-y-8">
            {/* Sub-section for Popular Careers */}
            <div>
                <div className="flex items-center mb-4">
                    <Icon prompt="popular careers" className="w-7 h-7 mr-3 text-purple-600" />
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Popular Careers</h3>
                </div>
                <div className="space-y-4 md:pl-10">
                    {careers.map((career, index) => (
                        <div key={index} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                            <h4 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{career.careerName}</h4>
                            <p className="mt-2 text-slate-600 leading-relaxed">{career.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {career.degreePathways && career.degreePathways.map((path, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                        {path}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Top Employers</span>
                                <div className="flex flex-wrap gap-3">
                                    {career.companies.map((company, i) => (
                                        <span key={i} className="text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                                            {company}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub-section for Earning Potential */}
            <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center mb-4">
                    <Icon prompt="earning potential" className="w-7 h-7 mr-3 text-purple-600" />
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Earning Potential (2 years after Uni)</h3>
                </div>
                 <div className="space-y-6 md:pl-10">
                    <div 
                        className="prose prose-slate max-w-none" 
                        dangerouslySetInnerHTML={{ __html: summaryHtml }} 
                    />
                    
                    {earningPotential.careerSpecifics && earningPotential.careerSpecifics.length > 0 && (
                        <div className="bg-slate-50/70 p-4 rounded-lg border">
                            <ul className="space-y-3">
                                {earningPotential.careerSpecifics.map((item, index) => (
                                    <li key={index} className="flex items-start text-slate-700">
                                        <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(`<strong>${item.careerName}:</strong> ${item.earningInfo}`) }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div 
                        className="prose prose-slate max-w-none italic" 
                        dangerouslySetInnerHTML={{ __html: outlookHtml }} 
                    />
                </div>
            </div>
        </div>
    );
};