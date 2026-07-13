import React, { useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { Plus, Calendar, MapPin, Activity, Droplets, Thermometer, Sun, Leaf } from 'lucide-react';
import PlantDetail from './PlantDetail';
import type { Plant } from '../types';

interface PlantListProps {
  onAddClick: () => void;
}

const PlantList: React.FC<PlantListProps> = ({ onAddClick }) => {
  const { plants } = usePlants();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  if (selectedPlant) {
    return <PlantDetail plant={selectedPlant} onBack={() => setSelectedPlant(null)} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={onAddClick} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> 식물 추가
        </button>
      </div>

      {plants.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {plants.map((plant) => (
            <div key={plant.id} className="card" style={{ cursor: 'pointer', padding: '0', overflow: 'hidden' }} onClick={() => setSelectedPlant(plant)}>
              <div style={{ 
                height: '180px', 
                background: plant.photoUrl ? `url(${plant.photoUrl}) center/cover` : 'var(--sage-green)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                color: 'white',
                position: 'relative'
              }}>
                {!plant.photoUrl && <Plus size={48} style={{ opacity: 0.3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
                <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{plant.name}</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{plant.type}</p>
                </div>
                <div style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  background: plant.status === 'healthy' ? '#4CAF50' : plant.status === 'warning' ? '#FF9800' : '#F44336',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {plant.status.toUpperCase()}
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Calendar size={16} /> 심은 날: {new Date(plant.plantedDate).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <MapPin size={16} /> 장소: {plant.location === 'indoor' ? '실내' : '실외'}
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>건강도</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>{plant.healthScore}%</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>성장 로그</p>
                    <p style={{ fontWeight: 'bold' }}>{plant.logs.length}건</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>관리 횟수</p>
                    <p style={{ fontWeight: 'bold' }}>{plant.careLogs.length}건</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '100px 0' }}>
          <Leaf size={64} style={{ color: 'var(--sage-green)', marginBottom: '20px' }} />
          <h3>아직 등록된 식물이 없습니다.</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>당신의 첫 번째 식물을 등록하고 성장을 기록해보세요!</p>
          <button onClick={onAddClick} className="btn-primary">식물 등록하러 가기</button>
        </div>
      )}
    </div>
  );
};

export default PlantList;
