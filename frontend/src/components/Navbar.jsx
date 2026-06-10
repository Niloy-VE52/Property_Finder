import React from 'react';
import { Building2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-200">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                MagicProperty
              </span>
              <span className="text-sm font-semibold text-gold-600 ml-1 tracking-wider uppercase">
                Elite
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#explore" className="hover:text-brand-600 transition-colors">Buy</a>
              <a href="#rentals" className="hover:text-brand-600 transition-colors">Rent</a>
              <a href="#agents" className="hover:text-brand-600 transition-colors">Find Agent</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
