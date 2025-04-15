import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, RotateCcw, Sparkles } from 'lucide-react';
import { TextureSelector } from './components/TextureSelector';
import { TextureThumbnails } from './components/TextureThumbnails';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { countertops, backsplashes, walls } from './data/textures';
import { KitchenImage, TextureSelection, TextureType } from './types';

function App() {
  const [selections, setSelections] = useState<TextureSelection>({
    countertop: null,
    backsplash: null,
    wall: null,
  });
  const [kitchenImage, setKitchenImage] = useState<KitchenImage>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextureChange = async (type: TextureType, value: string) => {
    setIsLoading(true);
    setSelections((prev) => ({
      ...prev,
      [type]: value || null,
    }));
  
    if (kitchenImage?.file && value) {
      try {
        // Create FormData to send the image file and texture data
        const formData = new FormData();
        formData.append('kitchenImage', kitchenImage.file); // Append the kitchen image file
        formData.append('textureImageId', value); // Append the texture image ID
        formData.append('textureType', type); // Append the texture type (e.g., countertop, backsplash, wall)
  
        // Send the POST request to the backend
        const response = await axios.post('http://145.223.75.201:7077/api/process-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
          },
          responseType: 'blob', // Expect a binary file (image) as the response
        });
  
        // Create a URL for the received image blob
        const imageUrl = URL.createObjectURL(response.data);
        setProcessedImage(imageUrl); // Update the state with the processed image URL
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  
    setIsLoading(false);
  };

  const handleImageUpload = (image: { url: string; file: File }) => {
    const file = image.file;
  
    // Create a FileReader to read the uploaded image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to crop the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          // Set canvas size to 640x640
          canvas.width = 640;
          canvas.height = 640;
  
          // Calculate cropping dimensions to center the image
          const cropSize = Math.min(img.width, img.height); // Use the smaller dimension
          const cropX = (img.width - cropSize) / 2;
          const cropY = (img.height - cropSize) / 2;
  
          // Draw the cropped image onto the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropSize,
            cropSize,
            0,
            0,
            640,
            640
          );
        } else {
          console.error('Failed to get 2D context from canvas');
        }
  
        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, { type: file.type });
            const croppedUrl = URL.createObjectURL(croppedFile);
  
            // Update the state with the cropped image
            setKitchenImage({
              url: croppedUrl, // Use the cropped image URL for display
              file: croppedFile, // Use the cropped file for backend processing
            });
          }
        }, file.type);
      };
  
      img.src = event.target?.result as string;
    };
  
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setKitchenImage(null); // Clear the uploaded kitchen image
    setProcessedImage(null); // Clear the processed image
    setSelections({
      countertop: null,
      backsplash: null,
      wall: null,
    }); // Reset texture selections
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download result');
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/background.jpg"
            alt="Modern kitchen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="float-animation">
            <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
              Kitchen Visualizer
              <Sparkles className="inline-block ml-4 w-12 h-12" />
            </h1>
            <p className="text-2xl text-white/90 max-w-2xl">
              Transform your kitchen with AI-powered visualization. Experience your dream design before making it a reality.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-16">
        {/* Full-width Preview Section */}
        <div className="max-w-[1920px] mx-auto glass-effect rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl mb-12">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-8">
              <ImagePreview
                image={kitchenImage} // Pass the kitchenImage state
                title="Original Kitchen"
                placeholder="Upload an image to start"
              />
              <ImagePreview
                image={processedImage ? { url: processedImage, file: new File([], "placeholder") } : null} // Pass the processed image URL with a placeholder file
                title="Visualized Result"
                placeholder="Select options and upload an image to visualize"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleReset}
              className="flex items-center justify-center flex-1 h-14 px-8 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={!kitchenImage}
              className="flex items-center justify-center flex-1 h-14 px-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-teal-500"
            >
              <Download className="w-6 h-6 mr-2" />
              Download Result
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Texture Selection */}
            <div className="glass-effect rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
                Customize Your Kitchen
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-teal-500 ml-4 rounded-full" />
              </h2>
              
              {/* Texture Selectors */}
              <div className="space-y-6">
                <TextureSelector
                  label="Countertop"
                  options={countertops}
                  value={selections.countertop}
                  onChange={(value) => handleTextureChange('countertop', value)}
                  type="countertop"
                />
                <TextureSelector
                  label="Backsplash"
                  options={backsplashes}
                  value={selections.backsplash}
                  onChange={(value) => handleTextureChange('backsplash', value)}
                  type="backsplash"
                />
                <TextureSelector
                  label="Wall"
                  options={walls}
                  value={selections.wall}
                  onChange={(value) => handleTextureChange('wall', value)}
                  type="wall"
                />
              </div>

              {/* Image Upload */}
              <div className="mt-8">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            </div>

            {/* Right Column: Texture Thumbnails */}
            <div className="glass-effect rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <TextureThumbnails
                label="Countertop"
                options={countertops}
                selectedId={selections.countertop}
                onSelect={(id) => handleTextureChange('countertop', id)}
              />
              <TextureThumbnails
                label="Backsplash"
                options={backsplashes}
                selectedId={selections.backsplash}
                onSelect={(id) => handleTextureChange('backsplash', id)}
              />
              <TextureThumbnails
                label="Wall"
                options={walls}
                selectedId={selections.wall}
                onSelect={(id) => handleTextureChange('wall', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;