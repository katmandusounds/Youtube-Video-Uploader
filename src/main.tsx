import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleAuthService } from './services/googleAuth';

// Add a console log to verify the version that's running
console.log('App Version:', import.meta.env.VITE_APP_VERSION || '1.0.0');

// Verify Google Client ID is available
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error('Google Client ID not found in environment variables');
} else {
  console.log('Google Client ID configured:', import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 10) + '...');
}

// Initialize Google Auth
GoogleAuthService.getInstance().initialize().then(() => {
  console.log('Google Auth initialized');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize Google Auth:', error);
});
