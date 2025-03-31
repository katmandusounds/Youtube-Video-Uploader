import React, { useEffect, useState } from 'react';
import { Upload, Youtube, LogIn } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import type { UploadFormData, ProgressState } from './types';
import { useYouTubeStore } from './store/youtube';
import { YouTubeAuth } from './components/YouTubeAuth';

function LoginPage() {
  const { signIn, auth } = useYouTubeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <Youtube className="w-16 h-16 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold mb-2">YouTube Video Uploader</h1>
              <p className="text-gray-400">Sign in with your Google account to start uploading videos</p>
            </div>
            <button
              onClick={() => signIn()}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google
            </button>
            {auth.error && (
              <p className="text-red-500 text-sm">{auth.error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadPage() {
  const { auth } = useYouTubeStore();
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    tags: [],
    visibility: 'private',
    image: null,
    audio: null,
  });

  const [progress, setProgress] = useState<ProgressState>({
    processing: false,
    uploading: false,
    progress: 0,
  });

  const imageDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({ ...prev, image: acceptedFiles[0] }));
    }
  });

  const audioDropzone = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({ ...prev, audio: acceptedFiles[0] }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.isAuthenticated) {
      toast.error('Please connect your YouTube account first');
      return;
    }

    if (!formData.image || !formData.audio) {
      toast.error('Please upload both an image and audio file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    // TODO: Implement video creation and upload
    toast.success('Form submitted successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Youtube className="w-10 h-10 text-red-500" />
            <h1 className="text-3xl font-bold">YouTube Video Uploader</h1>
          </div>

          <div className="mb-8">
            <YouTubeAuth />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div
                  {...imageDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${imageDropzone.isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <input {...imageDropzone.getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  {formData.image ? (
                    <p className="text-sm text-gray-300">{formData.image.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Drop your image here, or click to select</p>
                  )}
                </div>
              </div>

              {/* Audio Upload */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div
                  {...audioDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${audioDropzone.isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <input {...audioDropzone.getInputProps()} />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  {formData.audio ? (
                    <p className="text-sm text-gray-300">{formData.audio.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Drop your audio file here, or click to select</p>
                  )}
                </div>
              </div>
            </div>

            {/* Video Details */}
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags, separated by commas"
                />
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium mb-1">
                  Visibility
                </label>
                <select
                  id="visibility"
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as UploadFormData['visibility'] }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={progress.processing || progress.uploading || !auth.isAuthenticated}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
            >
              {progress.processing ? 'Processing...' : progress.uploading ? 'Uploading...' : 'Create & Upload Video'}
            </button>
          </form>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  const { initializeAuth, auth } = useYouTubeStore();

  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        toast.error('Failed to initialize YouTube authentication');
      }
    };
    init();
  }, [initializeAuth]);

  // Show login page if not authenticated
  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  // Show upload page if authenticated
  return <UploadPage />;
}

export default App;