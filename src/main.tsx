import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a console log to verify the version that's running
console.log('App Version:', import.meta.env.VITE_APP_VERSION || '1.0.0');

// Verify Google Client ID is available
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error('Google Client ID not found in environment variables');
} else {
  console.log('Google Client ID configured:', import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 10) + '...');
}

// Wait for Google client to be available
const waitForGoogleClient = async (maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    if (window.google?.accounts?.oauth2) {
      console.log('Google client ready');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Waiting for Google client...');
  }
  console.error('Google client not available after maximum attempts');
};

waitForGoogleClient().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
