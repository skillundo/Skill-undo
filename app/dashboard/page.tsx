'use client';

import { useEffect, useState } from 'react';
import { supabase, type Profile } from '@/lib/supabase';
import { ProfileCard } from '@/components/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { AssignWorkModal } from '@/components/AssignWorkModal';

const CATEGORIES = ['All', 'Digital Artist', 'Content Writing', 'UI/UX Design', 'Full-Stack Dev', 'Video Editing'];

export default function DashboardFeed() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeCategory !== 'All') {
        query = query.contains('skills', [activeCategory]);
      }
        
      const { data, error } = await query;
        
      if (!error && data) {
        setProfiles(data as Profile[]);
      }
      setIsLoading(false);
    };

    fetchProfiles();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('profiles-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => [payload.new as Profile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) => prev.map((p) => p.id === payload.new.id ? payload.new as Profile : p));
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in relative mt-4 md:mt-0">
      <div className="flex flex-col gap-4 items-center text-center mt-8 mb-4 relative w-full max-w-5xl mx-auto px-4">
        {/* Dashboard Header Text */}

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 md:mt-2">
          Creator <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">Dashboard.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Discover exclusive campus talent and explore creator profiles.
        </p>
      </div>

      {/* Mobile Filter Bar with Extra Padding to prevent Shadow Clipping */}
      <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide snap-x px-6 mx-auto w-full max-w-5xl justify-start md:justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`snap-center px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                : 'glass-panel text-gray-300 hover:text-white hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Profile Grid */}
      <div className="min-h-[400px] w-full max-w-6xl mx-auto px-4 md:px-0">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
          </div>
        ) : profiles.filter(p => !user || p.id !== user.id).length === 0 ? (
          <div className="text-center text-gray-500 mt-20 px-4">
            No elite campus talent found for this category. <br className="md:hidden" /> Be a legend and list your skills!
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {profiles.filter(p => !user || p.id !== user.id).map((profile) => (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                  <ProfileCard 
                    profile={profile} 
                    onHireClick={() => {
                      setSelectedCreator(profile);
                      setIsModalOpen(true);
                    }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {selectedCreator && (
        <AssignWorkModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedCreator(null), 300); // Wait for modal exit animation
          }} 
          creator={selectedCreator} 
        />
      )}
    </div>
  );
}
