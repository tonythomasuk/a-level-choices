
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
            <footer className="bg-slate-800 text-slate-300 text-center py-8 mt-12">
                <div className="container mx-auto max-w-4xl px-4">
                     <button
                        onClick={handlePrint}
                        className="mb-6 px-6 py-2 bg-slate-600 text-white font-bold rounded-full hover:bg-slate-500 transition-colors"
                    >
                        Export Results to PDF / Print
                    </button>
                    <p className="text-sm">
                        Copyright © {new Date().getFullYear()} <a href="https://www.linkedin.com/in/tonythomas/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Tony Thomas</a>. Experimental app using public data from official sources.
                    </p>
                    <div className="mt-4 text-xs">
                        <p className="font-semibold mb-1">Primary Data Sources:</p>
                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                            {sources.map(source => (
                                <li key={source.name}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        {source.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};
