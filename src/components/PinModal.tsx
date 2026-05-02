import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldAlert, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface PinModalProps {
  key?: string;
  onClose: () => void;
  onConfirm: (pin: string) => void;
}

export default function PinModal({ onClose, onConfirm }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Default simple PIN for demo
      onConfirm(pin);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-sm rounded p-8 text-center shadow-xl border border-high-border relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-high-danger opacity-20" />
        
        <div className="w-12 h-12 bg-high-danger-light rounded flex items-center justify-center mx-auto mb-6 text-high-danger">
          <ShieldAlert size={24} />
        </div>

        <h2 className="text-base font-bold mb-2 uppercase tracking-tight">Security Verification</h2>
        <p className="text-xs text-[#5E6C84] font-medium mb-8 leading-relaxed">
          PIN authorization required to modify protected cloud assets.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password"
            autoFocus
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className={cn(
              "w-full text-center text-3xl tracking-[0.5em] py-3 bg-slate-50 border border-high-border rounded outline-none transition-all",
              error ? "border-high-danger animate-shake" : "focus:border-high-accent focus:ring-1 focus:ring-high-accent"
            )}
          />
          
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border border-high-border rounded bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest bg-high-accent text-white rounded hover:bg-opacity-90 transition-all shadow-sm"
            >
              Authorize
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
