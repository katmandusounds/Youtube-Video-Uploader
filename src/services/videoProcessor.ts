import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export class VideoProcessor {
  private ffmpeg: FFmpeg;
  
  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async init() {
    if (!this.ffmpeg.loaded) {
      await this.ffmpeg.load({
        log: true
      });
    }
  }

  async createVideo(imageFile: File, audioFile: File, onProgress?: (progress: number) => void): Promise<Blob> {
    await this.init();

    // Set up progress tracking
    this.ffmpeg.on('progress', (progress) => {
      onProgress?.(Math.round(progress.progress * 100));
    });

    // Write files to FFmpeg virtual filesystem
    const imageData = await fetchFile(imageFile);
    const audioData = await fetchFile(audioFile);
    await this.ffmpeg.writeFile('input.jpg', imageData);
    await this.ffmpeg.writeFile('input.mp3', audioData);

    // Create video from image and audio
    await this.ffmpeg.exec([
      '-loop', '1',
      '-i', 'input.jpg',
      '-i', 'input.mp3',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      'output.mp4'
    ]);

    // Read the output file
    const data = await this.ffmpeg.readFile('output.mp4');
    return new Blob([data], { type: 'video/mp4' });
  }
} 