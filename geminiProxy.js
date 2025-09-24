const { GoogleGenAI, Modality } = require("@google/genai");

// This function is the single entry point for all Gemini API calls from the frontend.
exports.handler = async (event) => {
  // Only allow POST requests for security
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // The `action` tells us which Gemini operation to perform.
    // The `payload` contains all the necessary data for that action.
    const { action, payload } = JSON.parse(event.body);

    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set on the server.");
      throw new Error("Server configuration error: API_KEY is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let response;

    switch (action) {
      case 'generateVisualCreatorImage':
        response = await handleVisualCreator(ai, payload);
        break;
      case 'generateBaseModel':
        response = await handleBaseModel(ai, payload);
        break;
      case 'generateSinglePose':
        response = await handleSinglePose(ai, payload);
        break;
      case 'describeProductFromImage':
        response = await handleDescribeProduct(ai, payload);
        break;
      case 'implementSingleProductTheme':
        response = await handleSingleProductTheme(ai, payload);
        break;
      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action specified.' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error executing Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};

// --- Action Handlers ---

async function handleVisualCreator(ai, payload) {
  const { faceData, outfitData, backgroundData, prompt, numberOfVariations } = payload;
  const parts = [];

  let referenceInstruction = "**Referensi:**\n";
  let hasReference = false;

  if (faceData) {
    parts.push({ inlineData: { mimeType: faceData.mimeType, data: faceData.base64 } });
    referenceInstruction += "- Wajah, kepala, dan rambut subjek harus secara akurat meniru gambar referensi pertama.\n";
    hasReference = true;
  }
  if (outfitData) {
    parts.push({ inlineData: { mimeType: outfitData.mimeType, data: outfitData.base64 } });
    referenceInstruction += "- Pakaian subjek harus meniru dengan tepat gambar referensi kedua.\n";
    hasReference = true;
  }
  if (backgroundData) {
    parts.push({ inlineData: { mimeType: backgroundData.mimeType, data: backgroundData.base64 } });
    referenceInstruction += "- Latar belakang dan suasana gambar harus meniru dengan tepat gambar referensi ketiga.\n";
    hasReference = true;
  }

  const fullPrompt = `**Tugas:** Buat gambar berdasarkan deskripsi dan gambar referensi berikut.\n\n${hasReference ? referenceInstruction : ''}**Deskripsi / Prompt Utama:**\n${prompt}\n\n**Persyaratan Tambahan:**\n- Rasio Aspek: 9:16 (Potret)\n- Gaya: Fotorealistik, sinematik, berkualitas tinggi.\n- Pengecualian: Jangan sertakan teks, logo, atau artefak aneh.`;
  parts.unshift({ text: fullPrompt });

  const rawImages = [];
  for (let i = 0; i < numberOfVariations; i++) {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    const imagePart = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      rawImages.push(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
    }
    if (i < numberOfVariations - 1) await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return { rawImages };
}

async function handleBaseModel(ai, payload) {
  const { inputType, talentDescription, outfitGeneration, talentReferenceData, referenceType, backgroundColor } = payload;
  const parts = [];
  let subjectInstruction = '';
  let styleInstruction = 'Photorealistic';

  if (inputType === 'reference' && talentReferenceData) {
    parts.push({ inlineData: { mimeType: talentReferenceData.mimeType, data: talentReferenceData.base64 } });
    subjectInstruction = 'Strictly maintain the subject’s face, body, and overall appearance from the reference image. Dress them in a neutral, casual top (e.g., a plain grey t-shirt).';
    if (referenceType === 'non-realistic') {
      styleInstruction = 'Maintain the exact same artistic style as the reference image.';
    }
  } else if (inputType === 'text') {
    subjectInstruction = outfitGeneration === 'auto'
      ? `The subject is: "${talentDescription}". Dress them in a neutral, casual top (accessories optional). Focus on the waist-up area.`
      : `The subject is: "${talentDescription}".`;
  }
  
  const prompt = `**Primary Task:** Generate one "base model" image.\n\n**Strict Requirements:**\n1.  **Subject:** ${subjectInstruction}\n2.  **Pose:** A neutral standing pose, facing forward with a friendly, natural smile.\n3.  **Style:** ${styleInstruction}\n4.  **Composition:** The final image must be a half-body portrait with a 1:1 (square) aspect ratio.\n5.  **Background:** The background must be a solid ${backgroundColor} color (${backgroundColor === 'white' ? '#FFFFFF' : '#000000'}).\n6.  **Exclusions:** Do not include any text or logos.`;
  parts.unshift({ text: prompt });

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts },
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const imagePart = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  const imageUrl = imagePart ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null;
  return { imageUrl };
}

async function handleSinglePose(ai, payload) {
    const { baseModelB64, mimeType, pose, backgroundColor } = payload;
    const parts = [{ inlineData: { mimeType, data: baseModelB64 } }];
    const prompt = `**Primary Task:** Recreate the subject from the reference image in a new pose.\n\n**Strict Requirements:**\n1.  **Subject:** Strictly maintain the subject’s face, body, and clothing from the reference image.\n2.  **New Pose:** ${pose}\n3.  **Style:** Photorealistic, maintaining the same lighting and quality as the reference.\n4.  **Composition:** The final image must be a half-body portrait with a 1:1 (square) aspect ratio.\n5.  **Background:** The background must be a solid ${backgroundColor} color (${backgroundColor === 'white' ? '#FFFFFF' : '#000000'}).\n6.  **Exclusions:** Do not include any text or logos.`;
    parts.unshift({ text: prompt });

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    const imagePart = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    const imageUrl = imagePart ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null;
    return { imageUrl };
}

async function handleDescribeProduct(ai, payload) {
    const { productData } = payload;
    const parts = [
        { inlineData: { mimeType: productData.mimeType, data: productData.base64 } },
        { text: `Analyze the provided image of a product. Based on your analysis, answer the following:\n1. Is this product a wearable clothing item (like a shirt, jacket, dress) or a holdable/usable item (like a cosmetic, gadget, accessory)?\n2. Provide a concise, one-sentence description of the product, including its main color and type.\n\nFormat your response as:\n[WEARABLE/HOLDABLE] - [One-sentence description]` }
    ];
    const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts } });
    return { description: result.text };
}

