export function DebugEnv() {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg text-xs">
      <pre className="text-gray-400">
        {JSON.stringify(
          {
            VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
            origin: window.location.origin,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
} 