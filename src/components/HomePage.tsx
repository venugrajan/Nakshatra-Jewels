import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Diamond, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';

interface HomePageProps {
  categories: Category[];
  onExplore: (categoryId?: string) => void;
}

export default function HomePage({ categories, onExplore }: HomePageProps) {
  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-high-accent selection:text-white">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-high-ink">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000" 
              alt="Luxury Diamond Ring Close-up" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-high-ink/90" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="inline-block text-high-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-6"
            >
              Est. 1995 • Artisanal Excellence
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
              Crafting <br />
              <span className="italic font-light">Eternal Legends</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Explore the Nakshatra collection — where celestial inspiration meets the world's most exquisite earth-born treasures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => onExplore()}
                className="group relative px-10 py-4 bg-white text-high-ink font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:bg-high-accent hover:text-white"
              >
                <span className="relative z-10">Discover Collections</span>
                <div className="absolute inset-0 bg-high-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* 2. Curated Collections Gallery */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-high-accent text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">Curated Selections</span>
              <h2 className="text-3xl md:text-4xl font-bold text-high-ink tracking-tight">Our Signature Collections</h2>
            </div>
            <button 
              onClick={() => onExplore()}
              className="group flex items-center gap-3 text-high-ink font-bold uppercase tracking-widest text-[10px] bg-white border border-high-border px-6 py-3 rounded-full hover:border-high-accent transition-colors"
            >
              View Full Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Massive Featured Category */}
            {categories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-8 group cursor-pointer relative overflow-hidden h-[600px]"
                onClick={() => onExplore(categories[0].id)}
              >
                <img 
                  src="/src/assets/images/regenerated_image_1778312011948.jpg" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={categories[0].name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-60 group-hover:opacity-80" />
                <div className="absolute bottom-0 left-0 p-10 text-white">
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-4 block">Masterpiece Series</span>
                  <h3 className="text-4xl font-bold mb-4 tracking-tighter">{categories[0].name}</h3>
                  <p className="text-white/70 text-sm max-w-sm font-light mb-6">
                    {categories[0].description || "High-jewelry masterpieces that redefine luxury and elegance."}
                  </p>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group">
                    Explore Series <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="md:col-span-4 flex flex-col gap-8">
              {categories.slice(1, 3).map((cat, idx) => (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex-1 group cursor-pointer relative overflow-hidden"
                  onClick={() => onExplore(cat.id)}
                >
                  <img 
                    src={cat.imageUrl || (idx === 0 ? "https://images.unsplash.com/photo-1599643477877-537eb83424ae?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=800")} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Discover</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Nakshatra Standard (Features) */}
      <section className="py-32 bg-white border-y border-stone-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <ShieldCheck className="text-high-accent" size={32} />, title: "Secure Delivery", desc: "Insured door-to-door express worldwide shipping." },
              { icon: <Heart className="text-high-accent" size={32} />, title: "Ethical Sourcing", desc: "Conflict-free diamonds adhering to Kimberley Process." },
              { icon: <Clock className="text-high-accent" size={32} />, title: "Lifetime Care", desc: "Free annual cleaning and stone tightning for life." },
              { icon: <Sparkles className="text-high-accent" size={32} />, title: "Bespoke Service", desc: "Work with our designers to create your unique piece." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-high-ink">{feature.title}</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Haute Jewelry CTA Section */}
      <section className="py-40 relative bg-high-ink text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1544450291-a35252efe460?auto=format&fit=crop&q=80&w=2000" 
            alt="Jewelry Close Up Material" 
            className="w-full h-[650px] object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              Become a <span className="text-high-accent italic">Nakshatra Member</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto">
              Join our exclusive inner circle for priority access to private collections, annual gala invitations, and personalized style consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/20 px-6 py-4 rounded-none outline-none focus:border-high-accent transition-colors"
                title="Enter your email for the newsletter"
              />
              <button className="whitespace-nowrap px-10 py-4 bg-white text-high-ink font-bold uppercase tracking-widest text-xs hover:bg-high-accent hover:text-white transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Privacy Guaranteed • Unsubscribe Anytime</p>
          </motion.div>
        </div>
      </section>

      {/* 6. Footer Content */}
      <footer className="bg-white py-20 border-t border-stone-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-high-accent rounded flex items-center justify-center text-white font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tight text-high-ink">NAKSHATRA</span>
              </div>
              <div className="flex gap-4">
                <a href="#" className="p-2 border border-stone-200 hover:border-high-accent hover:text-high-accent transition-all"><Instagram size={18} /></a>
                <a href="#" className="p-2 border border-stone-200 hover:border-high-accent hover:text-high-accent transition-all"><Facebook size={18} /></a>
                <a href="#" className="p-2 border border-stone-200 hover:border-high-accent hover:text-high-accent transition-all"><Twitter size={18} /></a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
              © 2026 Nakshatra Jewels Inc. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-high-accent">Privacy Policy</a>
              <a href="#" className="hover:text-high-accent">Terms of Use</a>
              <a href="#" className="hover:text-high-accent">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
