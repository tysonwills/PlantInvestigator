import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlantDetails, Diagnosis, GroundingSource } from "./types";

// Utility to create a fresh AI instance per call as per SDK guidelines
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_ID_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Common name of the plant" },
    botanicalName: { type: Type.STRING, description: "Scientific Latin name including variety/cultivar according to RHS taxonomy" },
    family: { type: Type.STRING, description: "Plant family" },
    description: { type: Type.STRING, description: "Professional botanical description focusing on unique identifying features and morphological traits as per RHS standards" },
    origin: { type: Type.STRING, description: "Native region and natural habitat" },
    isToxic: { type: Type.BOOLEAN, description: "True if toxic to pets or humans" },
    toxicityDetails: { type: Type.STRING, description: "Specific details on toxins and effects" },
    isWeed: { type: Type.BOOLEAN, description: "True if commonly considered invasive or a weed" },
    hasAgm: { type: Type.BOOLEAN, description: "True if the plant holds the RHS Award of Garden Merit (AGM)" },
    confidence: { type: Type.NUMBER, description: "Accuracy score (0-1) based on morphological match" },
    imageUrl: { type: Type.STRING, description: "A high-definition, DIRECT image URL. MUST prioritize verified RHS (rhs.org.uk) image assets found via Google Search." },
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
          description: "RHS-approved organic or traditional horticultural remedies"
        }
      },
      required: ["watering", "light", "soil", "humidity", "fertilizer", "homeRemedies"]
    },
    similarPlants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
          careMatch: { type: Type.BOOLEAN },
          imageUrl: { type: Type.STRING, description: "Verified RHS image URL for this similar plant" }
        },
        required: ["name", "reason", "careMatch", "imageUrl"]
      },
      description: "List of 3 plants in the same RHS group or frequently confused with this species."
    }
  },
  required: ["name", "botanicalName", "family", "description", "origin", "isToxic", "toxicityDetails", "isWeed", "hasAgm", "confidence", "imageUrl", "careGuide", "similarPlants"]
};

const DIAGNOSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    condition: { type: Type.STRING, description: "Name of the disease or pest according to RHS Plant Pathology" },
    severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
    symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
    causes: { type: Type.ARRAY, items: { type: Type.STRING } },
    treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
    prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
    homeRemedies: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "RHS-approved natural solutions"
    }
  },
  required: ["condition", "severity", "symptoms", "causes", "treatment", "prevention", "homeRemedies"]
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

async function handleApiError(error: any): Promise<never> {
  console.error("Gemini API Error:", error);
  const msg = error?.message || "";
  if (msg.includes("Requested entity was not found") || msg.includes("API_KEY") || msg.includes("permission")) {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  }
  throw error;
}

export async function identifyPlant(base64Image: string): Promise<PlantDetails> {
  try {
    const ai = getAi();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Act as an RHS Botanical Scientist. Identify this plant STRICTLY using the RHS (Royal Horticultural Society) database for details and taxonomy. SEARCH and provide the official RHS image URL (from rhs.org.uk) and specify if it has the Award of Garden Merit (AGM)." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: PLANT_ID_SCHEMA,
        thinkingConfig: { thinkingBudget: 12000 }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const groundingSources = extractGroundingSources(response);
    return { ...data, id: crypto.randomUUID(), groundingSources };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getPlantDetailsByName(name: string): Promise<PlantDetails> {
  try {
    const ai = getAi();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform an RHS database lookup for '${name}'. Return the scientific name, official description, and a verified RHS image URL. Check for AGM status.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: PLANT_ID_SCHEMA,
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const groundingSources = extractGroundingSources(response);
    return { ...data, id: crypto.randomUUID(), groundingSources };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function diagnosePlant(base64Image: string): Promise<Diagnosis> {
  try {
    const ai = getAi();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Diagnose this plant issue using RHS Plant Pathology standards. Provide RHS-approved treatments." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
        thinkingConfig: { thinkingBudget: 10000 }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const groundingSources = extractGroundingSources(response);
    return { ...data, id: crypto.randomUUID(), timestamp: new Date().toISOString(), groundingSources };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getNearbyGardenCenters(lat: number, lng: number) {
  try {
    const ai = getAi();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find RHS-affiliated nurseries or reputable garden centers near ${lat}, ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      },
    });

    return {
      text: response.text || "",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getDailyPlantTip(): Promise<{ title: string; tip: string }> {
  try {
    const ai = getAi();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a seasonal gardening tip from RHS standards. Return as JSON.",
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
    return JSON.parse(response.text || "{}");
  } catch (err) {
    return { title: "RHS Seasonal Advice", tip: "Ensure your garden tools are cleaned and sharpened as per standard RHS advice." };
  }
}