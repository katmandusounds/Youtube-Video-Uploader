import React from 'react';
import { useYouTubeStore } from './store/youtube';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';

export default function App() {
  const { auth } = useYouTubeStore();

  React.useEffect(() => {
    useYouTubeStore.getState().initializeAuth();
  }, []);

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return <UploadPage />;
} 