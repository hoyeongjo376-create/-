import React, { useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { BarChart3, AlertTriangle, FileText, TrendingUp, Info } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analysis: React.FC = () => {
  const { plants } = usePlants();
  const [selectedPlantId, setSelectedPlantId] = useState<string>(plants[0]?.id || '');

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  // Analysis Logic for Fusion Project
  const getAnalysis = () => {
    if (!selectedPlant) return null;
    
    const logs = selectedPlant.logs;
    const careLogs = selectedPlant.careLogs;
    const envLogs = selectedPlant.envLogs;

    if (logs.length < 2) return "데이터가 부족합니다. 최소 2회 이상의 성장 기록이 필요합니다.";

    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latestLog = sortedLogs[sortedLogs.length - 1];
    const prevLog = sortedLogs[sortedLogs.length - 2];
    
    const growthRate = ((latestLog.height - prevLog.height) / prevLog.height) * 100;
    
    let report = "";
    if (growthRate > 5) {
      report = `현재 성장률은 ${growthRate.toFixed(1)}%로 매우 양호합니다. `;
    } else {
      report = `성장률이 ${growthRate.toFixed(1)}%로 다소 정체되었습니다. `;
    }

    if (envLogs.length > 0) {
      const latestEnv = envLogs[envLogs.length - 1];
      if (latestEnv.temperature > 28) report += "최근 고온 환경에 노출되어 식물이 스트레스를 받았을 가능성이 있습니다. 통풍에 신경 써주세요. ";
      if (latestEnv.humidity < 40) report += "습도가 낮아 잎 마름 현상이 발생할 수 있습니다. 분무기로 주변 습도를 높여주세요. ";
    }

    return report;
  };

  const stressTypes = [
    { key: 'high_temp', label: '고온 스트레스', symptoms: '잎 끝이 타거나 시들음, 호흡량 급증으로 인한 영양분 소모' },
    { key: 'low_temp', label: '저온 스트레스', symptoms: '세포막 손상, 광합성 효율 저하, 성장 정지' },
    { key: 'drought', label: '수분 부족', symptoms: '기공 폐쇄로 인한 CO2 흡수 저하, 잎의 팽압 상실' },
    { key: 'overwater', label: '과습 (뿌리 부패)', symptoms: '뿌리 산소 공급 부족, 잎의 황화 현상' },
    { key: 'nutrient_deficiency', label: '영양 부족', symptoms: '질소 부족 시 하위엽 황화, 인 부족 시 자색 변색' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>스마트 분석 대상 선택</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>분석할 식물을 선택하여 리포트를 생성합니다.</p>
        </div>
        <select 
          value={selectedPlantId} 
          onChange={(e) => setSelectedPlantId(e.target.value)}
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', minWidth: '200px' }}
        >
          <option value="">식물 선택...</option>
          {plants.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedPlant ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Analysis Result */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <TrendingUp size={22} color="var(--primary-green)" />
              생명과학 통합 분석
            </h3>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-green)' }}>
              <p style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                {getAnalysis()}
              </p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '15px', fontWeight: 'bold' }}>성장 리포트 요약</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>현재 건강 점수</span> <strong>{selectedPlant.healthScore}점</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>총 기록 횟수</span> <strong>{selectedPlant.logs.length + selectedPlant.careLogs.length}회</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>주요 관리 항목</span> <strong>{selectedPlant.careLogs[selectedPlant.careLogs.length-1]?.type || '기록 없음'}</strong>
                </li>
              </ul>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FileText size={18} /> PDF 리포트 다운로드 (준비중)
            </button>
          </div>

          {/* Stress Reference */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <AlertTriangle size={22} color="var(--accent-orange)" />
              환경 스트레스 도감
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {stressTypes.map((s) => (
                <div key={s.key} style={{ padding: '15px', background: '#FFF9F2', borderRadius: 'var(--radius-sm)', border: '1px solid #FFE4C4' }}>
                  <p style={{ fontWeight: 'bold', color: '#D2691E', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Info size={14} /> {s.label}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#8B4513' }}>{s.symptoms}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          <BarChart3 size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
          <h3>분석할 식물을 선택해주세요.</h3>
        </div>
      )}
    </div>
  );
};

export default Analysis;
