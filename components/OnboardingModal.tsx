'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function OnboardingModal() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const checkProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!data) {
          setIsOpen(true);
        }
      };
      checkProfile();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !user) return;

    setIsSubmitting(true);
    
    // Attempting to insert profile into Supabase
    // Make sure Row Level Security allows this insert!
    const { error } = await supabase.from('profiles').insert([
      {
        id: user.id,
        username: username.trim().toLowerCase(),
        full_name: user.fullName || '',
        is_anonymous: false,
        skills: [],
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to claim username', { description: error.message });
      console.error(error);
    } else {
      toast.success('Username claimed!', { style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }});
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md p-8 relative flex flex-col gap-6 border border-neon-cyan/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Welcome to CampusGigs!</h2>
          <p className="text-sm text-gray-400">Claim your professional @username to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan font-bold">@</span>
            <input 
              type="text"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder-gray-600"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              maxLength={20}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || username.length < 3}
            className="w-full bg-gradient-to-r from-neon-violet to-neon-cyan text-white font-bold tracking-wide py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {isSubmitting ? 'Saving Profile...' : 'Start Creating'}
          </button>
        </form>
      </div>
    </div>
  );
}
