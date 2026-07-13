import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Plant, GrowthLog, CareLog, EnvLog, Reminder } from '../types/index.ts';

interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id' | 'logs' | 'careLogs' | 'envLogs' | 'reminders' | 'status' | 'healthScore'>) => void;
  updatePlant: (plant: Plant) => void;
  deletePlant: (id: string) => void;
  addGrowthLog: (plantId: string, log: Omit<GrowthLog, 'id'>) => void;
  deleteGrowthLog: (plantId: string, logId: string) => void;
  addCareLog: (plantId: string, log: Omit<CareLog, 'id'>) => void;
  deleteCareLog: (plantId: string, logId: string) => void;
  addEnvLog: (plantId: string, log: Omit<EnvLog, 'id'>) => void;
  deleteEnvLog: (plantId: string, logId: string) => void;
  addReminder: (plantId: string, reminder: Omit<Reminder, 'id'>) => void;
  deleteReminder: (plantId: string, reminderId: string) => void;
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
    let score = 85;
    
    if (plant.careLogs.length > 0) {
      const lastWatering = new Date(plant.careLogs.filter(l => l.type === 'watering').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date);
      const daysSinceWatering = (new Date().getTime() - lastWatering.getTime()) / (1000 * 3600 * 24);
      if (daysSinceWatering > 7) score -= 15;
    } else {
      score -= 10;
    }

    if (plant.logs.length >= 2) {
      const sortedLogs = [...plant.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (sortedLogs[0].height < sortedLogs[1].height) score -= 20;
    }

    let status: Plant['status'] = 'healthy';
    if (score < 40) status = 'critical';
    else if (score < 70) status = 'warning';

    return { status, score: Math.max(0, Math.min(100, score)) };
  };

  const addPlant = (plantData: Omit<Plant, 'id' | 'logs' | 'careLogs' | 'envLogs' | 'reminders' | 'status' | 'healthScore'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: crypto.randomUUID(),
      logs: [],
      careLogs: [],
      envLogs: [],
      reminders: [],
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

  const deleteGrowthLog = (plantId: string, logId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      updatePlant({ ...plant, logs: plant.logs.filter(l => l.id !== logId) });
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

  const deleteCareLog = (plantId: string, logId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      updatePlant({ ...plant, careLogs: plant.careLogs.filter(l => l.id !== logId) });
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

  const deleteEnvLog = (plantId: string, logId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      updatePlant({ ...plant, envLogs: plant.envLogs.filter(l => l.id !== logId) });
    }
  };

  const addReminder = (plantId: string, reminderData: Omit<Reminder, 'id'>) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const newReminder = { ...reminderData, id: crypto.randomUUID() };
      const updatedPlant = { ...plant, reminders: [...plant.reminders, newReminder] };
      updatePlant(updatedPlant);
    }
  };

  const deleteReminder = (plantId: string, reminderId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      updatePlant({ ...plant, reminders: plant.reminders.filter(r => r.id !== reminderId) });
    }
  };

  return (
    <PlantContext.Provider value={{ plants, addPlant, updatePlant, deletePlant, addGrowthLog, deleteGrowthLog, addCareLog, deleteCareLog, addEnvLog, deleteEnvLog, addReminder, deleteReminder }}>
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
