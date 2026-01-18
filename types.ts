export type Stage = 'welcome' | 'training' | 'processing' | 'list' | 'testing' | 'zip-upload';

export interface User {
  id: number;
  name: string;
  data: string; // Base64 image string
  descriptor?: Float32Array; // Cached face embedding
}

export interface ScanResult {
  name: string;
  score: number;
}

export type ScanStatus = 'idle' | 'scanning' | 'match' | 'mismatch';

export interface CameraError {
  message: string;
}