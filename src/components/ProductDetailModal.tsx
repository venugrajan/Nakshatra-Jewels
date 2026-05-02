import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, Share2, Heart, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ProductDetailModal({ product, onClose, onNext, onPrev }: ProductDetailModalProps) {
  const [selectedOption, setSelectedOption] = useState(product.options[0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center md:p-8 p-0 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 left-4 hidden md:flex items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 hidden md:flex items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white w-full max-w-5xl h-full max-h-[85vh] rounded md:rounded-[4px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-high-border relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 bg-high-bg relative group flex items-center justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 md:hidden">
             <button 
              onClick={onPrev}
              className="px-4 py-2 bg-white/90 rounded border border-high-border text-[10px] font-bold uppercase tracking-wider shadow-sm"
            >
              Prev
            </button>
            <button 
              onClick={onNext}
              className="px-4 py-2 bg-white/90 rounded border border-high-border text-[10px] font-bold uppercase tracking-wider shadow-sm"
            >
              Next
            </button>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden w-8 h-8 bg-white border border-high-border shadow-sm rounded flex items-center justify-center text-high-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="w-full md:w-[400px] p-6 md:p-10 overflow-y-auto flex flex-col bg-white">
          <div className="hidden md:flex justify-end mb-6">
             <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded transition-colors text-[#5E6C84]">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="data-label px-1.5 py-0.5 bg-slate-100 rounded border border-high-border">Asset Record</span>
              <span className="text-[10px] text-[#5E6C84] font-mono font-bold uppercase tracking-wider">#{product.id.slice(0, 8)}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-high-ink mb-3 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#5E6C84]">Weight</span>
                <span className="text-lg font-bold text-high-accent">{product.weight}g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#5E6C84]">Dealer</span>
                <span className="text-sm font-bold text-high-ink">{product.dealerName || 'Direct'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#5E6C84]">Sub-Item</span>
                <span className="text-sm font-bold text-high-ink">{product.subItem || 'Jewelry'}</span>
              </div>
            </div>

            <div className="space-y-6 mb-8 pt-6 border-t border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="data-label">Selected Variant</label>
                  <button className="text-[9px] font-bold text-high-accent uppercase tracking-widest flex items-center gap-1">
                    <Info size={10} /> Specs
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.options.map((opt, idx) => (
                    <button 
                      key={`${opt}-${idx}`}
                      onClick={() => setSelectedOption(opt)}
                      className={cn(
                        "px-3 py-1.5 rounded text-[11px] font-bold border transition-all uppercase tracking-wider",
                        selectedOption === opt 
                          ? "bg-high-accent text-white border-high-accent" 
                          : "bg-white border-high-border text-[#5E6C84] hover:bg-slate-50"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="data-label">Asset Description</label>
                <p className="text-[12px] text-high-ink font-medium leading-relaxed bg-slate-50 p-3 rounded border border-high-border/30">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-slate-100 mt-auto">
            <button className="w-full bg-high-accent text-white py-3 rounded text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
              <ShoppingBag size={14} /> Synchronize Asset
            </button>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded border border-high-border flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5E6C84] hover:bg-slate-50 transition-colors">
                <Heart size={12} /> Save
              </button>
              <button className="flex-1 py-2.5 rounded border border-high-border flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5E6C84] hover:bg-slate-50 transition-colors">
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { cn } from '../lib/utils';
