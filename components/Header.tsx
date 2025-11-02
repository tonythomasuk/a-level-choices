import React from 'react';

export const Header: React.FC = () => (
    <header className="relative text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            A-level and Beyond: An Exploration
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
            A friendly guide to help you explore possibilities and play with possible futures.
        </p>
    </header>
);