async function handleSingleProductTheme(ai, payload) {
    const { modelData, productData, productDescription, theme } = payload;
    const parts = [
        { inlineData: { mimeType: modelData.mimeType, data: modelData.base64 } },
        { inlineData: { mimeType: productData.mimeType, data: productData.base64 } }
    ];

    const prompt = `**Primary Task:** Create a commercial image based on the theme: "${theme}".\n\n**Image References:**\n-   **Image 1 (Posed Subject):** Contains the subject whose face, body, pose, and background must be precisely maintained.\n-   **Image 2 (Product Reference):** Contains the product to be integrated.\n\n**Strict Instructions:**\n1.  **Maintain Subject:** Exactly copy the subject from Image 1 (face, body, pose, camera angle, solid background).\n2.  **Product Integration:**\n    -   **If the product is WEARABLE (clothing):** Take the clothing item from Image 2 and realistically place it on the subject from Image 1, replacing their original outfit.\n    -   **If the product is HOLDABLE/USABLE (not clothing):** The model should interact with the product from Image 2 as described in the theme, **while keeping their original outfit from Image 1.**\n3.  **Product Description:** The product is: "${productDescription.split(' - ')[1]}".\n4.  **Composition:** Maintain the 1:1 square aspect ratio and solid background from Image 1, unless the theme is "Using Product" or "Lifestyle Scene", in which case a new, realistic background is required.`;
    parts.unshift({ text: prompt });

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    const imagePart = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    const imageUrl = imagePart ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null;
    return { imageUrl };
}
