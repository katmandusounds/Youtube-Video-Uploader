const SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;

  private constructor() {}

  static getInstance(): GoogleAuthService {
    if (!this.instance) {
      this.instance = new GoogleAuthService();
    }
    return this.instance;
  }

  async initialize() {
    try {
      console.log('Initializing Google Auth Service...');
      if (!this.tokenClient) {
        console.log('Creating token client with ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
          scope: SCOPES.join(' '),
          callback: () => {}, // We'll set this dynamically
        });
      }
      console.log('Token client initialized:', !!this.tokenClient);
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw error;
    }
  }

  async signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Starting sign in process...');
        if (!this.tokenClient) {
          console.error('Token client not initialized');
          reject(new Error('Token client not initialized'));
          return;
        }

        this.tokenClient.callback = (response) => {
          console.log('Got auth response:', response);
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          resolve(response.access_token);
        };

        console.log('Requesting access token...');
        this.tokenClient.requestAccessToken();
      } catch (error) {
        console.error('Sign in error:', error);
        reject(error);
      }
    });
  }
} 