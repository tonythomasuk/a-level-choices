import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    suggestions: string[];
    isOptional?: boolean;
    disabled: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, value, onChange, placeholder, suggestions, isOptional = false, disabled }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.currentTarget.value;
        onChange(userInput);

        if (userInput) {
            const filtered = suggestions.filter(
                suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );
            setFilteredSuggestions(filtered.slice(0, 5)); // Limit suggestions
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const onSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
    };
    
    const onClear = () => {
        onChange('');
    };

    return (
        <div className="flex flex-col relative" ref={containerRef}>
            <label className="mb-2 font-semibold text-gray-700 flex items-center">
                {label}
                <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${isOptional ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {isOptional ? 'Optional' : 'Mandatory'}
                </span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => { if(value) setShowSuggestions(true); }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                 {value && !disabled && (
                    <button onClick={onClear} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto" style={{ top: '100%' }}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="p-3 cursor-pointer hover:bg-brand-primary/10"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
