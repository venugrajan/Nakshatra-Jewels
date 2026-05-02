import React from 'react';
import { motion } from 'motion/react';
import { Edit3, Trash2, Maximize2, LayoutGrid } from 'lucide-react';
import { Product } from '../types';

interface CatalogGridProps {
  products: Product[];
  onProductClick: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function CatalogGrid({
  products,
  onProductClick,
  onEdit,
  onDelete,
  isAdmin
}: CatalogGridProps) {
  if (products.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[#5E6C84] border border-dashed border-high-border rounded bg-white">
        <LayoutGrid size={32} className="opacity-10 mb-4" />
        <p className="text-[11px] font-medium uppercase tracking-wider">No assets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((p, idx) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.02 }}
          className="asset-card flex flex-col group overflow-hidden border border-high-border bg-white rounded-[3px] hover:shadow-lg transition-all h-full"
        >
          <div 
            className="thumbnail-placeholder aspect-square bg-white flex items-center justify-center relative cursor-pointer overflow-hidden p-0"
            onClick={() => onProductClick(p)}
          >
            <img 
              src={p.imageUrl} 
              alt={p.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={(e) => { e.stopPropagation(); onProductClick(p); }}
                className="p-1.5 bg-white border border-high-border rounded text-high-ink hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Maximize2 size={12} />
              </button>
            </div>

            {isAdmin && (
              <div className="absolute top-2 left-2 bg-high-danger-light text-high-danger font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm border border-high-danger/20">
                PIN REQ
              </div>
            )}
          </div>

          <div className="p-3 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-[11px] font-bold truncate leading-tight flex-1" title={p.name}>{p.name}</h4>
              <span className="text-[10px] font-mono font-bold text-high-accent">
                {p.weight}g
              </span>
            </div>
            
            <div className="flex items-center justify-between text-[9px] mb-2 text-[#5E6C84] font-medium italic">
              <span>{p.dealerName || 'Direct'}</span>
              <span>{p.subItem || 'Jewelry'}</span>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
               <span className="data-label text-[9px]">
                FILE: {p.imageUrl.includes('png') ? 'PNG' : 'JPG'}
              </span>
               
               {isAdmin && (
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                    className="p-1 border border-high-border rounded bg-white hover:bg-slate-100 text-[#5E6C84] hover:text-high-ink transition-colors"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                    className="p-1 border border-high-danger/20 text-high-danger rounded bg-high-danger-light hover:bg-white transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
