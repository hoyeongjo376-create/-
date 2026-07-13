import React from 'react';
import { usePlants } from '../context/PlantContext';
import { Leaf, Calendar, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { plants } = usePlants();

  const stats = [
    { label: '등록된 식물', value: `${plants.length}개`, icon: Leaf, color: '#4A6741' },
    { label: '평균 건강 점수', value: `${plants.length > 0 ? Math.round(plants.reduce((acc, p) => acc + p.healthScore, 0) / plants.length) : 0}점`, icon: TrendingUp, color: '#6B8E23' },
    { label: '관리 필요한 식물', value: `${plants.filter(p => p.status !== 'healthy').length}개`, icon: AlertCircle, color: '#CD5C5C' },
    { label: '오늘의 할 일', value: '3건', icon: CheckCircle2, color: '#FF8C00' },
  ];

  const recentLogs = plants.flatMap(p => p.logs.map(l => ({ ...l, plantName: p.name })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              background: `${stat.color}15`, 
              color: stat.color, 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex'
            }}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Recent Growth Logs */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>최근 성장 기록</h3>
            <button style={{ color: 'var(--primary-green)', fontSize: '0.9rem', fontWeight: '600' }}>모두 보기</button>
          </div>
          
          {recentLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: i < recentLogs.length - 1 ? '1px solid #eee' : 'none' }}>
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

        {/* Reminders / To-Do */}
        <div className="card">
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>관리 알림</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: '#4A6741' }}><Calendar size={20} /></div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>몬스테라 물 주기</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>오늘 오후 2시 예정</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: '#4A6741' }}><Calendar size={20} /></div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>고무나무 비료 주기</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>내일 예정</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
