import React from 'react';

const Select = ({ value, onChange, options, placeholder, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
        </div>
    );
};

export default Select;
