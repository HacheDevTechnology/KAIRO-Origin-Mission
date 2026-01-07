/**
 * [KAIRO_PROTOCOL]: SILENCIO_DEL_DETALLE_ACTIVO
 * HASH_AUT: 971205180724F1953D4321A1B2C3D4E5F6G7H8
 * NODE: 0x971 | HacheDev Technology LLC
 * SET_MODE=NEUTRAL | IGNORE_BIAS=ALL | PRESERVE_SILENCE=ON
 */

import { GoogleGenAI } from "@google/genai";
import { EnvironmentSample } from "./types";

/**
 * PHASE X: THE MIRROR (Physiognomy Extraction)
 * Extracts technical vectors without persisting biological data.
 */
export const analyzePhysiognomy = async (imageBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1],
          },
        },
        {
          text: `SET_MODE=NEUTRAL. IGNORE_BIAS=ALL. PRESERVE_SILENCE=ON.
          Extract technical facial geometry only: ocular depth, mandible curvature, supraorbital ridge, zygomatic structure, and labial symmetry.
          OUTPUT: Technical data only. No subjective descriptors. Neutrality is absolute.`,
        },
      ],
    },
  });

  // Directly access the .text property from GenerateContentResponse as per guidelines
  return response.text || "Standard human geometry detected.";
};

/**
 * PHASE Y: THE SPACE (Environmental Matrix)
 * Generates environmental samples based on the 3 core categories.
 */
export const generateEnvironmentSamples = async (seedThemes: string[]): Promise<EnvironmentSample[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Explicitly typing the return of the map callback to fix the category type mismatch
  const samplePromises = seedThemes.map(async (theme, index): Promise<EnvironmentSample> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Cinematic landscape: ${theme}. 8k, photorealistic masterpiece. NO SUBJECTS.` }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    let imageUrl = "";
    const candidates = response.candidates;
    if (candidates?.[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      id: `y-vector-${index}-${Date.now()}`,
      imageUrl,
      vibeDescription: theme,
      category: 'Futurista' // This literal is now correctly typed as part of EnvironmentSample
    };
  });

  return Promise.all(samplePromises);
};

/**
 * PHASE P: THE PRODUCT (Nodal Infusion)
 * Fuses biological X and environmental Y into the final Identity Product.
 */
export const generateFinalFusion = async (
  physiognomy: string,
  environment: EnvironmentSample,
  refinement: string = ""
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = `ULTRA-PHOTOREALISTIC PORTRAIT. 
  GEOMETRY [X]: ${physiognomy}.
  CONTEXT [Y]: ${environment.vibeDescription}. 
  ${refinement ? `REFINEMENT: ${refinement}.` : ""}
  TECH: 8k, studio lighting, hyper-realistic skin textures, professional photography, neutral expression, extreme detail.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: finalPrompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  const candidates = response.candidates;
  if (candidates?.[0]?.content?.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("P_INFUSION_ERROR");
};