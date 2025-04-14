import React from 'react';
import { TextureOption, TextureType } from '../types';

interface TextureSelectorProps {
  label: string;
  options: TextureOption[];
  value: string | null;
  onChange: (value: string) => void;
  type: TextureType;
}

export function TextureSelector({ label, options, value, onChange, type }: TextureSelectorProps) {
  return (
    <div className="relative">
      <label htmlFor={type} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-4 pr-10 bg-white/50 backdrop-blur border border-white/20 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-[2.25rem] pointer-events-none">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}