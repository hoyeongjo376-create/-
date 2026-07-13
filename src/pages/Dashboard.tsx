import React, { useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { Leaf, CheckCircle2, TrendingUp, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface DashboardProps {
  navigateTo: (plantId: string, subTab: 'overview' | 'growth' | 'care' | 'env' | 'reminder') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const { plants, addReminder, deleteReminder } = usePlants();
  const [newReminder, setNewReminder] = useState({ plantId: '', task: '', dueDate: new Date().toISOString().split('T')[0] });

  const stats = [
    { label: '등록된 식물', value: `${plants.length}개`, icon: Leaf, color: '#4A6741' },
    { label: '평균 건강 점수', value: `${plants.length > 0 ? Math.round(plants.reduce((acc, p) => acc + p.healthScore, 0) / plants.length) : 0}점`, icon: TrendingUp, color: '#6B8E23' },
    { label: '관리 필요한 식물', value: `${plants.filter(p => p.status !== 'healthy').length}개`, icon: AlertCircle, color: '#CD5C5C' },
    { label: '알림 건수', value: `${plants.reduce((acc, p) => acc + (p.reminders || []).length, 0)}건`, icon: CheckCircle2, color: '#FF8C00' },
  ];

  const recentLogs = plants.flatMap(p => p.logs.map(l => ({ ...l, plantName: p.name, plantId: p.id })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const allReminders = plants.flatMap(p => (p.reminders || []).map(r => ({ ...r, plantName: p.name, plantId: p.id })))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleAddReminder = () => {
    if (newReminder.plantId && newReminder.task) {
      addReminder(newReminder.plantId, { task: newReminder.task, dueDate: newReminder.dueDate });
      setNewReminder({ plantId: '', task: '', dueDate: new Date().toISOString().split('T')[0] });
    }
  };

  const [showReminderForm, setShowReminderForm] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>관리 알림</h3>
          <button onClick={() => setShowReminderForm(!showReminderForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> {showReminderForm ? '닫기' : '알림 등록'}
          </button>
        </div>

        {showReminderForm && (
          <div style={{ marginBottom: '20px', padding: '20px', background: '#F9FAF9', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '10px' }}>
            <select value={newReminder.plantId} onChange={e => setNewReminder({...newReminder, plantId: e.target.value})}>
              <option value="">식물 선택</option>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="text" placeholder="알림 내용" value={newReminder.task} onChange={e => setNewReminder({...newReminder, task: e.target.value})} />
            <input type="date" value={newReminder.dueDate} onChange={e => setNewReminder({...newReminder, dueDate: e.target.value})} />
            <button onClick={handleAddReminder} className="btn-primary">등록</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {allReminders.map(r => (
            <div key={r.id} onClick={() => navigateTo(r.plantId, 'reminder')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{r.task} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({r.plantName})</span></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.dueDate}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteReminder(r.plantId, r.id); }} style={{ background: 'none', color: 'red' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>최근 성장 기록</h3>
        {recentLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentLogs.map((log, i) => (
                <div key={i} onClick={() => navigateTo(log.plantId, 'growth')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: i < recentLogs.length - 1 ? '1px solid #eee' : 'none' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--primary-green)' }}>{log.plantName}</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{log.note || '성장 기록을 남겼습니다.'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{log.height} cm</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              기록된 성장 데이터가 없습니다.
            </div>
          )}
      </div>
    </div>
  );
};
export default Dashboard;
