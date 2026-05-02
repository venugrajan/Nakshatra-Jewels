import React from 'react';
import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#F4F5F7] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2
          }}
          className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center relative overflow-hidden"
        >
          <img 
            src="/logo.svg" 
            alt="Nakshatra Logo" 
            className="w-full h-full object-contain relative z-10"
          />
          {/* Subtle shine effect */}
          <motion.div
            animate={{ 
              left: ['-100%', '200%']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-20 pointer-events-none"
          />
        </motion.div>

        {/* Text Animation */}
        <div className="mt-8 overflow-hidden text-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 1, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.8
            }}
            className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-high-accent uppercase"
          >
            Nakshatra Jewels
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1.2 }}
            className="h-px bg-high-accent/20 mt-4 mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-[10px] uppercase font-bold tracking-[0.4em] text-high-ink/40 mt-4"
          >
            Timeless Elegance • Precision Craft
          </motion.p>
        </div>

        {/* Minimal loading bar */}
        <div className="absolute bottom-[-100px] w-48 h-0.5 bg-high-ink/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-high-accent/40"
          />
        </div>
      </div>
    </motion.div>
  );
}
