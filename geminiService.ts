
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
 * Neutral geometric analysis of biological traits.
 */
export const analyzePhysiognomy = async (imageBase64: string): Promise<string> => {
  // Always use process.env.API_KEY and create instance right before call
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
          OBJECTIVE: Extract technical facial geometry vectors.
          METRICS: Ocular depth, jawline curvature, supraorbital ridge structure, zygomatic bone volume, nasal profile, labial symmetry.
          CONSTRAINT: No subjective descriptors. No aesthetic evaluation. Discard background. Technical output only.`,
        },
      ],
    },
  });

  return response.text || "Standard human geometry node detected.";
};

/**
 * PHASE Y: THE SPACE (Environmental Vectors)
 */
export const generateEnvironmentSamples = async (seedThemes: string[]): Promise<EnvironmentSample[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const samplePromises = seedThemes.map(async (theme, index) => {
    const prompt = `Cinematic environmental masterwork: ${theme}. 8k, hyper-realistic, volumetric lighting. NO PEOPLE. Masterpiece level rendering.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    let imageUrl = "";
    // Accessing parts safely and iterating to find the image part
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      id: `vector-${index}-${Date.now()}`,
      imageUrl,
      vibeDescription: theme,
      // Fix: Added placeholder category to satisfy EnvironmentSample type. 
      // This will be properly mapped in the App component.
      category: 'Futurista' 
    };
  });

  // Now returns Promise<EnvironmentSample[]> correctly
  return Promise.all(samplePromises);
};

/**
 * PHASE P: THE PRODUCT (Nodal Infusion)
 * Fuses X (Identity) and Y (Space) into P (Product).
 */
export const generateFinalFusion = async (
  physiognomy: string,
  environment: EnvironmentSample,
  refinement: string = ""
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = `PHOTOREALISTIC PORTRAIT SYNTHESIS. 
  SUBJECT TRAITS [X]: ${physiognomy}.
  ENVIRONMENTAL ANCHOR [Y]: ${environment.vibeDescription}. 
  ${refinement ? `ALCHEMICAL REFINEMENT: ${refinement}.` : ""}
  SPECS: Extreme fidelity, accurate mirroring of traits, professional studio lighting, 8k resolution, cinematic mood.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: finalPrompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  const candidates = response.candidates;
  if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("P_INFUSION_ANOMALY");
};
