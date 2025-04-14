export type TextureOption = {
  id: string;
  name: string;
  imageUrl: string;
};

export type TextureType = 'countertop' | 'backsplash' | 'wall';

export type TextureSelection = {
  [key in TextureType]: string | null;
};

export type KitchenImage = {
  url: string;
  file: File;
} | null;