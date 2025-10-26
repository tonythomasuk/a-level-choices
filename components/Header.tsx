import React from 'react';

const Header: React.FC = () => (
  <header className="text-center mb-8 md:mb-12">
    <div className="flex justify-center items-center gap-4 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.75l-2.03-3.414A2 2 0 018.75 12.5h6.5a2 2 0 011.03 2.836l-2.03 3.414M12 2.25a2 2 0 00-2 2v.75a2 2 0 002 2h.008a2 2 0 002-2v-.75a2 2 0 00-2-2h-.008z" />
      </svg>
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
        A-level Choices
      </h1>
    </div>
    <p className="text-lg text-gray-600">A friendly guide to help open your mind to possibilities.</p>
  </header>
);

export default Header;