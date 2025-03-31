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

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (args: {
          clientId: string;
          scope: string;
        }) => Promise<void>;
      };
      auth2: {
        getAuthInstance: () => {
          signIn: () => Promise<{
            getAuthResponse: () => {
              access_token: string;
            };
          }>;
        };
      };
    };
  }
}

export {}; 