import { Search, Upload, FolderOpen, Users } from 'lucide-react';

const features = [
  { icon: Search, title: 'Instant search', desc: 'Find any file by name or type in milliseconds.' },
  { icon: Upload, title: 'Drag & drop upload', desc: 'Share documents, media, and archives in one click.' },
  { icon: FolderOpen, title: 'Organized library', desc: 'Browse a clean, filterable grid of shared resources.' },
  { icon: Users, title: 'Open club', desc: 'A shared space — no sign-in required to upload or download.' },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-white to-white" />
      <div className="absolute left-1/2 top-0 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live shared library
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          The club for <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">sharing files</span> that just works
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-500 sm:text-lg">
          Upload, search, and download documents, media, and archives — all in one beautifully simple place. No account needed.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#upload"
            className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-200 sm:w-auto"
          >
            Upload a file
          </a>
          <a
            href="#files"
            className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-600 sm:w-auto"
          >
            Browse files
          </a>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">{f.title}</p>
              <p className="text-xs text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
