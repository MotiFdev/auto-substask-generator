import React from 'react';
import type { ChangeEvent } from 'react';
import type { DropdownOption } from '../../types/subtask.types';

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  error,
  placeholder 
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-gray-900'
        } focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white text-gray-900`}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Dropdown;