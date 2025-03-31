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

  // Add bypass button for testing
  if (!auth.isAuthenticated && !bypassAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <LoginPage />
        <button
          onClick={() => setBypassAuth(true)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Test Video Creation (Bypass Auth)
        </button>
      </div>
    );
  }

  return bypassAuth ? <BypassUploadPage /> : <UploadPage />;
} 