'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase, type Profile } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

interface AssignWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Profile;
}

export function AssignWorkModal({ isOpen, onClose, creator }: AssignWorkModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    budget: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to assign work');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('tasks').insert([
        {
          title: `${formData.title} | Brief: ${formData.brief}`,
          budget: parseFloat(formData.budget),
          deadline: new Date(formData.deadline).toISOString(),
          category: creator.skills && creator.skills.length > 0 ? creator.skills[0] : 'General Freelance',
          status: 'pending',
          posted_by: user.id,
          assigned_to: creator.id
        }
      ]);

      if (error) {
        throw error;
      }

      toast.success('Signal Sent! Assignment created.', { style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }});
      onClose();
      setFormData({ title: '', brief: '', budget: '', deadline: '' });
    } catch (err: any) {
      console.error("Assignment Error:", err);
      
      let errorMsg = 'Unknown error occurred.';
      if (err?.code === '23503') {
        errorMsg = 'Your account must be fully registered in the database before you can assign gigs. Please edit your profile first!';
      } else if (err?.message || err?.details) {
        errorMsg = err.message || err.details;
      } else if (typeof err === 'string') {
        errorMsg = err;
      } else {
        errorMsg = JSON.stringify(err);
      }

      toast.error('Signal Intercepted', { 
        description: errorMsg,
        style: { boxShadow: '0 0 20px rgba(219, 39, 119, 0.4)' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-xl p-4 cursor-default">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#020617] border border-neon-cyan/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-y-auto max-h-[85vh] scrollbar-hide group shrink-0 my-auto"
          onClick={(e) => e.stopPropagation()} // Prevent bubbling from card wrapper
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-neon-cyan/20 transition-colors z-10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <span className="text-neon-cyan">Project</span> Assignment
            </h2>
            <p className="text-gray-400 text-sm mt-1">Assigning a gig to @{creator.username}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <div>
              <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">GIG TITLE *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all hover:border-white/30"
                placeholder="e.g., Build a modern landing page"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">PROJECT BRIEF *</label>
              <textarea
                required
                value={formData.brief}
                onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all hover:border-white/30"
                rows={3}
                placeholder="Describe the main objectives and scope..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">BUDGET (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all hover:border-white/30"
                  placeholder="e.g., 5000"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">DEADLINE *</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all hover:border-white/30 [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-white hover:to-white text-black font-extrabold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    Send Signal
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
