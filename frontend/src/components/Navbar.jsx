import React, { useState } from 'react';
import { Building2, LogOut, PlusCircle, LayoutList, ChevronDown, UserCircle } from 'lucide-react';

export default function Navbar({ user, onLoginClick, onLogout, onBuyClick, onRentClick, onFindAgentClick, onMyPropertiesClick, onAddPropertyClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-200">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">MagicProperty</span>
              <span className="text-sm font-semibold text-gold-600 ml-1 tracking-wider uppercase">Elite</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button onClick={onBuyClick} className="hover:text-brand-600 transition-colors">Buy</button>
              <button onClick={onRentClick} className="hover:text-brand-600 transition-colors">Rent</button>
              <button onClick={onFindAgentClick} className="hover:text-brand-600 transition-colors">Find Agent</button>
            </nav>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <div className="h-7 w-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded">Admin</span>
                        )}
                      </div>
                      <button onClick={() => { setMenuOpen(false); onAddPropertyClick(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        <PlusCircle className="h-3.5 w-3.5" /> Add Property
                      </button>
                      <button onClick={() => { setMenuOpen(false); onMyPropertiesClick(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        <LayoutList className="h-3.5 w-3.5" /> {user.role === 'admin' ? 'Manage Properties' : 'My Properties'}
                      </button>
                      <button onClick={() => { setMenuOpen(false); onLogout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                        <LogOut className="h-3.5 w-3.5" /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={onLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-sm">
                <UserCircle className="h-4 w-4" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}