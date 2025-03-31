export class YouTubeUploader {
  async uploadVideo(
    videoBlob: Blob,
    metadata: {
      title: string;
      description: string;
      tags: string[];
      visibility: 'private' | 'unlisted' | 'public';
    },
    accessToken: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Convert blob to File
    const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });

    // Initialize upload
    const initResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Length': videoFile.size.toString(),
        'X-Upload-Content-Type': 'video/mp4'
      },
      body: JSON.stringify({
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags
        },
        status: {
          privacyStatus: metadata.visibility
        }
      })
    });

    if (!initResponse.ok) {
      throw new Error('Failed to initialize upload');
    }

    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) {
      throw new Error('No upload URL received');
    }

    // Perform upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress?.(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.id);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', 'video/mp4');
      xhr.send(videoFile);
    });
  }
} 