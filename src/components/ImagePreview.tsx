import React from 'react';
import { KitchenImage } from '../types';

interface ImagePreviewProps {
  image: KitchenImage;
  title: string;
  placeholder: string;
}

export function ImagePreview({ image, title, placeholder }: ImagePreviewProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        {title}
        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-4" />
      </h3>
      <div className="aspect-[4/3] bg-white/30 backdrop-blur rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-white/20">
      {image ? (
        <img
          src={image.url} // Use the URL from the image prop
          alt="Kitchen preview"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-white/5 to-white/10">
          <p className="text-center px-6 text-lg">{placeholder}</p>
        </div>
      )}
      </div>
    </div>
  );
}