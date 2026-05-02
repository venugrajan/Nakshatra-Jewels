import React from 'react';
import { 
  FolderIcon, 
  ChevronRight, 
  Settings, 
  Trash2, 
  PlusCircle, 
  Grid2X2,
  Package,
  LayoutGrid,
  User as UserIcon,
  X
} from 'lucide-react';
import { Category, SubCategory, SubSubCategory } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedSubCategory: string | null;
  onSelectSubCategory: (id: string | null) => void;
  selectedSubSubCategory: string | null;
  onSelectSubSubCategory: (id: string | null) => void;
  isAdmin: boolean;
  onDelete: (type: 'category' | 'subcategory' | 'subsubcategory' | 'product', id: string) => void;
  onAddCategory: () => void;
  onAddSubCategory: (catId: string) => void;
  onAddSubSubCategory: (subId: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  categories,
  subCategories,
  subSubCategories,
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
  selectedSubSubCategory,
  onSelectSubSubCategory,
  isAdmin,
  onDelete,
  onAddCategory,
  onAddSubCategory,
  onAddSubSubCategory
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 lg:static w-[240px] bg-white border-r border-high-border flex flex-col z-50 shrink-0 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b border-high-border bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-high-border overflow-hidden p-1 shadow-sm shrink-0">
            <img 
              src="/logo.svg" 
              alt="Nakshatra Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to stylized initials if logo.svg is not found
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.classList.add('bg-high-accent');
                  parent.innerHTML = '<span class="text-white font-bold text-xs">NJ</span>';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] tracking-tight uppercase leading-tight text-high-accent">NAKSHATRA JEWELS</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded hover:bg-slate-200 text-[#5E6C84]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-hide">
        <div className="mb-3 px-3 data-label">
          Categories
        </div>
        
        <div className="space-y-0.5">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-1.5 rounded transition-all group text-xs",
              !selectedCategory ? "bg-high-accent-light text-high-accent font-medium" : "text-high-ink hover:bg-slate-100"
            )}
          >
            <div className="flex items-center gap-2">
              <Grid2X2 size={14} />
              All Photos
            </div>
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-0.5">
              <div
                className={cn(
                  "group flex items-center justify-between px-3 py-1.5 rounded transition-all cursor-pointer text-xs",
                  selectedCategory === cat.id ? "bg-high-accent-light text-high-accent font-medium" : "hover:bg-slate-100"
                )}
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate">{cat.name}</span>
                </div>
                {isAdmin && (
                   <button 
                    onClick={(e) => { e.stopPropagation(); onDelete('category', cat.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-high-danger transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {selectedCategory === cat.id && (
                <div className="ml-3 border-l border-high-border space-y-0.5 my-1">
                  {subCategories.filter(s => s.categoryId === cat.id).map((sub) => (
                    <div key={sub.id} className="space-y-0.5">
                      <div
                        onClick={() => onSelectSubCategory(sub.id)}
                        className={cn(
                          "w-full flex items-center justify-between pl-4 pr-2 py-1 text-[11px] transition-all group cursor-pointer",
                          selectedSubCategory === sub.id ? "text-high-accent font-semibold" : "text-[#5E6C84] hover:text-high-ink"
                        )}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isAdmin && (
                          <Trash2 
                            size={10} 
                            className="opacity-0 group-hover:opacity-100 text-high-danger ml-2" 
                            onClick={(e) => { e.stopPropagation(); onDelete('subcategory', sub.id); }}
                          />
                        )}
                      </div>

                      {selectedSubCategory === sub.id && (
                        <div className="ml-3 border-l border-high-border space-y-0.5 my-1">
                          {subSubCategories.filter(ss => ss.subCategoryId === sub.id).map((ss) => (
                            <button
                              key={ss.id}
                              onClick={() => onSelectSubSubCategory(ss.id)}
                              className={cn(
                                "w-full flex items-center justify-between pl-4 pr-2 py-1 text-[10px] transition-all group",
                                selectedSubSubCategory === ss.id ? "text-high-accent font-bold" : "text-[#5E6C84] hover:text-high-ink"
                              )}
                            >
                              <span className="truncate">{ss.name}</span>
                              {isAdmin && (
                                <Trash2 
                                  size={9} 
                                  className="opacity-0 group-hover:opacity-100 text-high-danger ml-2" 
                                  onClick={(e) => { e.stopPropagation(); onDelete('subsubcategory', ss.id); }}
                                />
                              )}
                            </button>
                          ))}
                          {isAdmin && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onAddSubSubCategory(sub.id); }}
                              className="w-full flex items-center gap-2 pl-4 py-1 text-[9px] uppercase font-bold tracking-wider text-high-accent/70 hover:text-high-accent transition-colors"
                            >
                              <PlusCircle size={9} /> Add Item
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddSubCategory(cat.id); }}
                      className="w-full flex items-center gap-2 pl-4 py-1 text-[10px] uppercase font-bold tracking-wider text-high-accent hover:text-opacity-80 transition-colors"
                    >
                      <PlusCircle size={10} /> Add Sub
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isAdmin && (
            <button 
              onClick={onAddCategory}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-high-accent font-bold uppercase tracking-wider hover:bg-slate-50 transition-all border border-dashed border-high-accent/20 rounded mt-2"
            >
              <PlusCircle size={14} />
              New Category
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-high-border bg-slate-50">
        <div className="flex items-center gap-2 text-high-success text-[10px] font-bold uppercase tracking-wider mb-2">
           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7.74 2L1 14l3.37 6h15.26L23 14l-6.74-12z"/></svg>
           G-Drive Synced
        </div>
        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
          <div className="bg-high-success h-full" style={{ width: '68%' }}></div>
        </div>
        <div className="text-[9px] text-[#5E6C84] mt-1.5 font-medium">68GB of 100GB used</div>
      </div>
      </aside>
    </>
  );
}
