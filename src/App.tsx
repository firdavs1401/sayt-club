import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderPlus, Loader2, Inbox } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import SearchBar, { type FileTypeFilter } from '@/components/SearchBar';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';
import { supabase, CLUB_BUCKET } from '@/lib/supabase';
import { fileIcon } from '@/lib/format';
import type { ClubFile } from '@/lib/types';

export default function App() {
  const [files, setFiles] = useState<ClubFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FileTypeFilter>('all');

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('club_files')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setFiles(data as ClubFile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      const matchesQuery = f.name.toLowerCase().includes(query.trim().toLowerCase());
      const kind = fileIcon(f.mime_type);
      const matchesFilter = filter === 'all' || kind === filter;
      return matchesQuery && matchesFilter;
    });
  }, [files, query, filter]);

  const handleUploaded = (file: ClubFile) => {
    setFiles((prev) => [file, ...prev]);
  };

  const handleDelete = async (id: string, path: string) => {
    const prev = files;
    setFiles((cur) => cur.filter((f) => f.id !== id));
    await supabase.storage.from(CLUB_BUCKET).remove([path]);
    const { error } = await supabase.from('club_files').delete().eq('id', id);
    if (error) {
      setFiles(prev);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />

        <section id="upload" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12 sm:px-6">
          <div className="mb-5 flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Share a file</h2>
          </div>
          <FileUploader onUploaded={handleUploaded} />
        </section>

        <section id="files" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Club library</h2>
              <p className="mt-1 text-sm text-slate-400">
                {loading ? 'Loading files…' : `${filtered.length} of ${files.length} files`}
              </p>
            </div>
            <div className="w-full sm:max-w-md">
              <SearchBar value={query} onChange={setQuery} filter={filter} onFilterChange={setFilter} />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-3 text-sm">Loading shared files…</p>
            </div>
          ) : filtered.length === 0 && query ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Inbox className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No matches for “{query}”</p>
              <p className="mt-1 text-xs text-slate-400">Try a different name or clear the filters.</p>
            </div>
          ) : (
            <FileList files={filtered} onDelete={handleDelete} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
