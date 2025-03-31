const SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  
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
      await this.loadGapiScript();
      await this.initGapiClient();
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw error;
    }
  }

  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GAPI script'));
      document.body.appendChild(script);
    });
  }

  private async initGapiClient(): Promise<void> {
    if (!window.gapi) throw new Error('GAPI not loaded');

    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: SCOPES.join(' ')
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async signIn(): Promise<string> {
    try {
      console.log('Starting sign in process...');
      const googleAuth = window.gapi.auth2.getAuthInstance();
      const user = await googleAuth.signIn();
      const authResponse = user.getAuthResponse();
      return authResponse.access_token;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }
} 