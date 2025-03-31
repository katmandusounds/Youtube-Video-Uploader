import React from 'react';
import { useYouTubeStore } from './store/youtube';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { BypassUploadPage } from './components/BypassUploadPage';

export default function App() {
  const { auth } = useYouTubeStore();
  const [bypassAuth, setBypassAuth] = React.useState(false);

  React.useEffect(() => {
    useYouTubeStore.getState().initializeAuth();
  }, []);

  if (!auth.isAuthenticated && !bypassAuth) {
    return <LoginPage onBypass={() => setBypassAuth(true)} />;
  }

  return bypassAuth ? <BypassUploadPage /> : <UploadPage />;
} 