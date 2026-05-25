import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Category, SubCategory, SubSubCategory, Product } from '../types';

interface ExportImportModalProps {
  onClose: () => void;
}

export default function ExportImportModal({ onClose }: ExportImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = {
        categories: [],
        subcategories: [],
        subsubcategories: [],
        products: []
      };

      const collections = ['categories', 'subcategories', 'subsubcategories', 'products'];
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName));
        data[colName] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalog-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess('Backup downloaded successfully');
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'all-data');
      setError('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.categories || !data.products) {
        throw new Error('Invalid backup file format');
      }

      const batch = writeBatch(db);
      
      // Helper to process a collection
      const processCol = (name: string, items: any[]) => {
        items.forEach(item => {
          const { id, ...rest } = item;
          const ref = doc(collection(db, name), id);
          batch.set(ref, rest);
        });
      };

      processCol('categories', data.categories || []);
      processCol('subcategories', data.subcategories || []);
      processCol('subsubcategories', data.subsubcategories || []);
      processCol('products', data.products || []);

      await batch.commit();
      setSuccess('Database restored successfully');
      setTimeout(() => window.location.reload(), 2000); // Reload to reflect changes
    } catch (err) {
      console.error(err);
      setError('Import failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded shadow-2xl border border-high-border overflow-hidden"
      >
        <div className="p-4 border-b border-high-border bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Database Integrity</h2>
            <p className="text-[10px] text-[#5E6C84] uppercase font-bold tracking-widest mt-0.5">Synchronization & Backups</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#5E6C84]">
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-high-danger text-[11px] font-bold rounded flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 text-high-success text-[11px] font-bold rounded flex items-center gap-2">
              <CheckCircle2 size={14} /> {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-high-ink uppercase tracking-tight">Full Archive Export</h3>
              <p className="text-[10px] text-[#5E6C84] font-medium leading-relaxed">
                Generate a single-file JSON backup containing all categories, sub-items, and product relationships. 
                Keep this safe for manual restoration.
              </p>
              <button 
                disabled={loading}
                onClick={handleExport}
                className="w-full mt-2 bg-high-ink text-white py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download size={14} /> Prepare Export Package
              </button>
            </div>

            <div className="h-px bg-high-border my-6" />

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-high-ink uppercase tracking-tight">System Restoration</h3>
              <p className="text-[10px] text-[#5E6C84] font-medium leading-relaxed">
                Upload a previously exported catalog package. <span className="text-high-danger">Warning: This will overwrite items with matching IDs.</span>
              </p>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImport}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="w-full mt-2 border-2 border-dashed border-high-border group-hover:border-high-accent py-6 rounded flex flex-col items-center justify-center gap-2 transition-all">
                  <Upload size={20} className="text-[#5E6C84] group-hover:text-high-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6C84] group-hover:text-high-accent">Upload Backup File</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-high-border text-center">
          <p className="text-[9px] text-[#5E6C84] uppercase font-bold tracking-[0.2em]">Enterprise Data Engine v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
