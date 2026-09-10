import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Upload', href: '#upload' },
    { label: 'Files', href: '#files' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-extrabold tracking-tight text-slate-800">SAYT</span>
            <span className="text-lg font-extrabold tracking-tight text-emerald-500">.CLUB</span>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#upload"
            className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-200 sm:inline-block"
          >
            Share a file
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
