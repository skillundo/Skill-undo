'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { supabase, type Task } from '@/lib/supabase';
import { LargeNotificationCard } from '@/components/LargeNotificationCard';
import { toast } from 'sonner';

export function NotificationCenter() {
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Task[]>([]);

  // 1. Receiver Logic: Fetching pending tasks & listening for new assignments
  useEffect(() => {
    if (!user?.id) return;

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
    
    const receiverChannel = supabase.channel('tasks-receiver')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks', filter: `assigned_to=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new as Task, ...prev]);
        toast('Incoming Mission Signal Detected!', { 
          style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)', border: '1px solid #06b6d4' }
        });
      })
      .subscribe();
      
    return () => { supabase.removeChannel(receiverChannel); };
  }, [user?.id]);

  // 2. Sender Logic: The Handshake loop 
  // Listening for tasks the user posted that got accepted
  useEffect(() => {
    if (!user?.id) return;

    const senderChannel = supabase.channel('tasks-sender')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `posted_by=eq.${user.id}` }, (payload) => {
        const oldTask = payload.old as Task;
        const newTask = payload.new as Task;
        
        // Trigger if 'status' transitions to 'accepted'
        // Fallback for cases where old record isn't fully cached by realtime
        if ((!oldTask.status || oldTask.status === 'open' || oldTask.status === 'pending') && newTask.status === 'accepted') {
           toast.success('SIGNAL LOCKED! The creator has accepted your assignment. Mission is now Active.', {
             style: { 
               boxShadow: '0 0 30px rgba(6, 182, 212, 0.8)', 
               border: '2px solid #06b6d4', 
               background: 'rgba(2, 6, 23, 0.9)', 
               color: '#fff',
               fontSize: '1rem',
               padding: '1rem' 
             },
             duration: 6000
           });

           // Momentary Fullscreen Cyber Blur pulse via body class (Optional VFX)
           if (typeof document !== 'undefined') {
             const vfxOverlay = document.createElement('div');
             vfxOverlay.className = 'fixed inset-0 z-[9999] bg-cyan-500/20 backdrop-blur-sm pointer-events-none transition-all duration-700 ease-out';
             document.body.appendChild(vfxOverlay);
             
             // Trigger fade out
             requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                   vfxOverlay.style.opacity = '0';
                });
             });
             
             setTimeout(() => {
                vfxOverlay.remove();
             }, 800);
           }
        }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(senderChannel); };
  }, [user?.id]);

  const handleDismiss = (taskId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== taskId));
  };

  return (
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
         <div className="absolute top-full mt-4 right-0 md:-right-1/2 translate-x-1/4 md:translate-x-0 w-[90vw] md:w-[400px] bg-[#020617]/95 backdrop-blur-3xl border border-neon-cyan/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.6)] p-0 flex flex-col max-h-[85vh] overflow-y-auto overflow-x-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
           <div className="sticky top-0 bg-[#020617]/90 backdrop-blur-md border-b border-white/10 p-4 z-20 flex items-center justify-between">
             <h3 className="text-white font-bold text-xs tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">PENDING SIGNALS</h3>
             <span className="text-[10px] bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
           </div>
           
           <div className="p-4 flex flex-col gap-4">
             {notifications.length === 0 ? (
               <div className="text-center py-8">
                  <p className="text-gray-500 text-sm italic font-medium">No immediate signals detected.</p>
               </div>
             ) : (
               notifications.map(n => (
                 <LargeNotificationCard 
                   key={n.id} 
                   task={n} 
                   onDismiss={() => handleDismiss(n.id)} 
                 />
               ))
             )}
           </div>
         </div>
      )}
    </div>
  );
}
