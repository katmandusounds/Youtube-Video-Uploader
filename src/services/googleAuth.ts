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
    if (!this.tokenClient) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        scope: SCOPES.join(' '),
        callback: () => {}, // We'll set this dynamically
      });
    }
  }

  async signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Token client not initialized'));
        return;
      }

      this.tokenClient.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        resolve(response.access_token);
      };

      this.tokenClient.requestAccessToken();
    });
  }
} 