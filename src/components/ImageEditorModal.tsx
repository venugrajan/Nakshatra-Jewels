import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, RotateCcw, Sliders, Crop, Wand2, Type, Info } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Product } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ImageEditorModalProps {
  product: Product;
  onClose: () => void;
}

export default function ImageEditorModal({ product, onClose }: ImageEditorModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [saving, setSaving] = useState(false);
  
  // Metadata fields
  const [name, setName] = useState(product.name || '');
  const [weight, setWeight] = useState(product.weight?.toString() || '');
  const [dealerName, setDealerName] = useState(product.dealerName || '');
  const [subItem, setSubItem] = useState(product.subItem || '');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'products', product.id), {
        editedAt: new Date().toISOString(),
        name,
        weight: parseFloat(weight) || 0,
        dealerName,
        subItem,
        filters: { brightness, contrast, grayscale }
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-6xl h-full flex flex-col md:flex-row bg-[#111] rounded-[40px] overflow-hidden shadow-2xl"
      >
        {/* Main Editor Area */}
        <div className="flex-1 relative bg-black/50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div 
              className="relative w-full h-full max-h-[600px] rounded-3xl overflow-hidden transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)` }}
            >
              <Cropper
                image={product.imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>
          </div>
          
          <div className="absolute top-8 left-8">
            <h2 className="text-white text-lg font-semibold tracking-tight uppercase font-mono">Nakshatra Editor</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-high-accent rounded-full animate-pulse" />
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Editing ID: {product.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-8 border border-white/10 group shadow-lg">
             <div className="flex items-center gap-4">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest font-mono">Zoom</span>
              <input 
                type="range" 
                min={1} 
                max={3} 
                step={0.1}
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-white opacity-40 focus:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-96 bg-[#161616] border-l border-white/5 p-6 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="p-2 bg-high-accent/10 rounded border border-high-accent/20">
              <Wand2 className="text-high-accent" size={18} />
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-10">
            {/* Metadata Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white/40 group cursor-default">
                <Info size={14} />
                <label className="text-[10px] uppercase font-black tracking-[0.2em] group-hover:text-white transition-colors font-mono">Asset Details</label>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 font-bold tracking-widest uppercase font-mono">Product Name</label>
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:border-white/30 outline-none transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] text-white/40 font-bold tracking-widest uppercase font-mono">Weight (g)</label>
                    <input 
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:border-white/30 outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-white/40 font-bold tracking-widest uppercase font-mono">Dealer</label>
                    <input 
                      value={dealerName}
                      onChange={(e) => setDealerName(e.target.value)}
                      placeholder="Dealer name..."
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:border-white/30 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 font-bold tracking-widest uppercase font-mono">Sub Item Type</label>
                  <input 
                    value={subItem}
                    onChange={(e) => setSubItem(e.target.value)}
                    placeholder="e.g. Ring, Necklace..."
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:border-white/30 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Adjustments Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white/40 group cursor-default">
                <Sliders size={14} />
                <label className="text-[10px] uppercase font-black tracking-[0.2em] group-hover:text-white transition-colors font-mono">Visual Effects</label>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] text-white/60 font-bold tracking-widest uppercase font-mono">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={200} 
                    value={brightness} 
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] text-white/60 font-bold tracking-widest uppercase font-mono">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={200} 
                    value={contrast} 
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] text-white/60 font-bold tracking-widest uppercase font-mono">
                    <span>Grayscale</span>
                    <span>{grayscale}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={grayscale} 
                    onChange={(e) => setGrayscale(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 space-y-3 mt-auto">
            <button 
              onClick={() => {
                setBrightness(100);
                setContrast(100);
                setGrayscale(0);
                setZoom(1);
                setName(product.name);
                setWeight(product.weight.toString());
                setDealerName(product.dealerName);
                setSubItem(product.subItem);
              }}
              className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center justify-center gap-2 transition-all font-mono"
            >
              <RotateCcw size={12} /> Reset to Original
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-high-accent hover:text-white transition-all flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            >
              {saving ? 'Synchronizing...' : (
                <>
                  <Save size={14} /> Commit Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
