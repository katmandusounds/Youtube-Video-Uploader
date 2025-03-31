import React from 'react';
import { useYouTubeStore } from '../store/youtube';

interface LoginPageProps {
  onBypass: () => void;
}

export function LoginPage({ onBypass }: LoginPageProps) {
  const { signIn } = useYouTubeStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">TypeBeat 2 YouTube</h1>
      <p className="text-gray-400 mb-8">Sign in with your Google account to start uploading videos!!!</p>
      
      <div className="space-y-4">
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <button
          onClick={onBypass}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Bypass
        </button>
      </div>
    </div>
  );
} 