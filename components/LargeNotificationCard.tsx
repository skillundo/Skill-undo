'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Calendar, Check, X } from 'lucide-react';
import { supabase, type Task } from '@/lib/supabase';
import { toast } from 'sonner';

interface LargeNotificationCardProps {
  task: Task;
  onDismiss: () => void;
}

export function LargeNotificationCard({ task, onDismiss }: LargeNotificationCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'accepted' })
        .eq('id', task.id);

      if (error) throw error;
      
      setIsAccepted(true);
      // Wait for exit animation to complete before unmounting
      setTimeout(() => {
        onDismiss();
      }, 1500); 
    } catch (e: unknown) {
      setIsAccepting(false);
      toast.error('Failed to sync signal: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const handleDecline = async () => {
    // Optionally update status to 'declined'
    try {
        await supabase.from('tasks').update({ status: 'open' }).eq('id', task.id);
    } catch (error) {
       console.error("Failed to decline task:", error);
    }
    onDismiss();
  };

  const formattedDeadline = new Date(task.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      {!isAccepted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.4 } }}
          className="relative w-full overflow-hidden bg-slate-950/50 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.1)] p-6 md:p-8 flex flex-col gap-6 group"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
             <motion.p 
               animate={{ opacity: [0.5, 1, 0.5] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="text-[10px] md:text-xs font-bold text-cyan-400 tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"
             >
               New Mission Signal Detected
             </motion.p>
             <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-white to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
               {task.title}
             </h2>
          </div>

          {/* Description Block */}
          {task.category && (
             <div className="relative z-10 bg-white/5 border border-white/5 p-4 rounded-xl text-center">
               <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                 Assignment classified under <span className="text-neon-cyan font-bold">[{task.category}]</span> protocols.
               </p>
             </div>
          )}

          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-4 relative z-10 w-full mt-2">
            <div className="flex flex-col items-center justify-center bg-[#020617]/60 border border-cyan-500/20 py-4 rounded-xl gap-2 shadow-inner">
               <IndianRupee className="w-8 h-8 text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
               <div className="text-center">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Est. Budget</p>
                 <p className="text-xl font-black text-white font-mono">₹{task.budget}</p>
               </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#020617]/60 border border-white/10 py-4 rounded-xl gap-2">
               <Calendar className="w-8 h-8 text-gray-400" />
               <div className="text-center">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Expiration</p>
                 <p className="text-sm font-black text-white">{formattedDeadline}</p>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 relative z-10 w-full mt-4">
             <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold py-4 rounded-xl text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {isAccepting ? (
                  <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-6 h-6" /> ACCEPT MISSION
                  </>
                )}
             </button>
             <button
                onClick={handleDecline}
                disabled={isAccepting}
                className="w-full bg-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
             >
                <X className="w-4 h-4" /> DECLINE
             </button>
          </div>
        </motion.div>
      )}

      {/* Ripple Animation Overlay */}
      {isAccepted && (
        <motion.div
           initial={{ scale: 0, opacity: 1 }}
           animate={{ scale: 5, opacity: 0 }}
           transition={{ duration: 1, ease: 'easeOut' }}
           className="absolute z-50 w-full aspect-square bg-cyan-500/40 rounded-full"
           style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      )}
    </AnimatePresence>
  );
}
