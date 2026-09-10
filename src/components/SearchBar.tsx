import { useEffect, useState } from 'react';
import { Search, X, SlidersHorizontal, FileText, Image as ImageIcon, Video, Music, Archive, FileType2, Filter } from 'lucide-react';

export type FileTypeFilter = 'all' | 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'doc';

interface Props {
  value: string;
  onChange: (v: string) => void;
  filter: FileTypeFilter;
  onFilterChange: (f: FileTypeFilter) => void;
}

const FILTERS: { key: FileTypeFilter; label: string; icon: typeof FileText }[] = [
  { key: 'all', label: 'All', icon: Filter },
  { key: 'image', label: 'Images', icon: ImageIcon },
  { key: 'video', label: 'Videos', icon: Video },
  { key: 'audio', label: 'Audio', icon: Music },
  { key: 'pdf', label: 'PDF', icon: FileType2 },
  { key: 'archive', label: 'Archives', icon: Archive },
  { key: 'doc', label: 'Docs', icon: FileText },
];

export default function SearchBar({ value, onChange, filter, onFilterChange }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('club-search')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="w-full">
      <div className={`relative flex items-center gap-2 rounded-2xl border bg-white/80 backdrop-blur-md transition-all duration-300 ${focused ? 'border-emerald-400 shadow-lg shadow-emerald-100' : 'border-slate-200 shadow-sm'}`}>
        <Search className={`ml-4 h-5 w-5 shrink-0 transition-colors ${focused ? 'text-emerald-500' : 'text-slate-400'}`} />
        <input
          id="club-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search files, documents, media…"
          className="flex-1 bg-transparent py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="mr-1 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="hidden items-center gap-1 border-l border-slate-200 px-3 text-[11px] font-medium text-slate-400 sm:flex">
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5">⌘K</kbd>
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`mr-2 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${showFilters ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden md:inline">Filters</span>
        </button>
      </div>

      <div className={`grid transition-all duration-300 ${showFilters ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === key
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
