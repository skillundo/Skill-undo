'use client';

import { motion } from 'framer-motion';
import { Calendar, IndianRupee, Tag } from 'lucide-react';
import type { Task } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface TaskCardProps {
  task: Task;
  onAccept?: () => void;
}

export function TaskCard({ task, onAccept }: TaskCardProps) {
  const handleAccept = async () => {
    // Current user id from Auth in a real app
    const currentUserId = 'student_dummy_123'; 
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'assigned', assigned_to: currentUserId })
        .eq('id', task.id);

      if (error) throw error;
      
      toast.success('Task successfully accepted!', {
        description: `You are now assigned to: ${task.title}`,
        style: {
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
        }
      });
      
      if (onAccept) onAccept();
    } catch (error) {
      toast.error('Failed to accept task', { description: (error as Error).message });
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
        task.status === 'assigned' ? 'opacity-70 grayscale-[30%]' : ''
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-violet opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white tracking-wide line-clamp-2">{task.title}</h3>
        <div className="flex items-center text-neon-cyan font-semibold bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">
          <IndianRupee className="w-4 h-4 mr-1" />
          {task.budget}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-300">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 opacity-70" />
          {new Date(task.deadline).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-2 opacity-70 text-neon-violet" />
          <span className="text-neon-violet drop-shadow-[0_0_5px_rgba(139,92,246,0.3)]">{task.category}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <span className="text-xs text-gray-400">
          {task.status === 'open' ? '🟢 Open' : '🔴 Assigned'}
        </span>
        {task.status === 'open' && (
          <button 
            onClick={handleAccept}
            className="text-sm font-semibold text-black bg-neon-cyan hover:bg-white px-4 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all hover:-translate-y-1"
          >
            Accept Task
          </button>
        )}
      </div>
    </motion.div>
  );
}
