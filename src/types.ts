export interface UploadFormData {
  title: string;
  description: string;
  tags: string[];
  visibility: 'private' | 'unlisted' | 'public';
  image: File | null;
  audio: File | null;
}

export interface ProgressState {
  processing: boolean;
  uploading: boolean;
  progress: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  channelName: string | null;
  channelThumbnail: string | null;
  error: string | null;
}

export interface YouTubeAuthState {
  isAuthenticated: boolean;
  channelName: string | null;
  channelThumbnail: string | null;
  email: string | null;
  error: string | null;
}

export interface YouTubeStore {
  auth: YouTubeAuthState;
  initializeAuth: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserInfo: () => Promise<void>;
}