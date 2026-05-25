import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderPlus } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddCategoryModalProps {
  key?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: name.trim()
      });
      onClose();
      setName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded shadow-2xl border border-high-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-high-border bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus size={16} className="text-high-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider">New Category</h2>
              </div>
              <button onClick={onClose} className="text-[#5E6C84] hover:text-high-ink">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="data-label text-high-ink">Category Name</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Landscapes, Portraits..."
                  className="w-full bg-slate-50 border border-high-border rounded px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-high-accent transition-all"
                />
              </div>

              <button
                disabled={loading || !name.trim()}
                type="submit"
                className="w-full bg-high-accent text-white py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-30 shadow-sm"
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
