export interface Plant {
  id: string;
  name: string;
  type: string;
  plantedDate: string;
  location: 'indoor' | 'outdoor';
  photoUrl?: string;
  logs: GrowthLog[];
  careLogs: CareLog[];
  envLogs: EnvLog[];
  status: 'healthy' | 'warning' | 'critical';
  healthScore: number;
}

export interface GrowthLog {
  id: string;
  date: string;
  height: number;
  leafCount: number;
  photoUrl?: string;
  note: string;
}

export interface CareLog {
  id: string;
  date: string;
  type: 'watering' | 'fertilizer' | 'repotting' | 'other';
  amount?: string;
  note: string;
}

export interface EnvLog {
  id: string;
  date: string;
  temperature: number;
  humidity: number;
  lightExposure: number; // hours
  soilCondition: 'dry' | 'moist' | 'wet';
}

export interface StressRecord {
  id: string;
  plantId: string;
  date: string;
  stressType: 'high_temp' | 'low_temp' | 'drought' | 'overwater' | 'nutrient_deficiency';
  description: string;
}
