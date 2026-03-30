'use client';

import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase, type Task } from '@/lib/supabase';

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Task[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchNotifications = async () => {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('assigned_to', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        if (data) setNotifications(data as Task[]);
      };
      
      fetchNotifications();
      
      // Realtime subscription for notifications
      const channel = supabase.channel('tasks-notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks', filter: `assigned_to=eq.${user.id}` }, (payload) => {
          setNotifications(prev => [payload.new as Task, ...prev]);
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [user?.id]);
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/profile/${searchQuery.trim()}`);
    }
  };

  // Completely remove NavBar from the Landing Page for a cinematic feel
  if (pathname === '/') return null;

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <div className="pointer-events-auto w-[95vw] max-w-[380px] md:max-w-none md:w-auto glass-panel px-4 py-2 flex items-center justify-center gap-4 md:gap-8 rounded-[2rem] animate-float border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {/* LEFT: Logo */}
      <Link href="/" className="flex items-center gap-1 md:gap-2 group shrink-0">
        <span className="font-extrabold text-lg md:text-2xl tracking-tight text-white">
          Campus<span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Gigs</span>
        </span>
      </Link>
      
      {/* CENTER: Global Search Bar */}
      <div className="relative w-48 md:w-64 lg:w-80 hidden md:block shrink-0">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search creators..."
            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
      </div>
      {/* RIGHT: Navigation & Avatar */}
      <div className="flex items-center justify-end shrink-0 gap-2 md:gap-4">
         {isLoaded && isSignedIn && user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative z-50">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 text-gray-300 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                  )}
                </button>
                {/* Dropdown */}
                {showNotifications && (
                   <div className="absolute top-full mt-4 right-0 md:-right-1/2 translate-x-1/4 md:translate-x-0 w-[85vw] md:w-80 bg-[#020617]/95 backdrop-blur-3xl border border-neon-cyan/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.6)] p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto z-50">
                     <h3 className="text-white font-bold text-xs tracking-widest border-b border-white/10 pb-2">PENDING GIGS</h3>
                     {notifications.length === 0 ? (
                       <p className="text-gray-500 text-xs italic">No immediate signals.</p>
                     ) : (
                       notifications.map(n => (
                         <div key={n.id} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:border-neon-cyan/50 transition-colors">
                           <p className="text-[10px] text-neon-cyan font-bold uppercase mb-1 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">New Assignment</p>
                           <p className="text-sm text-white font-semibold line-clamp-2 leading-tight">{n.title}</p>
                           <p className="text-[10px] text-gray-400 mt-2 font-mono">EST. BUDGET: {n.budget} INR</p>
                         </div>
                       ))
                     )}
                   </div>
                )}
              </div>

            <Link 
              href="/profile/me" 
              className="flex items-center gap-2 md:gap-3 bg-[#020617]/80 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/50 p-1 md:p-1.5 pr-3 md:pr-5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all glass-panel"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-neon-cyan/50 shrink-0">
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[8px] md:text-[9px] text-neon-cyan font-bold uppercase tracking-widest leading-none mb-0.5">Creator</span>
                <span className="text-[10px] md:text-xs font-extrabold text-white leading-none whitespace-nowrap">Your Profile</span>
              </div>
            </Link>
            </>
         ) : (
            <div className="flex items-center min-h-[32px]">
              <Link href="/sign-in" className="text-xs md:text-sm font-bold text-black hover:text-white transition-colors bg-neon-cyan px-4 md:px-5 py-1.5 md:py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0">Sign In</Link>
            </div>
         )}
      </div>
    </div>
    </div>
  );
}
