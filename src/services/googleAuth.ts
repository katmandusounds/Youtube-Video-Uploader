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
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('Google Client ID not configured. Please check your .env file.');
    }

    const redirectUri = window.location.origin;
    
    console.log('Starting OAuth flow with:', {
      clientId: clientId.substring(0, 10) + '...',
      redirectUri,
      scopes: SCOPES
    });
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('scope', SCOPES.join(' '));
    authUrl.searchParams.append('include_granted_scopes', 'true');
    authUrl.searchParams.append('prompt', 'consent');

    console.log('Redirecting to:', authUrl.toString());
    window.location.href = authUrl.toString();
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