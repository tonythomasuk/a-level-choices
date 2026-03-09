
import React from 'react';

const sources = [
    { name: 'Informed Choices', url: 'https://www.informedchoices.ac.uk' },
    { name: 'UCAS', url: 'https://www.ucas.com' },
    { name: 'The Complete University Guide', url: 'https://www.thecompleteuniversityguide.co.uk' },
    { name: 'Ofqual Analytics', url: 'https://analytics.ofqual.gov.uk' },
    { name: 'HESA', url: 'https://www.hesa.ac.uk' },
];

export const Footer: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    main, main * {
                        visibility: visible;
                    }
                    main {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    button, form, footer {
                        display: none !important;
                    }
                }
                `}
            </style>
            <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="text-left">
                            <h4 className="text-white font-black text-xl mb-2 tracking-tighter">A-level & Beyond</h4>
                            <p className="text-sm max-w-xs">Empowering UK students to explore their academic and professional potential through data-driven insights.</p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="px-8 py-3 bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all border border-white/10"
                        >
                            Export Analysis to PDF
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Primary Data Sources</p>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                {sources.map(source => (
                                    <li key={source.name}>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                                            <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                                            {source.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:text-right flex flex-col justify-end">
                            <p className="text-xs">
                                Created by <a href="https://www.linkedin.com/in/tonythomas/" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">Tony Thomas</a>
                            </p>
                            <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">
                                © {new Date().getFullYear()} • Experimental AI Application
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
