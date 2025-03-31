import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a console log to verify the version that's running
console.log('App Version:', import.meta.env.VITE_APP_VERSION || '1.0.0');

// Verify Google Client ID is available
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error('Google Client ID not found in environment variables');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
