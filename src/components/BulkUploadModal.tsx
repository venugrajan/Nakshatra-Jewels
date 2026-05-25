import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, Upload, CheckCircle2, ChevronDown, Package, Edit3, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Category, SubCategory, SubSubCategory } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface FileMetadata {
  id: string;
  name: string;
  dealerName: string;
  subItem: string;
  weight: string;
  price: string;
  file: File;
}

interface BulkUploadModalProps {
  categories: Category[];
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
  dealers: string[];
  onClose: () => void;
}

export default function BulkUploadModal({ categories, subCategories, subSubCategories, dealers, onClose }: BulkUploadModalProps) {
  const [metas, setMetas] = useState<FileMetadata[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [subSubCategoryId, setSubSubCategoryId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Common fields to apply to all
  const [commonDealer, setCommonDealer] = useState('');
  const [commonSubItem, setCommonSubItem] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMetas = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.split('.')[0],
      dealerName: '',
      subItem: '',
      weight: '',
      price: '',
      file
    }));
    setMetas(prev => [...prev, ...newMetas]);
  }, []);

  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
  });

  const updateMeta = (id: string, field: keyof FileMetadata, value: string) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMeta = (id: string) => {
    setMetas(prev => prev.filter(m => m.id !== id));
  };

  const applyCommon = () => {
    setMetas(prev => prev.map(m => ({
      ...m,
      dealerName: commonDealer || m.dealerName,
      subItem: commonSubItem || m.subItem
    })));
  };

  const handleUpload = async () => {
    if (!categoryId || metas.length === 0) return;
    setUploading(true);
    
    try {
      for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to JPEG 70% quality
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(meta.file);
        });

        await addDoc(collection(db, 'products'), {
          name: meta.name || meta.file.name.split('.')[0],
          description: `Jewelry item from ${meta.dealerName || 'Unknown Dealer'}`,
          price: parseFloat(meta.price) || 0,
          imageUrl: imageUrl, 
          categoryId,
          subCategoryId,
          subSubCategoryId,
          dealerName: meta.dealerName || 'Direct',
          subItem: meta.subItem || 'Jewelry',
          weight: parseFloat(meta.weight) || 0,
          options: ['22K', '18K', '24K'],
          createdAt: new Date().toISOString()
        });

        setProgress(Math.round(((i + 1) / metas.length) * 100));
      }
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl rounded shadow-2xl flex flex-col max-h-[95vh] border border-high-border"
      >
        <div className="p-4 border-b border-high-border bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Bulk Jewelry Upload</h2>
            <p className="text-[10px] text-[#5E6C84] uppercase font-bold tracking-widest mt-0.5">KRBS Catalog System</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#5E6C84]">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="data-label">Primary Category</label>
              <select 
                className="w-full bg-slate-50 border border-high-border rounded py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-high-accent"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategoryId('');
                  setSubSubCategoryId('');
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c, idx) => <option key={`${c.id}-${idx}`} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="data-label">Sub-Category</label>
              <select 
                className="w-full bg-slate-50 border border-high-border rounded py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-high-accent"
                value={subCategoryId}
                onChange={(e) => {
                  setSubCategoryId(e.target.value);
                  setSubSubCategoryId('');
                }}
              >
                <option value="">N/A</option>
                {subCategories.filter(s => s.categoryId === categoryId).map((s, idx) => <option key={`${s.id}-${idx}`} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="data-label">Sub-Sub-Item</label>
              <select 
                className="w-full bg-slate-50 border border-high-border rounded py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-high-accent"
                value={subSubCategoryId}
                onChange={(e) => setSubSubCategoryId(e.target.value)}
              >
                <option value="">N/A</option>
                {subSubCategories.filter(ss => ss.subCategoryId === subCategoryId).map((ss, idx) => <option key={`${ss.id}-${idx}`} value={ss.id}>{ss.name}</option>)}
              </select>
            </div>
          </div>

          {!metas.length ? (
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded p-12 text-center transition-all cursor-pointer",
                isDragActive ? "border-high-accent bg-blue-50" : "border-high-border hover:border-high-accent bg-slate-50/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload size={32} className="mx-auto mb-3 text-[#5E6C84]" />
              <p className="text-xs font-bold mb-1 uppercase tracking-tight">Drag jewelry photos or click to browse</p>
              <p className="text-[10px] text-[#5E6C84] font-medium">JPEG, PNG, WEBP (Supports multiple selection)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded border border-high-border space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="data-label">Bulk Settings (Apply to All)</span>
                  <button 
                    onClick={applyCommon}
                    className="text-[10px] font-bold text-high-accent uppercase hover:underline"
                  >
                    Apply to queued items
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Dealer Name"
                    value={commonDealer}
                    onChange={(e) => setCommonDealer(e.target.value)}
                    list="dealer-list"
                    className="bg-white border border-high-border rounded py-1.5 px-3 text-xs outline-none"
                  />
                  <datalist id="dealer-list">
                    {dealers.map((d, i) => <option key={i} value={d} />)}
                  </datalist>
                  <input 
                    placeholder="Sub-Item Type"
                    value={commonSubItem}
                    onChange={(e) => setCommonSubItem(e.target.value)}
                    className="bg-white border border-high-border rounded py-1.5 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center data-label">
                  <span>Queued Items ({metas.length})</span>
                  <button onClick={() => setMetas([])} className="text-high-danger hover:underline font-bold capitalize">Clear all</button>
                </div>
                <div className="space-y-3">
                  {metas.map((meta, idx) => (
                    <div key={`${meta.id}-${idx}`} className="flex gap-4 p-3 border border-high-border rounded bg-white group relative">
                      <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0 border border-high-border">
                        <img 
                          src={URL.createObjectURL(meta.file)} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#5E6C84]">Item Name</label>
                          <input 
                            value={meta.name}
                            onChange={(e) => updateMeta(meta.id, 'name', e.target.value)}
                            className="w-full border-b border-high-border px-1 py-0.5 text-[11px] outline-none focus:border-high-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#5E6C84]">Dealer</label>
                          <input 
                            placeholder="Dealer"
                            value={meta.dealerName}
                            onChange={(e) => updateMeta(meta.id, 'dealerName', e.target.value)}
                            list="dealer-list"
                            className="w-full border-b border-high-border px-1 py-0.5 text-[11px] outline-none focus:border-high-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#5E6C84]">Sub-Item</label>
                          <input 
                            placeholder="Sub Item"
                            value={meta.subItem}
                            onChange={(e) => updateMeta(meta.id, 'subItem', e.target.value)}
                            className="w-full border-b border-high-border px-1 py-0.5 text-[11px] outline-none focus:border-high-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#5E6C84]">Weight (g)</label>
                          <input 
                            placeholder="Weight"
                            type="number"
                            value={meta.weight}
                            onChange={(e) => updateMeta(meta.id, 'weight', e.target.value)}
                            className="w-full border-b border-high-border px-1 py-0.5 text-[11px] outline-none focus:border-high-accent"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMeta(meta.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-high-danger text-high-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  {...getRootProps()}
                  className="w-full py-3 border border-dashed border-high-border rounded flex items-center justify-center gap-2 text-xs text-[#5E6C84] hover:bg-slate-50 transition-all mt-4"
                >
                  <input {...getInputProps()} />
                  <Upload size={14} /> Add more files
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-high-border">
          {uploading ? (
            <div className="space-y-3">
              <div className="flex justify-between data-label text-high-ink">
                <span>Synchronizing to G-Drive...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-high-success" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button 
              disabled={!categoryId || metas.length === 0}
              onClick={handleUpload}
              className="w-full bg-high-accent text-white py-3 rounded text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
            >
              <Upload size={14} /> Commit {metas.length} Items to Catalog
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Removed duplicate import at bottom
