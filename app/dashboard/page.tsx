'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, type Task } from '@/lib/supabase';
import { TaskCard } from '@/components/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const CATEGORIES = ['All', 'Digital Artist', 'Content Writing', 'UI/UX Design', 'Full-Stack Dev', 'Video Editing'];

export default function DashboardFeed() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setTasks(data as Task[]);
      }
      setIsLoading(false);
    };

    fetchTasks();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map((t) => t.id === payload.new.id ? payload.new as Task : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTasks = tasks.filter(t => activeCategory === 'All' || t.category === activeCategory);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in relative mt-4 md:mt-0">
      <div className="flex flex-col gap-4 items-center text-center mt-8 mb-4 relative w-full max-w-5xl mx-auto px-4">
        
        {/* Dynamic Avatar Edit Profile Button */}
        {isLoaded && isSignedIn && user && (
          <div className="w-full flex justify-end md:absolute md:right-4 md:top-0 mb-6 md:mb-0 z-10">
             <Link 
                href="/profile/me?edit=true" 
                className="flex items-center gap-3 bg-[#020617]/80 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/50 p-1.5 pr-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all glass-panel"
             >
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neon-cyan/50 shrink-0">
                 <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col text-left">
                 <span className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest leading-none mb-0.5">Edit mode</span>
                 <span className="text-sm font-extrabold text-white leading-none">Your Profile</span>
               </div>
             </Link>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 md:mt-2">
          Creator <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">Dashboard.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Discover exclusive campus gigs or manage your active projects.
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

      {/* Task Grid */}
      <div className="min-h-[400px] w-full max-w-6xl mx-auto px-4 md:px-0">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 px-4">
            No professional gigs found. <br className="md:hidden" /> Become a legend and post one!
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
