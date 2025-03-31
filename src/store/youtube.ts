import { create } from 'zustand';
import type { YouTubeStore, YouTubeAuthState } from '../types';

declare global {
  interface Window {
    gapi: any;
  }
}

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'email',
  'profile'
];

const CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const AUTH_INSTANCE_RETRY_DELAY = 200;
const AUTH_INSTANCE_MAX_RETRIES = 3;

const initialState: YouTubeAuthState = {
  isAuthenticated: false,
  channelName: null,
  channelThumbnail: null,
  email: null,
  error: null
};

const loadGapiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.body.appendChild(script);
  });
};

const waitForGapi = async (retries = MAX_RETRIES): Promise<void> => {
  if (window.gapi) return;
  
  if (retries <= 0) {
    throw new Error('Failed to load Google API after multiple attempts');
  }

  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  await waitForGapi(retries - 1);
};

const getAuthInstance = async (retries = AUTH_INSTANCE_MAX_RETRIES): Promise<any> => {
  const authInstance = window.gapi.auth2.getAuthInstance();
  if (authInstance) return authInstance;

  if (retries <= 0) {
    throw new Error('Failed to get auth instance after multiple attempts');
  }

  await new Promise(resolve => setTimeout(resolve, AUTH_INSTANCE_RETRY_DELAY));
  return getAuthInstance(retries - 1);
};

const initializeGapiClient = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('Google API not loaded'));
      return;
    }

    window.gapi.load('client:auth2', {
      callback: async () => {
        try {
          await window.gapi.client.init({
            clientId: CLIENT_ID,
            scope: SCOPES.join(' '),
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
              'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
            ]
          });

          // Wait for auth instance with retries
          const authInstance = await getAuthInstance();
          if (!authInstance) {
            reject(new Error('Failed to get auth instance after initialization'));
            return;
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      },
      onerror: () => {
        reject(new Error('Failed to load GAPI client'));
      }
    });
  });
};

export const useYouTubeStore = create<YouTubeStore>((set, get) => ({
  auth: initialState,

  initializeAuth: async () => {
    try {
      await loadGapiScript();
      await waitForGapi();
      await initializeGapiClient();

      const authInstance = await getAuthInstance();
      if (!authInstance) {
        throw new Error('Auth instance not available after initialization');
      }

      // Set up auth state listener
      authInstance.isSignedIn.listen((isSignedIn: boolean) => {
        if (isSignedIn) {
          get().updateUserInfo();
        } else {
          set({ auth: initialState });
        }
      });

      // Check if already signed in
      if (authInstance.isSignedIn.get()) {
        await get().updateUserInfo();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        auth: { 
          ...initialState, 
          error: error instanceof Error ? error.message : 'Failed to initialize YouTube authentication' 
        } 
      });
    }
  },

  signIn: async () => {
    try {
      const authInstance = await getAuthInstance();
      if (!authInstance) {
        throw new Error('Auth instance not initialized');
      }

      // Sign in with Google and request additional scopes
      const googleUser = await authInstance.signIn({
        prompt: 'select_account',
        ux_mode: 'popup'
      });

      // Get user's email
      const profile = googleUser.getBasicProfile();
      const email = profile.getEmail();

      // Update state with email before checking YouTube
      set(state => ({
        auth: {
          ...state.auth,
          email,
          isAuthenticated: true
        }
      }));

      // Now check for YouTube access
      await get().updateUserInfo();
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        auth: { 
          ...get().auth, 
          error: error instanceof Error ? error.message : 'Failed to sign in' 
        } 
      });
    }
  },

  signOut: async () => {
    try {
      const authInstance = await getAuthInstance();
      if (!authInstance) {
        throw new Error('Auth instance not initialized');
      }
      await authInstance.signOut();
      set({ auth: initialState });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        auth: { 
          ...get().auth, 
          error: error instanceof Error ? error.message : 'Failed to sign out' 
        } 
      });
    }
  },

  updateUserInfo: async () => {
    try {
      const response = await window.gapi.client.youtube.channels.list({
        part: ['snippet'],
        mine: true
      });

      const channel = response.result.items?.[0];
      if (channel) {
        set(state => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            channelName: channel.snippet?.title || null,
            channelThumbnail: channel.snippet?.thumbnails?.default?.url || null,
            error: null
          }
        }));
      } else {
        set(state => ({
          auth: {
            ...state.auth,
            error: 'No YouTube channel found for this Google account'
          }
        }));
      }
    } catch (error) {
      console.error('Update user info error:', error);
      set({ 
        auth: { 
          ...get().auth, 
          error: error instanceof Error ? error.message : 'Failed to fetch channel information' 
        } 
      });
    }
  }
}));