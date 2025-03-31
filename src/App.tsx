import React from 'react';
import { DebugEnv } from './components/DebugEnv';
import { useYouTubeStore } from './store/youtube';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';

export default function App() {
  const { auth } = useYouTubeStore();

  // Show login page if not authenticated
  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  // Show upload page if authenticated
  return (
    <>
      <UploadPage />
      <DebugEnv />
    </>
  );
}

/// notes 