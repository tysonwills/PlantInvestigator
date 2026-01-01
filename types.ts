
export enum AppView {
  LANDING = 'LANDING',
  IDENTIFY = 'IDENTIFY',
  DIAGNOSE = 'DIAGNOSE',
  UPGRADE = 'UPGRADE',
  AUTH = 'AUTH',
  MAP = 'MAP',
  REMINDERS = 'REMINDERS',
  GARDEN = 'GARDEN'
}

export interface Reminder {
  id: string;
  plantName: string;
  plantId?: string; // Reference to garden plant
  task: 'Watering' | 'Fertilizing' | 'Pruning' | 'Repotting' | 'Other';
  frequency: string;
  nextDue: string;
  notes?: string;
}

export interface PlantDetails {
  id: string;
  name: string;
  botanicalName: string;
  family: string;
  description: string;
  origin: string;
  isToxic: boolean;
  toxicityDetails: string;
  isWeed: boolean;
  careGuide: {
    watering: string;
    light: string;
    soil: string;
    humidity: string;
    fertilizer: string;
    homeRemedies: string[];
  };
  confidence: number;
  imageUrl?: string; // Store reference image from identification
}

export interface Diagnosis {
  id: string;
  condition: string;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  timestamp: string;
}

// Added HistoryItem interface to support historical tracking in HistoryView
export interface HistoryItem {
  id: string;
  type: 'identification' | 'diagnosis';
  timestamp: string;
  imageUrl: string;
  data: PlantDetails | Diagnosis;
}

export interface User {
  email: string;
  isPremium: boolean;
  isAuthenticated: boolean;
}
