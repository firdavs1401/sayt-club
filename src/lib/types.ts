export interface ClubFile {
  id: string;
  name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
  created_at: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';
