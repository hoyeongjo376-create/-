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
  const { addGrowthLog, deleteGrowthLog, addCareLog, deleteCareLog, addEnvLog, deleteEnvLog, addReminder, deleteReminder } = usePlants();
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'care' | 'env' | 'reminder'>(initialTab || 'overview');
  const [showLogForm, setShowLogForm] = useState(false);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', background: 'none' }}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', background: plant.photoUrl ? `url(${plant.photoUrl}) center/cover` : 'var(--sage-green)', marginBottom: '20px' }}></div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '5px' }}>{plant.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{plant.type}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>건강 점수</span>
              <span style={{ fontWeight: 'bold', color: plant.healthScore > 70 ? 'var(--primary-green)' : 'var(--danger-red)' }}>{plant.healthScore} / 100</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${plant.healthScore}%`, height: '100%', background: plant.healthScore > 70 ? 'var(--primary-green)' : 'var(--danger-red)' }}></div>
            </div>
            
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <Activity size={16} color="var(--primary-green)" />
                상태: <strong>{plant.status.toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <ClipboardList size={16} color="var(--primary-green)" />
                마지막 관리: <strong>{plant.careLogs.length > 0 ? plant.careLogs[plant.careLogs.length-1].date : '없음'}</strong>
              </div>
            </div>
          </div>
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
                  <Line data={growthData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>그래프를 표시할 데이터가 부족합니다. 성장 기록을 추가해주세요.</div>
                )}
              </div>
            )}

            {activeTab === 'growth' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 'bold' }}>성장 로그</h3>
                  <button onClick={() => setShowLogForm(!showLogForm)} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '기록 추가'}</button>
                </div>

                {showLogForm && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <input type="date" value={growthForm.date} onChange={e => setGrowthForm({...growthForm, date: e.target.value})} />
                      <input type="number" placeholder="높이 (cm)" value={growthForm.height || ''} onChange={e => setGrowthForm({...growthForm, height: Number(e.target.value)})} />
                      <input type="number" placeholder="잎 개수" value={growthForm.leafCount || ''} onChange={e => setGrowthForm({...growthForm, leafCount: Number(e.target.value)})} />
                    </div>
                    <textarea placeholder="특이사항 메모" value={growthForm.note} onChange={e => setGrowthForm({...growthForm, note: e.target.value})} style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}></textarea>
                    <button onClick={() => { addGrowthLog(plant.id, growthForm); setShowLogForm(false); }} className="btn-primary" style={{ width: '100%' }}>기록 저장</button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {plant.logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{new Date(log.date).toLocaleDateString()}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.note || '기록 없음'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>높이</p><p style={{ fontWeight: 'bold' }}>{log.height}cm</p></div>
                        <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>잎</p><p style={{ fontWeight: 'bold' }}>{log.leafCount}개</p></div>
                        <button onClick={() => deleteGrowthLog(plant.id, log.id)} style={{ background: 'none', color: 'red' }}>삭제</button>
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
                  <button onClick={() => setShowLogForm(!showLogForm)} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '관리 추가'}</button>
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
                      <input type="text" placeholder="양 (예: 500ml)" value={careForm.amount} onChange={e => setCareForm({...careForm, amount: e.target.value})} />
                    </div>
                    <textarea placeholder="메모" value={careForm.note} onChange={e => setCareForm({...careForm, note: e.target.value})} style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}></textarea>
                    <button onClick={() => { addCareLog(plant.id, careForm); setShowLogForm(false); }} className="btn-primary" style={{ width: '100%' }}>관리 저장</button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {plant.careLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: 'var(--primary-green)' }}>
                        {log.type === 'watering' ? <Droplets size={20} /> : log.type === 'fertilizer' ? <FileText size={20} /> : <ClipboardList size={20} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{log.type === 'watering' ? '물 주기' : log.type === 'fertilizer' ? '비료 주기' : '기타 관리'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.amount} {log.note && `| ${log.note}`}</p>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(log.date).toLocaleDateString()}</p>
                      <button onClick={() => deleteCareLog(plant.id, log.id)} style={{ background: 'none', color: 'red' }}>삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'env' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 'bold' }}>환경 기록</h3>
                  <button onClick={() => setShowLogForm(!showLogForm)} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>{showLogForm ? '취소' : '환경 추가'}</button>
                </div>

                {showLogForm && (
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)' }}>
                    {/* ... form content ... */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <input type="date" value={envForm.date} onChange={e => setEnvForm({...envForm, date: e.target.value})} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Thermometer size={16} /> <input type="number" placeholder="온도" style={{ width: '100%' }} value={envForm.temperature} onChange={e => setEnvForm({...envForm, temperature: Number(e.target.value)})} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Droplets size={16} /> <input type="number" placeholder="습도" style={{ width: '100%' }} value={envForm.humidity} onChange={e => setEnvForm({...envForm, humidity: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Sun size={16} /> <input type="number" placeholder="빛 노출(시간)" style={{ width: '100%' }} value={envForm.lightExposure} onChange={e => setEnvForm({...envForm, lightExposure: Number(e.target.value)})} />
                      </div>
                      <select value={envForm.soilCondition} onChange={e => setEnvForm({...envForm, soilCondition: e.target.value as any})}>
                        <option value="dry">건조함</option>
                        <option value="moist">적당함</option>
                        <option value="wet">축축함</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <select value={envForm.stressType || ''} onChange={e => setEnvForm({...envForm, stressType: e.target.value as any || undefined})}>
                        <option value="">스트레스 요인 선택 (선택사항)</option>
                        <option value="high_temp">고온 스트레스</option>
                        <option value="low_temp">저온 스트레스</option>
                        <option value="drought">수분 부족</option>
                        <option value="overwater">과습</option>
                        <option value="nutrient_deficiency">영양 부족</option>
                      </select>
                    </div>
                    <button onClick={() => { addEnvLog(plant.id, envForm); setShowLogForm(false); }} className="btn-primary" style={{ width: '100%' }}>환경 저장</button>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                  {plant.envLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                    <div key={log.id} style={{ padding: '15px', background: '#F9FAF9', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }}>{new Date(log.date).toLocaleDateString()}</p>
                      <button onClick={() => deleteEnvLog(plant.id, log.id)} style={{ background: 'none', color: 'red', fontSize: '0.7rem' }}>삭제</button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>온도</span> <strong>{log.temperature}°C</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>습도</span> <strong>{log.humidity}%</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <input type="text" placeholder="알림 내용" value={reminderForm.task} onChange={e => setReminderForm({...reminderForm, task: e.target.value})} style={{ marginRight: '10px' }} />
                  <input type="date" value={reminderForm.dueDate} onChange={e => setReminderForm({...reminderForm, dueDate: e.target.value})} style={{ marginRight: '10px' }} />
                  <button onClick={() => addReminder(plant.id, reminderForm)} className="btn-primary">알림 추가</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plant.reminders.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#F9FAF9' }}>
                      <span>{r.task} ({r.dueDate})</span>
                      <button onClick={() => deleteReminder(plant.id, r.id)} style={{ color: 'red' }}>삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
