import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { PlantProvider } from './context/PlantContext.tsx'
import './styles/theme.css'

console.log('main.tsx executing');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlantProvider>
      <App />
    </PlantProvider>
  </React.StrictMode>,
)
