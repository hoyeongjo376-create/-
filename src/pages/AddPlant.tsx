import React, { useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { Camera, MapPin, Tag, Calendar } from 'lucide-react';

interface AddPlantProps {
  onSuccess: () => void;
}

const AddPlant: React.FC<AddPlantProps> = ({ onSuccess }) => {
  const { addPlant } = usePlants();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plantedDate: new Date().toISOString().split('T')[0],
    location: 'indoor' as 'indoor' | 'outdoor',
    photoUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) return;
    
    addPlant(formData);
    onSuccess();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>새로운 식물 등록</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
              <Tag size={16} /> 식물 이름
            </label>
            <input 
              type="text" 
              placeholder="예: 몬스테라, 방울토마토"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
              <Tag size={16} /> 식물 종류
            </label>
            <input 
              type="text" 
              placeholder="예: 관엽식물, 채소"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                <Calendar size={16} /> 심은 날짜
              </label>
              <input 
                type="date" 
                value={formData.plantedDate}
                onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                <MapPin size={16} /> 재배 장소
              </label>
              <select 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value as 'indoor' | 'outdoor'})}
                style={{ width: '100%' }}
              >
                <option value="indoor">실내 (Indoor)</option>
                <option value="outdoor">실외 (Outdoor)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
              <Camera size={16} /> 사진 URL (선택)
            </label>
            <input 
              type="text" 
              placeholder="https://..."
              value={formData.photoUrl}
              onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
              style={{ width: '100%' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>
              * 현재 버전은 URL 입력을 지원합니다.
            </p>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '15px' }}>
            식물 등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlant;
