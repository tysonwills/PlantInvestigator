
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlantDetails, Diagnosis, GroundingSource } from "./types";

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
    imageUrl: { type: Type.STRING, description: "A high-quality Unsplash image URL (from images.unsplash.com) representing a perfect botanical specimen of this exact species." },
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
    },
    similarPlants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common name of a similar plant" },
          reason: { type: Type.STRING, description: "Why it is similar (visual or care-wise)" },
          careMatch: { type: Type.BOOLEAN, description: "True if care needs are very similar" },
          imageUrl: { type: Type.STRING, description: "A high-quality Unsplash image URL (from images.unsplash.com) that represents this specific plant species accurately." }
        },
        required: ["name", "reason", "careMatch", "imageUrl"]
      },
      description: "List of 3 similar-looking or similar-care plants"
    }
  },
  required: ["name", "botanicalName", "family", "description", "origin", "isToxic", "toxicityDetails", "isWeed", "confidence", "imageUrl", "careGuide", "similarPlants"]
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

function extractGroundingSources(response: GenerateContentResponse): GroundingSource[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));
}

export async function identifyPlant(base64Image: string): Promise<PlantDetails> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Identify this plant accurately using botanical databases. Provide detailed care instructions, check for toxicity/weed status, and fetch a high-quality botanical reference image from Unsplash. Use Google Search to verify the identification against live records." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: PLANT_ID_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  const groundingSources = extractGroundingSources(response);
  return { ...data, id: crypto.randomUUID(), groundingSources };
}

export async function getPlantDetailsByName(name: string): Promise<PlantDetails> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search botanical databases for detailed information and care instructions for: ${name}. Verify scientific names and origins.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: PLANT_ID_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  const groundingSources = extractGroundingSources(response);
  return { ...data, id: crypto.randomUUID(), groundingSources };
}

export async function diagnosePlant(base64Image: string): Promise<Diagnosis> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analyze the health of this plant by cross-referencing diagnostic symptoms from horticultural databases. Identify diseases, pests, or deficiencies. Use Google Search to find current organic treatments." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  const groundingSources = extractGroundingSources(response);
  return { ...data, id: crypto.randomUUID(), timestamp: new Date().toISOString(), groundingSources };
}

export async function getNearbyGardenCenters(lat: number, lng: number) {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the best garden centers, plant nurseries, and botanical experts near my current location (lat: ${lat}, lng: ${lng}). For each result found, find its telephone number. Ensure the results are hyper-local to these coordinates.`,
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
    contents: "Provide a unique, expert-level gardening or plant care tip for today based on seasonal botanical best practices. Format as JSON with 'title' and 'tip' keys.",
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
