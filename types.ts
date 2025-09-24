export type Theme = 'light' | 'dark';

export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

// FIX: Add missing type definitions to resolve import errors.
export type SubjectInputType = 'text' | 'photo' | 'couple';

export const FASHION_CATEGORIES = [
    'Atasan', 
    'Bawahan', 
    'Terusan', 
    'Pakaian Luar', 
    'Sepatu', 
    'Aksesoris', 
    'Pakaian Lengkap', 
    'Kostum'
] as const;

export type FashionCategory = typeof FASHION_CATEGORIES[number];

export type SelectedCategories = {
    [key in FashionCategory]?: boolean;
};

export interface ReferenceFile {
    id: string;
    file: File;
    preview: string;
}

export type FashionReferences = {
    [key in FashionCategory]?: ReferenceFile[];
};

export type CoupleInputMode = 'single_photo' | 'dual_photo' | 'photo_and_text';