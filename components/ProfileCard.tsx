'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Profile } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { AssignWorkModal } from './AssignWorkModal';

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = user?.id === profile.id;
  const primarySkill = profile.skills && profile.skills.length > 0 ? profile.skills[0] : 'Talent';

  const displayName = profile.is_anonymous ? `@${profile.username}` : (profile.full_name || `@${profile.username}`);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-violet opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full border border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-[#0f172a] flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={`${profile.username} Avatar`} className="w-full h-full object-cover" />
          ) : (
            <div className="text-2xl text-neon-cyan font-bold">{profile.username.charAt(0).toUpperCase()}</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide truncate">{displayName}</h3>
              {!profile.is_anonymous && (
                <p className="text-sm text-neon-cyan truncate drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">@{profile.username}</p>
              )}
            </div>
            {profile.top_rated && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-neon-violet/20 to-neon-cyan/20 border border-neon-violet/30 px-2.5 py-1 rounded-full shrink-0">
                <Sparkles className="w-3 h-3 text-neon-cyan" />
                <span className="text-xs font-bold text-white tracking-wide">Top</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-2 flex flex-wrap gap-2">
        {profile.skills && profile.skills.length > 0 ? (
          profile.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="px-3 py-1 rounded-full text-[10px] font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-xs italic">No specific skills listed.</span>
        )}
        {profile.skills && profile.skills.length > 3 && (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10">
            +{profile.skills.length - 3}
          </span>
        )}
      </div>

      {/* Action */}
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        {!isOwner && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group/hire flex items-center gap-2 text-sm font-bold bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black border border-neon-cyan/50 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            Hire for {primarySkill}
          </button>
        )}
        <Link 
          href={`/profile/${profile.username}`}
          className={`group/btn flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-neon-cyan border border-white/10 hover:border-neon-cyan hover:text-black px-4 py-2 rounded-full transition-all duration-300 ${isOwner ? 'ml-auto' : ''}`}
        >
          View Profile
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover/btn:text-black transition-colors" />
        </Link>
      </div>

      <AssignWorkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        creator={profile} 
      />
    </motion.div>
  );
}
