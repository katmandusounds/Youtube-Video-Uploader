declare namespace google.accounts.oauth2 {
  interface TokenClient {
    requestAccessToken(): void;
    callback: (response: { error?: string; access_token?: string }) => void;
  }

  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: { error?: string; access_token?: string }) => void;
  }): TokenClient;
} 