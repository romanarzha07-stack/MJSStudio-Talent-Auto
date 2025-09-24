// THIS FILE IS A WORK IN PROGRESS - It will be refactored and cleaned up.
// For now, it contains all the Gemini API service functions for the various pages.

import type { WatermarkPosition } from '../types';

// =================================================================
// START: SHARED UTILITY FUNCTIONS
// =================================================================

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const base64ToDataUrl = (base64: string, mimeType: string): string => {
    return `data:${mimeType};base64,${base64}`;
}

export const base64ToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    // The match can be null if the data URL is malformed.
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error("Invalid data URL");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

// This function now runs on the client-side, which is fine.
const addWatermark = (base64Image: string, text: string, opacity: number, position: WatermarkPosition): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!text) {
        resolve(base64Image);
        return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Set watermark style
      const fontSize = Math.max(24, Math.round(img.width / 35));
      ctx.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.66})`;
      ctx.lineWidth = Math.max(1, Math.round(fontSize / 20));
      
      const margin = Math.max(10, canvas.height * 0.04);
      let x = 0, y = 0;

      switch(position) {
          case 'top-left':
              ctx.textAlign = 'left'; ctx.textBaseline = 'top'; x = margin; y = margin;
              break;
          case 'top-center':
              ctx.textAlign = 'center'; ctx.textBaseline = 'top'; x = canvas.width / 2; y = margin;
              break;
          case 'top-right':
              ctx.textAlign = 'right'; ctx.textBaseline = 'top'; x = canvas.width - margin; y = margin;
              break;
          case 'middle-left':
              ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; x = margin; y = canvas.height / 2;
              break;
          case 'middle-center':
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; x = canvas.width / 2; y = canvas.height / 2;
              break;
          case 'middle-right':
              ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; x = canvas.width - margin; y = canvas.height / 2;
              break;
          case 'bottom-left':
              ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; x = margin; y = canvas.height - margin;
              break;
          case 'bottom-center':
              ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; x = canvas.width / 2; y = canvas.height - margin;
              break;
          case 'bottom-right':
              ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; x = canvas.width - margin; y = canvas.height - margin;
              break;
      }
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      
      const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
      resolve(canvas.toDataURL(mimeType));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };
    img.src = base64Image;
  });
};

// Centralized function to call our Netlify proxy
async function callGeminiProxy(action: string, payload: unknown) {
    const response = await fetch('/.netlify/functions/geminiProxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}


// =================================================================
// START: AUTO IMAGE PAGE (VISUAL CREATOR) FUNCTIONS
// =================================================================

export const generateVisualCreatorImage = async (
    faceFile: File | null,
    outfitFile: File | null,
    backgroundFile: File | null,
    prompt: string,
    numberOfVariations: number,
    isWatermarkEnabled: boolean,
    watermarkText: string,
    watermarkOpacity: number,
    watermarkPosition: WatermarkPosition,
): Promise<string[]> => {
    
    // Convert files to base64 on the client-side before sending
    const faceData = faceFile ? { base64: await fileToBase64(faceFile), mimeType: faceFile.type } : null;
    const outfitData = outfitFile ? { base64: await fileToBase64(outfitFile), mimeType: outfitFile.type } : null;
    const backgroundData = backgroundFile ? { base64: await fileToBase64(backgroundFile), mimeType: backgroundFile.type } : null;

    const payload = { faceData, outfitData, backgroundData, prompt, numberOfVariations };
    const { rawImages } = await callGeminiProxy('generateVisualCreatorImage', payload);

    if (rawImages.length === 0) {
        throw new Error("Model tidak mengembalikan gambar apa pun.");
    }

    if (!isWatermarkEnabled) {
        return rawImages;
    }

    const finalImages = await Promise.all(
        rawImages.map((img: string) => addWatermark(img, watermarkText, watermarkOpacity, watermarkPosition))
    );

    return finalImages;
};

// =================================================================
// START: MJSTALENT AUTOMODEL PAGE FUNCTIONS
// =================================================================

export const generateBaseModel = async (
    inputType: 'text' | 'reference',
    talentDescription: string,
    outfitGeneration: 'auto' | 'describe',
    talentReferenceFile: File | null | undefined,
    referenceType: 'realistic' | 'non-realistic',
    backgroundColor: 'white' | 'black'
): Promise<string> => {
    
    const talentReferenceData = talentReferenceFile ? { base64: await fileToBase64(talentReferenceFile), mimeType: talentReferenceFile.type } : null;
    const payload = { inputType, talentDescription, outfitGeneration, talentReferenceData, referenceType, backgroundColor };
    
    const { imageUrl } = await callGeminiProxy('generateBaseModel', payload);
    
    if (!imageUrl) {
         throw new Error("Model did not return an image for the base model.");
    }
    
    return imageUrl;
};


export const generateModelPoses = async (
    baseModelFile: File,
    posePrompts: string[],
    backgroundColor: 'white' | 'black',
    onProgress: (image: string, index: number) => void
): Promise<void> => {
    const baseModelB64 = await fileToBase64(baseModelFile);
    
    const generationPromises = posePrompts.map(async (pose, index) => {
        try {
            const payload = { 
                baseModelB64, 
                mimeType: baseModelFile.type, 
                pose, 
                backgroundColor 
            };
            const { imageUrl } = await callGeminiProxy('generateSinglePose', payload);
            if (imageUrl) {
                onProgress(imageUrl, index);
            }
        } catch (error) {
            console.error(`Failed to generate pose: ${pose}`, error);
            // Intentionally not calling onProgress for failures to keep spinner
        }
    });

    await Promise.all(generationPromises);
};


export const describeProductFromImage = async (productReferenceFile: File): Promise<string> => {
    const productData = { base64: await fileToBase64(productReferenceFile), mimeType: productReferenceFile.type };
    const payload = { productData };

    const { description } = await callGeminiProxy('describeProductFromImage', payload);
    return description;
};

export const implementProductOnModel = async (
    baseModelImage: string,
    productReferenceFile: File,
    productDescription: string
): Promise<string[]> => {
    const modelFile = base64ToFile(baseModelImage, 'base_model.png');
    const modelData = { base64: await fileToBase64(modelFile), mimeType: modelFile.type };
    const productData = { base64: await fileToBase64(productReferenceFile), mimeType: productReferenceFile.type };

    const implementationThemes = [
        "Holding Product: The model is holding the product in their hands, looking at the camera with a pleasant expression. The product is clearly visible.",
        "Pointing at Product: The model is holding or positioned next to the product, pointing at it with one hand to draw attention, while looking at the viewer.",
        "Using Product: Generate a realistic scene where the model is naturally using the product. The background should be contextually appropriate (e.g., a bathroom for face wash, a kitchen for a food item).",
        "Presenting Product: The model is presenting the product towards the viewer with open hands, as if offering it. Their expression is inviting and persuasive.",
        "Close-up Interaction: A close-up shot of the model interacting with the product near their face or upper body (e.g., applying cream, smelling a perfume bottle).",
        "Lifestyle Scene: A candid-style shot of the model in a lifestyle setting that complements the product (e.g., relaxing on a sofa with a book, walking in a park with a drink)."
    ];

    const generationPromises = implementationThemes.map(async (theme) => {
        try {
            const payload = { modelData, productData, productDescription, theme };
            const { imageUrl } = await callGeminiProxy('implementSingleProductTheme', payload);
            return imageUrl;
        } catch (error) {
            console.error(`Failed to generate theme: ${theme}`, error);
            return null;
        }
    });

    const generatedImages = await Promise.all(generationPromises);
    
    return generatedImages.filter((img): img is string => !!img);
};
