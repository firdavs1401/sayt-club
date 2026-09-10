import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, FileUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, CLUB_BUCKET } from '@/lib/supabase';
import type { ClubFile, UploadStatus } from '@/lib/types';

interface Props {
  onUploaded: (file: ClubFile) => void;
}

export default function FileUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentName, setCurrentName] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setStatus('uploading');
    setProgress(0);
    setCurrentName(file.name);
    setErrorMsg('');

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const path = `uploads/${safeName}`;

    try {
      const { error: upErr } = await supabase.storage
        .from(CLUB_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (upErr) throw upErr;
      setProgress(70);

      const { data, error } = await supabase
        .from('club_files')
        .insert({
          name: file.name,
          storage_path: path,
          size_bytes: file.size,
          mime_type: file.type || 'application/octet-stream',
        })
        .select()
        .single();

      if (error) throw error;
      setProgress(100);
      setStatus('done');
      onUploaded(data as ClubFile);
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
        setCurrentName('');
      }, 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
        setCurrentName('');
        setErrorMsg('');
      }, 4000);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`group relative cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-10 ${
        dragging
          ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
          : 'border-slate-300 bg-white/60 hover:border-emerald-400 hover:bg-emerald-50/40'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {status === 'idle' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Drop a file to share, or <span className="text-emerald-600 underline-offset-2 group-hover:underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Images, video, audio, PDFs, docs, archives — up to 50 MB</p>
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
              <span className="truncate pr-2">{currentName}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-emerald-700">Uploaded and shared!</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-red-600">Upload failed</p>
          <p className="max-w-xs text-xs text-red-400">{errorMsg}</p>
        </div>
      )}

      <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
        <FileUp className="h-3.5 w-3.5" />
        Upload
      </div>
    </div>
  );
}
