import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Plant, GrowthLog, CareLog, EnvLog } from '../types/index.ts';

interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id' | 'logs' | 'careLogs' | 'envLogs' | 'status' | 'healthScore'>) => void;
  updatePlant: (plant: Plant) => void;
  deletePlant: (id: string) => void;
  addGrowthLog: (plantId: string, log: Omit<GrowthLog, 'id'>) => void;
  addCareLog: (plantId: string, log: Omit<CareLog, 'id'>) => void;
  addEnvLog: (plantId: string, log: Omit<EnvLog, 'id'>) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('plant-manager-data');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse plant data', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('plant-manager-data', JSON.stringify(plants));
  }, [plants]);

  const calculateHealth = (plant: Plant): { status: Plant['status'], score: number } => {
    // Simple logic for high school project
    // In a real app, this would be more complex
    let score = 85;
    
    // Check watering frequency
    if (plant.careLogs.length > 0) {
      const lastWatering = new Date(plant.careLogs.filter(l => l.type === 'watering').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date);
      const daysSinceWatering = (new Date().getTime() - lastWatering.getTime()) / (1000 * 3600 * 24);
      if (daysSinceWatering > 7) score -= 15;
    } else {
      score -= 10;
    }

    // Check growth trend
    if (plant.logs.length >= 2) {
      const sortedLogs = [...plant.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (sortedLogs[0].height < sortedLogs[1].height) score -= 20;
    }

    let status: Plant['status'] = 'healthy';
    if (score < 40) status = 'critical';
    else if (score < 70) status = 'warning';

    return { status, score: Math.max(0, Math.min(100, score)) };
  };

  const addPlant = (plantData: Omit<Plant, 'id' | 'logs' | 'careLogs' | 'envLogs' | 'status' | 'healthScore'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: crypto.randomUUID(),
      logs: [],
      careLogs: [],
      envLogs: [],
      status: 'healthy',
      healthScore: 100,
    };
    setPlants([...plants, newPlant]);
  };

  const updatePlant = (updatedPlant: Plant) => {
    const { status, score } = calculateHealth(updatedPlant);
    const finalPlant = { ...updatedPlant, status, healthScore: score };
    setPlants(plants.map(p => p.id === finalPlant.id ? finalPlant : p));
  };

  const deletePlant = (id: string) => {
    setPlants(plants.filter(p => p.id !== id));
  };

  const addGrowthLog = (plantId: string, logData: Omit<GrowthLog, 'id'>) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const newLog = { ...logData, id: crypto.randomUUID() };
      const updatedPlant = { ...plant, logs: [...plant.logs, newLog] };
      updatePlant(updatedPlant);
    }
  };

  const addCareLog = (plantId: string, logData: Omit<CareLog, 'id'>) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const newLog = { ...logData, id: crypto.randomUUID() };
      const updatedPlant = { ...plant, careLogs: [...plant.careLogs, newLog] };
      updatePlant(updatedPlant);
    }
  };

  const addEnvLog = (plantId: string, logData: Omit<EnvLog, 'id'>) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const newLog = { ...logData, id: crypto.randomUUID() };
      const updatedPlant = { ...plant, envLogs: [...plant.envLogs, newLog] };
      updatePlant(updatedPlant);
    }
  };

  return (
    <PlantContext.Provider value={{ plants, addPlant, updatePlant, deletePlant, addGrowthLog, addCareLog, addEnvLog }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};
