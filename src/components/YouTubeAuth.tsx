import React from 'react';
import { Youtube, LogOut } from 'lucide-react';
import { useYouTubeStore } from '../store/youtube';

export function YouTubeAuth() {
  const { auth, signIn, signOut } = useYouTubeStore();

  if (auth.error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
        <p>Authentication Error: {auth.error}</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div>
        <h2>Sign in with your Google account to start uploading videos!!</h2>
        <button
          onClick={() => signIn()}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Youtube className="w-5 h-5" />
          Connect YouTube Account
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-4">
      <img
        src={auth.channelThumbnail || ''}
        alt={auth.channelName || ''}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <p className="font-medium">{auth.channelName}</p>
        <p className="text-sm text-gray-400">Connected to YouTube</p>
      </div>
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Disconnect
      </button>
    </div>
  );
}