
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlantDetails, Diagnosis } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_ID_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Common name of the plant" },
    botanicalName: { type: Type.STRING, description: "Scientific Latin name" },
    family: { type: Type.STRING, description: "Plant family" },
    description: { type: Type.STRING, description: "Brief interesting description" },
    origin: { type: Type.STRING, description: "Native region" },
    isToxic: { type: Type.BOOLEAN, description: "True if toxic to pets or humans" },
    toxicityDetails: { type: Type.STRING, description: "Details on why it is toxic" },
    isWeed: { type: Type.BOOLEAN, description: "True if commonly considered a weed" },
    confidence: { type: Type.NUMBER, description: "0-1 confidence score" },
    careGuide: {
      type: Type.OBJECT,
      properties: {
        watering: { type: Type.STRING },
        light: { type: Type.STRING },
        soil: { type: Type.STRING },
        humidity: { type: Type.STRING },
        fertilizer: { type: Type.STRING },
        homeRemedies: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Organic or home-based remedies for common issues"
        }
      },
      required: ["watering", "light", "soil", "humidity", "fertilizer", "homeRemedies"]
    }
  },
  required: ["name", "botanicalName", "family", "description", "origin", "isToxic", "toxicityDetails", "isWeed", "confidence", "careGuide"]
};

const DIAGNOSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    condition: { type: Type.STRING, description: "Name of the disease or issue (e.g., Root Rot, Aphids)" },
    severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
    symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
    causes: { type: Type.ARRAY, items: { type: Type.STRING } },
    treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
    prevention: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["condition", "severity", "symptoms", "causes", "treatment", "prevention"]
};

export async function identifyPlant(base64Image: string): Promise<PlantDetails> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Identify this plant accurately. Provide detailed care instructions and check for toxicity/weed status." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: PLANT_ID_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  return { ...data, id: crypto.randomUUID() };
}

export async function diagnosePlant(base64Image: string): Promise<Diagnosis> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analyze the health of this plant. Identify symptoms of disease, pests, or nutrient deficiency. Provide specific treatments and prevention steps." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  return { ...data, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
}

export async function getNearbyGardenCenters(lat: number, lng: number) {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the best garden centers, plant nurseries, and botanical experts near my current location (lat: ${lat}, lng: ${lng}). Provide their names, brief descriptions of what they specialize in, and their addresses.`,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });

  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

export async function getDailyPlantTip(): Promise<{ title: string; tip: string }> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide a unique, expert-level gardening or plant care tip for today. Format as JSON with 'title' and 'tip' keys. The tip should be 1-2 practical sentences.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tip: { type: Type.STRING }
        },
        required: ["title", "tip"]
      }
    }
  });
  return JSON.parse(response.text);
}
