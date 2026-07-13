import React, { useState } from 'react';
import type { Plant } from '../types';
import { usePlants } from '../context/PlantContext';
import { ArrowLeft, Droplets, Thermometer, Sun, FileText, ClipboardList, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PlantDetailProps {
  plant: Plant;
  onBack: () => void;
  initialTab?: 'overview' | 'growth' | 'care' | 'env' | 'reminder';
}

const PlantDetail: React.FC<PlantDetailProps> = ({ plant, onBack, initialTab }) => {
  const { addGrowthLog, deleteGrowthLog, updateGrowthLog, addCareLog, deleteCareLog, updateCareLog, addEnvLog, deleteEnvLog, updateEnvLog, addReminder, deleteReminder, updateReminder } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'care' | 'env' | 'reminder'>(initialTab || 'overview');
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const growthData = {
    labels: plant.logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(l => l.date),
    datasets: [
      {
        label: '높이 (cm)',
        data: plant.logs.map(l => l.height),
        borderColor: '#4A6741',
        backgroundColor: 'rgba(74, 103, 65, 0.5)',
        tension: 0.3,
      },
      {
        label: '잎 개수',
        data: plant.logs.map(l => l.leafCount),
        borderColor: '#FF8C00',
        backgroundColor: 'rgba(255, 140, 0, 0.5)',
        tension: 0.3,
      }
    ],
  };

  const [growthForm, setGrowthForm] = useState({ date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
  const [careForm, setCareForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'watering' as any, amount: '', note: '' });
  const [envForm, setEnvForm] = useState<{
    date: string;
    temperature: number;
    humidity: number;
    lightExposure: number;
    soilCondition: 'dry' | 'moist' | 'wet';
    stressType?: 'high_temp' | 'low_temp' | 'drought' | 'overwater' | 'nutrient_deficiency';
  }>({ 
    date: new Date().toISOString().split('T')[0], 
    temperature: 24, 
    humidity: 50, 
    lightExposure: 6, 
    soilCondition: 'moist',
    stressType: undefined 
  });
  const [reminderForm, setReminderForm] = useState({ task: '', dueDate: new Date().toISOString().split('T')[0] });

  // Handlers
  const handleSaveGrowthLog = () => {
    if (editingLogId) {
      updateGrowthLog(plant.id, { ...growthForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addGrowthLog(plant.id, growthForm);
    }
    setGrowthForm({ date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
    setShowLogForm(false);
  };

  const handleSaveCareLog = () => {
    if (editingLogId) {
      updateCareLog(plant.id, { ...careForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addCareLog(plant.id, careForm);
    }
    setCareForm({ date: new Date().toISOString().split('T')[0], type: 'watering', amount: '', note: '' });
    setShowLogForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', background: 'none' }}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Plant Profile (Keep same) */}
        <div className="card" style={{ height: 'fit-content' }}>
          {/* ... */}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tabs (Keep same) */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['overview', 'growth', 'care', 'env', 'reminder'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  background: activeTab === tab ? 'var(--primary-green)' : 'white',
                  color: activeTab === tab ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {tab === 'overview' ? '개요' : tab === 'growth' ? '성장 기록' : tab === 'care' ? '관리 기록' : tab === 'env' ? '환경 데이터' : '알림 관리'}
              </button>
            ))}
          </div>

          <div className="card" style={{ minHeight: '400px' }}>
            {/* Overview ... */}
            
            {activeTab === 'growth' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 'bold' }}>성장 로그</h3>
                  <button onClick={() => { setShowLogForm(!showLogForm); setEditingLogId(null); }} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '기록 추가'}</button>
                </div>

                {showLogForm && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <input type="date" value={growthForm.date} onChange={e => setGrowthForm({...growthForm, date: e.target.value})} />
                      <input type="number" placeholder="높이 (cm)" value={growthForm.height || ''} onChange={e => setGrowthForm({...growthForm, height: Number(e.target.value)})} />
                      <input type="number" placeholder="잎 개수" value={growthForm.leafCount || ''} onChange={e => setGrowthForm({...growthForm, leafCount: Number(e.target.value)})} />
                    </div>
                    <textarea placeholder="특이사항 메모" value={growthForm.note} onChange={e => setGrowthForm({...growthForm, note: e.target.value})} style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}></textarea>
                    <button onClick={handleSaveGrowthLog} className="btn-primary" style={{ width: '100%' }}>{editingLogId ? '수정 저장' : '기록 저장'}</button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {plant.logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{new Date(log.date).toLocaleDateString()}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.note || '기록 없음'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => deleteGrowthLog(plant.id, log.id)} style={{ background: 'none', color: 'red' }}>삭제</button>
                        <button onClick={() => { setShowLogForm(true); setEditingLogId(log.id); setGrowthForm(log); }} style={{ background: 'none', color: 'blue' }}>수정</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Care logs ... (similar to growth logs) */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlantDetail;
