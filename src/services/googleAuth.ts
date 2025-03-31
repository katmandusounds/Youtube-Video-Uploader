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

  async signIn(): Promise<void> {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = `${import.meta.env.VITE_API_URL}/auth/google/callback`; // Railway URL
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        access_type: 'offline',
        scope: SCOPES.join(' '),
        include_granted_scopes: 'false',
        prompt: 'consent'
      };

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Debug - Sign in error:', error);
      throw error;
    }
  }

  async handleRedirect(): Promise<string | null> {
    // Handle the OAuth redirect with token in URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      localStorage.setItem('youtube_access_token', accessToken);
      return accessToken;
    }
    
    return null;
  }

  async initialize(): Promise<void> {
    // Check for OAuth redirect response
    const token = await this.handleRedirect();
    if (token) {
      // Clear the URL fragment
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
} 