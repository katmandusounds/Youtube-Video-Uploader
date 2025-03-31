import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a console log to verify the version that's running
console.log('App Version:', import.meta.env.VITE_APP_VERSION || '1.0.0');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
