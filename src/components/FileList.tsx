import { FileText, Image as ImageIcon, Video, Music, Archive, FileType2, File as FileIcon, Download, Trash2, ExternalLink } from 'lucide-react';
import { supabase, CLUB_BUCKET } from '@/lib/supabase';
import { formatBytes, formatDate, fileIcon } from '@/lib/format';
import type { ClubFile } from '@/lib/types';

interface Props {
  files: ClubFile[];
  onDelete: (id: string, path: string) => void;
}

const iconMap: Record<string, typeof FileText> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  pdf: FileType2,
  archive: Archive,
  doc: FileText,
  file: FileIcon,
};

const colorMap: Record<string, string> = {
  image: 'bg-purple-100 text-purple-600',
  video: 'bg-rose-100 text-rose-600',
  audio: 'bg-amber-100 text-amber-600',
  pdf: 'bg-red-100 text-red-600',
  archive: 'bg-orange-100 text-orange-600',
  doc: 'bg-blue-100 text-blue-600',
  file: 'bg-slate-100 text-slate-600',
};

export default function FileList({ files, onDelete }: Props) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <FileIcon className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-slate-600">No files yet</p>
        <p className="mt-1 text-xs text-slate-400">Upload a file above to see it appear here.</p>
      </div>
    );
  }

  function getUrl(path: string): string {
    const { data } = supabase.storage.from(CLUB_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => {
        const kind = fileIcon(file.mime_type);
        const Icon = iconMap[kind] ?? FileIcon;
        const url = getUrl(file.storage_path);
        return (
          <div
            key={file.id}
            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorMap[kind]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatBytes(file.size_bytes)} · {formatDate(file.created_at)}
                </p>
              </div>
            </div>

            {kind === 'image' && (
              <div className="mt-3 overflow-hidden rounded-xl bg-slate-50">
                <img
                  src={url}
                  alt={file.name}
                  loading="lazy"
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <a
                href={url}
                download={file.name}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => onDelete(file.id, file.storage_path)}
                className="flex items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Delete file"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
