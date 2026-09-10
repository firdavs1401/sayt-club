import { Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-800">
              SAYT<span className="text-emerald-500">.CLUB</span>
            </span>
          </div>
          <p className="max-w-md text-center text-xs text-slate-400 sm:text-right">
            A shared file library — upload, search, and download. No account, no friction. Built for the club.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-6 text-xs text-slate-400">
          <span>Made with</span>
          <Heart className="h-3.5 w-3.5 text-rose-400" />
          <span>for SAYT.CLUB</span>
        </div>
      </div>
    </footer>
  );
}
