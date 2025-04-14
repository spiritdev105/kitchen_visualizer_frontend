import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (image: { url: string; file: File }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      const url = URL.createObjectURL(file); // Create a blob URL for the file
      onImageUpload({ url, file }); // Pass the blob URL and file to the parent component
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange} // Call the handler when a file is selected
        className="hidden"
        id="file-upload" // Ensure this matches the htmlFor attribute
      />
      <label
        htmlFor="file-upload" // Match this with the input's id
        className="group flex items-center justify-center w-full h-14 px-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-teal-600 hover:shadow-lg"
      >
        <Upload className="w-5 h-5 text-white mr-2 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-white font-medium">Upload Kitchen Image</span>
      </label>
    </div>
  );
};