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
  const { 
    addGrowthLog, deleteGrowthLog, updateGrowthLog, 
    addCareLog, deleteCareLog, updateCareLog, 
    addEnvLog, deleteEnvLog, updateEnvLog, 
    addReminder, deleteReminder, updateReminder 
  } = usePlants();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'care' | 'env' | 'reminder'>(initialTab || 'overview');
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const [growthForm, setGrowthForm] = useState({ id: '', date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
  const [careForm, setCareForm] = useState({ id: '', date: new Date().toISOString().split('T')[0], type: 'watering' as any, amount: '', note: '' });
  const [envForm, setEnvForm] = useState({ id: '', date: new Date().toISOString().split('T')[0], temperature: 24, humidity: 50, lightExposure: 6, soilCondition: 'moist' as any, stressType: undefined as any });
  const [reminderForm, setReminderForm] = useState({ id: '', task: '', dueDate: new Date().toISOString().split('T')[0] });

  const handleSaveGrowthLog = () => {
    if (editingLogId) {
      updateGrowthLog(plant.id, { ...growthForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addGrowthLog(plant.id, { date: growthForm.date, height: growthForm.height, leafCount: growthForm.leafCount, note: growthForm.note });
    }
    setGrowthForm({ id: '', date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
    setShowLogForm(false);
  };

  const handleSaveCareLog = () => {
    if (editingLogId) {
      updateCareLog(plant.id, { ...careForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addCareLog(plant.id, { date: careForm.date, type: careForm.type, amount: careForm.amount, note: careForm.note });
    }
    setCareForm({ id: '', date: new Date().toISOString().split('T')[0], type: 'watering', amount: '', note: '' });
    setShowLogForm(false);
  };
  
  const handleSaveEnvLog = () => {
    if (editingLogId) {
      updateEnvLog(plant.id, { ...envForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addEnvLog(plant.id, { date: envForm.date, temperature: envForm.temperature, humidity: envForm.humidity, lightExposure: envForm.lightExposure, soilCondition: envForm.soilCondition, stressType: envForm.stressType });
    }
    setEnvForm({ id: '', date: new Date().toISOString().split('T')[0], temperature: 24, humidity: 50, lightExposure: 6, soilCondition: 'moist', stressType: undefined });
    setShowLogForm(false);
  };

  const handleSaveReminder = () => {
    if (editingLogId) {
      updateReminder(plant.id, { ...reminderForm, id: editingLogId });
      setEditingLogId(null);
    } else {
      addReminder(plant.id, { task: reminderForm.task, dueDate: reminderForm.dueDate });
    }
    setReminderForm({ id: '', task: '', dueDate: new Date().toISOString().split('T')[0] });
    setShowLogForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', background: 'none' }}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '5px' }}>{plant.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{plant.type}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>성장 그래프</h3>
                {plant.logs.length > 0 ? (
                  <Line data={{
                    labels: plant.logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(l => l.date),
                    datasets: [
                      { label: '높이 (cm)', data: plant.logs.map(l => l.height), borderColor: '#4A6741', tension: 0.3 },
                    ],
                  }} />
                ) : (
                  <p>데이터가 없습니다.</p>
                )}
              </div>
            )}

            {activeTab === 'growth' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 'bold' }}>성장 로그</h3>
                  <button onClick={() => { setShowLogForm(!showLogForm); setEditingLogId(null); }} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '기록 추가'}</button>
                </div>
                {showLogForm && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)' }}>
                    <input type="date" value={growthForm.date} onChange={e => setGrowthForm({...growthForm, date: e.target.value})} />
                    <input type="number" placeholder="높이" value={growthForm.height || ''} onChange={e => setGrowthForm({...growthForm, height: Number(e.target.value)})} />
                    <input type="number" placeholder="잎" value={growthForm.leafCount || ''} onChange={e => setGrowthForm({...growthForm, leafCount: Number(e.target.value)})} />
                    <textarea placeholder="메모" value={growthForm.note} onChange={e => setGrowthForm({...growthForm, note: e.target.value})} />
                    <button onClick={handleSaveGrowthLog} className="btn-primary">{editingLogId ? '수정' : '저장'}</button>
                  </div>
                )}
                {plant.logs.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
                    {log.date} - {log.height}cm
                    <button onClick={() => deleteGrowthLog(plant.id, log.id)}>삭제</button>
                    <button onClick={() => { setShowLogForm(true); setEditingLogId(log.id); setGrowthForm({...log}); }}>수정</button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Care and Env and Reminder tab structures ... */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlantDetail;
