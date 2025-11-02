import React from 'react';

interface HeaderProps {
    onSave: () => void;
    onLoad: () => void;
    isSaveDisabled: boolean;
    isLoadDisabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSave, onLoad, isSaveDisabled, isLoadDisabled }) => (
    <header className="relative text-center mb-8 md:mb-12">
        <div className="absolute top-0 right-0 flex gap-2 print:hidden">
            <button
                onClick={onSave}
                disabled={isSaveDisabled}
                className="px-4 py-2 text-sm bg-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Save current analysis"
            >
                Save
            </button>
            <button
                onClick={onLoad}
                disabled={isLoadDisabled}
                className="px-4 py-2 text-sm bg-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Load saved analysis"
            >
                Load
            </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            A-level and Beyond: An Exploration
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
            A friendly guide to help you explore possibilities and play with possible futures.
        </p>
    </header>
);
