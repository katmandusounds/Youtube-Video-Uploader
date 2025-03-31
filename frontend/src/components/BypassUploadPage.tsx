import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export function BypassUploadPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCreateVideo = async () => {
    if (!audioFile || !imageFile) {
      alert('Please select both an audio file and an image');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const ffmpeg = createFFmpeg({ 
        log: true,
        progress: ({ ratio }) => setProgress(Math.round(ratio * 100))
      });
      
      await ffmpeg.load();

      // Write files to MEMFS
      ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));
      ffmpeg.FS('writeFile', 'image.jpg', await fetchFile(imageFile));

      // Create video
      await ffmpeg.run(
        '-loop', '1',
        '-i', 'image.jpg',
        '-i', 'audio.mp3',
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        'output.mp4'
      );

      // Read the result
      const data = ffmpeg.FS('readFile', 'output.mp4');
      
      // Create download link
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error creating video:', error);
      alert('Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Create Video (Test Mode)</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Audio File (MP3)</label>
            <input
              type="file"
              accept="audio/mp3"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Image File (JPG/PNG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <button
            onClick={handleCreateVideo}
            disabled={loading || !audioFile || !imageFile}
            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? `Creating Video (${progress}%)` : 'Create & Download Video'}
          </button>
        </div>
      </div>
    </div>
  );
} 