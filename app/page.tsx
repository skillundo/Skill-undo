'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-32 text-center px-4 animate-fade-in relative">
      {/* Immersive Background Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] bg-neon-cyan/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-neon-violet/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Release Tag */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neon-cyan/40 bg-neon-cyan/5 mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-sm"
      >
        <Sparkles className="w-4 h-4 text-neon-cyan" />
        <span className="text-sm font-bold text-neon-cyan tracking-wider uppercase">CampusGigs 2.0 is Live</span>
      </motion.div>

      {/* Hero Header */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter max-w-5xl leading-tight"
      >
        The Elite Talent Marketplace for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-violet drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">Campus Creators.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium"
      >
        Stop settling for low-tier tasks. Join the premier network of top-rated student developers, designers, writers, and digital artists.
      </motion.p>

      {/* Call to Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-6 mt-12 w-full max-w-xl justify-center"
      >
        <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-neon-cyan text-black px-8 py-5 rounded-2xl font-extrabold text-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex-1">
          Enter Dashboard <ArrowRight className="w-6 h-6" />
        </Link>
        <Link href="/sign-in" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-md flex-1">
          Become a Creator
        </Link>
      </motion.div>
      
      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full max-w-6xl px-4 md:px-0"
      >
        <div className="glass-panel p-10 text-left border border-white/5 flex flex-col gap-4 hover:border-neon-cyan/30 transition-all group">
           <Zap className="w-10 h-10 text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform" />
           <h3 className="text-2xl font-black text-white mt-2">Instant Sync</h3>
           <p className="text-gray-400 font-medium leading-relaxed">Real-time database updates powered by Supabase channels for ultra-low latency collaboration.</p>
        </div>
        <div className="glass-panel p-10 text-left border border-white/5 flex flex-col gap-4 hover:border-neon-violet/30 transition-all group">
           <ShieldCheck className="w-10 h-10 text-neon-violet drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] group-hover:scale-110 transition-transform" />
           <h3 className="text-2xl font-black text-white mt-2">Verified Creators</h3>
           <p className="text-gray-400 font-medium leading-relaxed">Exclusive premium public profile modules with rigorous anonymity settings for discreet elite work.</p>
        </div>
        <div className="glass-panel p-10 text-left border border-white/5 flex flex-col gap-4 hover:border-neon-cyan/30 transition-all group">
           <Sparkles className="w-10 h-10 text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform" />
           <h3 className="text-2xl font-black text-white mt-2">Weightless UI</h3>
           <p className="text-gray-400 font-medium leading-relaxed">Award-winning dark mode glassmorphism and stunning interactive neon glows throughout the app.</p>
        </div>
      </motion.div>

    </div>
  );
}
