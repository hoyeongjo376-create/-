import React, { useState } from 'react';
import type { Plant } from '../types';
import { usePlants } from '../context/PlantContext';
import { ArrowLeft } from 'lucide-react';
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
  const { updateGrowthLog, deleteGrowthLog, updateCareLog, deleteCareLog, addGrowthLog, addCareLog } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'care' | 'env' | 'reminder'>(initialTab || 'overview');
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const [growthForm, setGrowthForm] = useState({ id: '', date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
  const [careForm, setCareForm] = useState({ id: '', date: new Date().toISOString().split('T')[0], type: 'watering' as any, amount: '', note: '' });

  const handleSaveGrowthLog = () => {
    if (editingLogId) {
      updateGrowthLog(plant.id, growthForm);
      setEditingLogId(null);
    } else {
      addGrowthLog(plant.id, { date: growthForm.date, height: growthForm.height, leafCount: growthForm.leafCount, note: growthForm.note });
    }
    setGrowthForm({ id: '', date: new Date().toISOString().split('T')[0], height: 0, leafCount: 0, note: '' });
    setShowLogForm(false);
  };

  const handleSaveCareLog = () => {
    if (editingLogId) {
      updateCareLog(plant.id, careForm);
      setEditingLogId(null);
    } else {
      addCareLog(plant.id, { date: careForm.date, type: careForm.type, amount: careForm.amount, note: careForm.note });
    }
    setCareForm({ id: '', date: new Date().toISOString().split('T')[0], type: 'watering', amount: '', note: '' });
    setShowLogForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', background: 'none' }}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </button>

      <div className="card" style={{ minHeight: '400px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {['overview', 'growth', 'care'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{ padding: '10px 20px', borderRadius: '30px', background: activeTab === tab ? 'var(--primary-green)' : 'white', color: activeTab === tab ? 'white' : 'var(--text-main)' }}
            >
              {tab === 'overview' ? '개요' : tab === 'growth' ? '성장 기록' : '관리 기록'}
            </button>
          ))}
        </div>

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
                    <button onClick={() => { setShowLogForm(true); setEditingLogId(log.id); setGrowthForm({...log}); }} style={{ background: 'none', color: 'blue' }}>수정</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 'bold' }}>관리 내역</h3>
              <button onClick={() => { setShowLogForm(!showLogForm); setEditingLogId(null); }} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '관리 추가'}</button>
            </div>

            {showLogForm && (
              <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="date" value={careForm.date} onChange={e => setCareForm({...careForm, date: e.target.value})} />
                  <select value={careForm.type} onChange={e => setCareForm({...careForm, type: e.target.value as any})}>
                    <option value="watering">물 주기</option>
                    <option value="fertilizer">비료 주기</option>
                    <option value="repotting">분갈이</option>
                  </select>
                  <input type="text" placeholder="양" value={careForm.amount} onChange={e => setCareForm({...careForm, amount: e.target.value})} />
                </div>
                <textarea placeholder="메모" value={careForm.note} onChange={e => setCareForm({...careForm, note: e.target.value})} style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}></textarea>
                <button onClick={handleSaveCareLog} className="btn-primary" style={{ width: '100%' }}>{editingLogId ? '수정 저장' : '관리 저장'}</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {plant.careLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{log.type}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.amount} | {log.note}</p>
                  </div>
                  <button onClick={() => deleteCareLog(plant.id, log.id)} style={{ background: 'none', color: 'red' }}>삭제</button>
                  <button onClick={() => { setShowLogForm(true); setEditingLogId(log.id); setCareForm(log); }} style={{ background: 'none', color: 'blue' }}>수정</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail;
