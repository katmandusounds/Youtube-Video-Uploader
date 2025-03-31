import { LogIn, Youtube } from 'lucide-react';
import { useYouTubeStore } from '../store/youtube';

export function LoginPage() {
  const { signIn, auth } = useYouTubeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <Youtube className="w-16 h-16 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold mb-2">TypeBeat 2 YouTube</h1>
              <p className="text-gray-400">Sign in with your Google account to start uploading videos!!!</p>
            </div>
            <button
              onClick={() => signIn()}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google
            </button>
            {auth.error && (
              <p className="text-red-500 text-sm">{auth.error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 