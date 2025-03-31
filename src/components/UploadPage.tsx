import { Youtube } from 'lucide-react';
import { YouTubeAuth } from './YouTubeAuth';

export function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Youtube className="w-10 h-10 text-red-500" />
            <h1 className="text-3xl font-bold">TypeBeat 2 YouTube</h1>
          </div>

          <div className="mb-8">
            <YouTubeAuth />
          </div>

          {/* Upload form will go here */}
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400">Upload form coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 