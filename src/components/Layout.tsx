import React from 'react';
import { Leaf, LayoutDashboard, PlusCircle, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'plants', label: '식물 목록', icon: Leaf },
    { id: 'add', label: '식물 등록', icon: PlusCircle },
    { id: 'analysis', label: '데이터 분석', icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--primary-green)',
        color: 'white',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <Leaf size={32} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Plant Manager</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                textAlign: 'left',
                width: '100%',
                fontSize: '1rem',
                transition: 'var(--transition)'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 15px',
            color: 'rgba(255,255,255,0.7)',
            background: 'transparent',
            width: '100%'
          }}>
            <Settings size={20} />
            설정
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-green-dark)' }}>
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <div style={{ background: 'white', padding: '8px 15px', borderRadius: '30px', boxShadow: 'var(--shadow-sm)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
};

export default Layout;
