import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlantList from './pages/PlantList';
import AddPlant from './pages/AddPlant';
import Analysis from './pages/Analysis';

function App() {
  const [nav, setNav] = useState<{tab: string, plantId?: string, subTab?: 'overview' | 'growth' | 'care' | 'env' | 'reminder'}>({ tab: 'dashboard' });

  const renderPage = () => {
    switch (nav.tab) {
      case 'dashboard':
        return <Dashboard navigateTo={(plantId, subTab) => setNav({ tab: 'plants', plantId, subTab })} />;
      case 'plants':
        return <PlantList onAddClick={() => setNav({ tab: 'add' })} initialPlantId={nav.plantId} initialTab={nav.subTab} />;
      case 'add':
        return <AddPlant onSuccess={() => setNav({ tab: 'plants' })} />;
      case 'analysis':
        return <Analysis />;
      default:
        return <Dashboard navigateTo={(plantId, subTab) => setNav({ tab: 'plants', plantId, subTab })} />;
    }
  };

  return (
    <Layout activeTab={nav.tab} setActiveTab={(tab) => setNav({ tab })}>
      {renderPage()}
    </Layout>
  );
}

export default App;
