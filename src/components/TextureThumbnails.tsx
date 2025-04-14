import React from 'react';
import { TextureOption } from '../types';

interface TextureThumbnailsProps {
  options: TextureOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
}

export function TextureThumbnails({ options, selectedId, onSelect, label }: TextureThumbnailsProps) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
        {label} Textures
        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-4" />
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              selectedId === option.id ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}
          >
            <img
              src={option.imageUrl}
              alt={option.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
              <span className="text-white text-sm font-medium transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                {option.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}