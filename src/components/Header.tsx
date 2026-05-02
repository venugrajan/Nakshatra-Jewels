import React from 'react';
import { Search, Upload, Lock, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUploadClick: () => void;
  onToggleSidebar: () => void;
  onSortToggle: () => void;
  onResetFilters: () => void;
  sortOrder: 'newest' | 'oldest';
}

export default function Header({
  isAdmin,
  onLogin,
  onLogout,
  onUploadClick,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  onSortToggle,
  onResetFilters,
  sortOrder
}: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-high-border px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 mr-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-[#5E6C84] transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2 pr-4 md:border-r border-high-border md:mr-2 shrink-0">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const badge = document.createElement('div');
                badge.className = 'w-6 h-6 bg-high-accent rounded flex items-center justify-center text-white text-[10px] font-bold';
                badge.innerText = 'N';
                parent.prepend(badge);
              }
            }}
          />
          <span className="font-bold text-[13px] tracking-tight text-high-accent hidden sm:inline-block">NAKSHATRA JEWELS</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl flex items-center gap-4">
        <div className="relative w-64">
          <input 
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-high-border rounded px-3 py-1.5 text-xs text-high-ink focus:outline-none focus:ring-1 focus:ring-high-accent transition-all"
          />
          <span className="absolute right-3 top-1.5 opacity-30 text-xs">/</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-high-border pl-4 text-xs">
          <button 
            onClick={onResetFilters}
            className="text-[11px] font-medium text-[#5E6C84] px-2 py-1 border border-high-border rounded bg-white hover:bg-slate-50 transition-all active:scale-95"
          >
            Filter: All Assets
          </button>
          <button 
            onClick={onSortToggle}
            className="text-[11px] font-medium text-[#5E6C84] px-2 py-1 border border-high-border rounded bg-white hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5"
          >
            Sort: <span className="capitalize">{sortOrder}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <button 
            onClick={onUploadClick}
            className="bg-high-accent text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
          >
            <Upload size={12} /> Bulk Upload
          </button>
        )}

        {isAdmin ? (
          <button 
            onClick={onLogout}
            className="p-1.5 rounded border border-high-border text-[#5E6C84] hover:bg-slate-50 hover:text-high-ink transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        ) : (
          <button 
            onClick={onLogin}
            className="bg-white border border-high-border px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all text-[#5E6C84]"
          >
            <Lock size={12} /> Admin
          </button>
        )}
      </div>
    </header>
  );
}
