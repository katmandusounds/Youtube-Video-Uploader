import { create } from 'zustand';
import type { YouTubeStore } from '../types';
import { GoogleAuthService } from '../services/googleAuth';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const initialState = {
  isAuthenticated: false,
  channelName: null,
  channelThumbnail: null,
  email: null,
  error: null
};

export const useYouTubeStore = create<YouTubeStore>((set) => ({
  auth: initialState,

  initializeAuth: async () => {
    try {
      await GoogleAuthService.getInstance().initialize();
      
      const token = localStorage.getItem('youtube_access_token');
      if (!token) return;

      // Validate token and get user info
      const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to validate token');
      }

      const data = await response.json();
      const channel = data.items[0];

      set({
        auth: {
          isAuthenticated: true,
          channelName: channel.snippet.title,
          channelThumbnail: channel.snippet.thumbnails.default.url,
          email: null, // We'll get this from Google OAuth
          error: null,
        }
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('youtube_access_token');
      set({
        auth: {
          isAuthenticated: false,
          channelName: null,
          channelThumbnail: null,
          email: null,
          error: 'Authentication failed',
        }
      });
    }
  },

  signIn: async () => {
    try {
      console.log('Debug - Starting sign in process');
      const authService = GoogleAuthService.getInstance();
      await authService.signIn();
    } catch (error) {
      console.error('Debug - Sign in failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      set(state => ({
        auth: {
          ...state.auth,
          error: error instanceof Error ? error.message : 'Sign in failed',
        }
      }));
    }
  },

  signOut: async () => {
    localStorage.removeItem('youtube_access_token');
    set({ auth: initialState });
  },

  updateUserInfo: async () => {
    // TODO: Implement updating user info from YouTube API
  }
}));