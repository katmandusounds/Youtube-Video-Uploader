import { create } from 'zustand';
import type { YouTubeStore } from '../types';
import { GoogleAuthService } from '../services/googleAuth';

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
          email: null,
          error: null,
        }
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('youtube_access_token');
      set({
        auth: {
          ...initialState,
          error: 'Authentication failed'
        }
      });
    }
  },

  signIn: async () => {
    try {
      await GoogleAuthService.getInstance().signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      set(state => ({
        auth: {
          ...state.auth,
          error: error instanceof Error ? error.message : 'Sign in failed'
        }
      }));
    }
  },

  signOut: async () => {
    localStorage.removeItem('youtube_access_token');
    set({ auth: initialState });
  }
})); 