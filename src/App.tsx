import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlantList from './pages/PlantList';
import AddPlant from './pages/AddPlant';
import Analysis from './pages/Analysis';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'plants':
        return <PlantList onAddClick={() => setActiveTab('add')} />;
      case 'add':
        return <AddPlant onSuccess={() => setActiveTab('plants')} />;
      case 'analysis':
        return <Analysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

export default App;
