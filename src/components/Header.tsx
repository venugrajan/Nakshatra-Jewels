import React from 'react';
import { Search, Upload, Lock, LogOut, Menu, Download } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUploadClick: () => void;
  onDataEngineClick: () => void;
  onToggleSidebar: () => void;
  onSortToggle: () => void;
  onResetFilters: () => void;
  onLogoClick: () => void;
  sortOrder: 'newest' | 'oldest';
}

export default function Header({
  isAdmin,
  onLogin,
  onLogout,
  onUploadClick,
  onDataEngineClick,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  onSortToggle,
  onResetFilters,
  onLogoClick,
  sortOrder
}: HeaderProps) {
  return (
    <header className="h-24 bg-white border-b border-high-border px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-3 mr-2 md:mr-4 shrink-0">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-[#5E6C84] transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2 pr-2 md:pr-4 md:border-r border-high-border md:mr-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="w-10 h-10 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const badge = document.createElement('div');
                badge.className = 'w-10 h-10 bg-high-accent rounded flex items-center justify-center text-white text-[14px] font-bold';
                badge.innerText = 'M';
                parent.prepend(badge);
              }
            }}
          />
          <span className="font-bold text-[14px] md:text-[15px] tracking-tight text-high-accent hidden xsm:inline-block">NAKSHATRA JEWELS</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl hidden md:flex items-center gap-4 px-4 overflow-hidden">
        <div className="relative flex-1 min-w-[120px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#5E6C84] opacity-50" />
          <input 
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-high-border rounded pl-9 pr-8 py-2 text-xs text-high-ink focus:outline-none focus:ring-1 focus:ring-high-accent transition-all"
          />
          <span className="absolute right-3 top-2.5 opacity-30 text-xs">/</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-high-border pl-4 text-xs shrink-0">
          <button 
            onClick={onResetFilters}
            className="text-[11px] font-medium text-[#5E6C84] px-2 py-1.5 border border-high-border rounded bg-white hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
          >
            Filter: All
          </button>
          <button 
            onClick={onSortToggle}
            className="text-[11px] font-medium text-[#5E6C84] px-2 py-1.5 border border-high-border rounded bg-white hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            Sort: <span className="capitalize">{sortOrder}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-auto">
        {isAdmin && (
          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={onDataEngineClick}
              className="bg-white border border-high-border text-high-ink p-2 md:px-3 md:py-1.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              title="Database Sync & Backup"
            >
              <Download size={14} /> 
              <span className="hidden lg:inline">Sync</span>
            </button>
            <button 
              onClick={onUploadClick}
              className="bg-high-accent text-white p-2 md:px-3 md:py-1.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
              title="Bulk Upload"
            >
              <Upload size={14} /> 
              <span className="hidden lg:inline">Bulk Upload</span>
            </button>
          </div>
        )}

        {isAdmin ? (
          <button 
            onClick={onLogout}
            className="p-2 rounded border border-high-border text-[#5E6C84] hover:bg-slate-50 hover:text-high-ink transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        ) : (
          <button 
            onClick={onLogin}
            className="bg-white border border-high-border p-2 md:px-3 md:py-1.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all text-[#5E6C84]"
            title="Admin Login"
          >
            <Lock size={14} /> 
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}
      </div>
    </header>
  );
}
