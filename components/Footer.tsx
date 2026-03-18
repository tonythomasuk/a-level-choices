
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintPreview } from './PrintPreview';

const sourceGroups = [
    {
        category: 'Academic Guidance',
        items: [
            { name: 'Informed Choices', url: 'https://www.informedchoices.ac.uk' },
            { name: 'UCAS', url: 'https://www.ucas.com' },
            { name: 'The Complete University Guide', url: 'https://www.thecompleteuniversityguide.co.uk' },
        ]
    },
    {
        category: 'Career Insights',
        items: [
            { name: 'National Careers Service', url: 'https://nationalcareers.service.gov.uk' },
            { name: 'Prospects.ac.uk', url: 'https://www.prospects.ac.uk' },
        ]
    },
    {
        category: 'University Data',
        items: [
            { name: 'Russell Group Universities', url: 'https://russellgroup.ac.uk' },
            { name: 'Ofqual Analytics', url: 'https://analytics.ofqual.gov.uk' },
            { name: 'HESA', url: 'https://www.hesa.ac.uk' },
        ]
    }
];

export const Footer: React.FC = () => {
    const [includeArchitect, setIncludeArchitect] = React.useState(true);
    const [includeBuilder, setIncludeBuilder] = React.useState(false);
    const [includeDreamer, setIncludeDreamer] = React.useState(false);
    
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Pathfinder-Nexus-Report',
    });

    return (
        <>
            <div style={{ display: 'none' }}>
                <PrintPreview 
                    ref={componentRef} 
                    config={{ includeArchitect, includeBuilder, includeDreamer }} 
                />
            </div>
            <footer className="bg-slate-900 text-slate-400 py-16 mt-20 print:hidden">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="text-left">
                            <h4 className="text-white font-black text-xl mb-2 tracking-tighter">Pathfinder Nexus</h4>
                            <p className="text-sm max-w-xs mb-6">Empowering UK students to explore their academic and professional potential through data-driven insights.</p>
                            
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Include in PDF:</p>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={includeArchitect} 
                                        onChange={e => setIncludeArchitect(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                    />
                                    <span className={`text-xs font-bold transition-colors ${includeArchitect ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>The Architect</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={includeBuilder} 
                                        onChange={e => setIncludeBuilder(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                    />
                                    <span className={`text-xs font-bold transition-colors ${includeBuilder ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>The Builder</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={includeDreamer} 
                                        onChange={e => setIncludeDreamer(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                                    />
                                    <span className={`text-xs font-bold transition-colors ${includeDreamer ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>The Dreamer</span>
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={() => handlePrint()}
                            className="px-10 py-4 bg-white text-slate-900 font-black text-sm uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-all shadow-xl shadow-white/5"
                        >
                            Generate PDF Report
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                        {sourceGroups.map(group => (
                            <div key={group.category} className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">{group.category}</p>
                                <ul className="space-y-2 text-xs">
                                    {group.items.map(source => (
                                        <li key={source.name}>
                                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                                                <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                                                {source.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-xs">
                                Created by <a href="https://www.linkedin.com/in/tonythomas/" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">Tony Thomas</a>
                            </p>
                        </div>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">
                            © {new Date().getFullYear()} • Experimental AI Application
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};
