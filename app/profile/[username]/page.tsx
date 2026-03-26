'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Briefcase, MapPin, Edit2, X, Check, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const decodedUsername = decodeURIComponent(username).toLowerCase();
  
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editAnonymous, setEditAnonymous] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', decodedUsername)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setEditName(data.full_name || '');
        setEditSkills((data.skills || []).join(', '));
        setEditAnonymous(data.is_anonymous || false);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [decodedUsername]);

  // Deep-link into Edit Mode
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded && user && profile && user.id === profile.id) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setIsEditing(true);
      }
    }
  }, [isLoaded, user, profile]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-32">
        <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center mt-32 animate-fade-in text-center px-4">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">404</h1>
        <p className="text-gray-400 text-lg">Creator <span className="text-neon-cyan">@{decodedUsername}</span> not found in our elite database.</p>
      </div>
    );
  }

  const isOwner = isLoaded && user && user.id === profile.id;

  const handleSave = async () => {
    setIsSaving(true);
    const updatedSkills = editSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editName,
        skills: updatedSkills,
        is_anonymous: editAnonymous
      })
      .eq('id', profile.id);

    setIsSaving(false);

    if (error) {
       toast.error('Failed to save profile', { description: error.message });
    } else {
       toast.success('Profile visually upgraded!', { style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }});
       setProfile({ ...profile, full_name: editName, skills: updatedSkills, is_anonymous: editAnonymous });
       setIsEditing(false);
    }
  };

  const displayName = profile.is_anonymous ? `@${profile.username}` : (profile.full_name || `@${profile.username}`);

  return (
    <div className="flex flex-col items-center gap-12 mt-12 animate-fade-in pb-20 px-4 md:px-0">
      
      {/* Glass Showcase Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl glass-panel bg-[#020617]/50 backdrop-blur-xl p-8 md:p-12 border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-500 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-neon-cyan/20 transition-colors duration-500" />
        
        {/* Action Buttons Top Right */}
        {isOwner && !isEditing && (
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <button 
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-violet/20 hover:border-neon-violet/50 hover:text-neon-violet text-gray-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:text-neon-cyan text-gray-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              title="Edit Profile"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10 w-full mt-10 md:mt-4">
          <div className="w-32 h-32 rounded-full border-2 border-neon-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-[#0f172a] flex items-center justify-center overflow-hidden flex-shrink-0 animate-float">
             {isOwner && user?.imageUrl ? (
               <img src={user.imageUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="text-5xl text-neon-cyan font-bold">{profile.username.charAt(0).toUpperCase()}</div>
             )}
          </div>
          
          <div className="flex-1 text-center md:text-left flex flex-col gap-4 w-full">
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between w-full">
              {isEditing ? (
                 <div className="flex flex-col gap-3 w-full max-w-md">
                   <input
                     type="text"
                     value={editName}
                     onChange={(e) => setEditName(e.target.value)}
                     placeholder="Your Full Name"
                     className="w-full bg-black/40 border border-neon-cyan/50 rounded-lg px-4 py-2 text-white font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                   />
                   <p className="text-neon-cyan font-semibold text-lg drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">@{profile.username} (Immutable)</p>
                 </div>
              ) : (
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{displayName}</h1>
                  {!profile.is_anonymous && (
                    <div className="flex flex-col mt-2">
                       <p className="text-neon-cyan font-semibold text-lg tracking-wide drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">@{profile.username}</p>
                       {isOwner && user?.primaryEmailAddress && (
                         <p className="text-gray-400 text-sm mt-1">{user.primaryEmailAddress.emailAddress}</p>
                       )}
                    </div>
                  )}
                </div>
              )}
              
              {!isEditing && profile.top_rated && (
                 <div className="flex items-center gap-2 bg-gradient-to-r from-neon-violet to-neon-cyan px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] mx-auto md:mx-0 shrink-0">
                   <Sparkles className="w-4 h-4 text-white" />
                   <span className="text-sm font-bold text-white tracking-wide">Top Rated</span>
                 </div>
              )}
            </div>

            {/* Editing Skills vs Displaying Skills */}
            {isEditing ? (
               <div className="mt-4 flex flex-col gap-2">
                 <label className="text-sm text-gray-400 font-bold tracking-wider">SKILLS (COMMA SEPARATED)</label>
                 <textarea
                   value={editSkills}
                   onChange={(e) => setEditSkills(e.target.value)}
                   className="w-full max-w-lg bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                   rows={2}
                   placeholder="React, Figma, Next.js..."
                 />
               </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start min-h-[30px]">
                {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-1.5 rounded-full text-xs font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    {skill}
                  </span>
                )) : (
                  <span className="text-gray-500 text-sm italic">No skills listed yet.</span>
                )}
              </div>
            )}
            
            {/* View Stats / Anonymity Setting */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-6">
               {!isEditing && (
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400 font-medium w-full">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"/> Creative Hub</div>
                    <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-neon-violet drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"/> 24 Gigs Completed</div>
                 </div>
               )}

               {(isOwner || isEditing) && (
                 <label className="flex items-center cursor-pointer gap-3 group shrink-0">
                   <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">ANONYMOUS MODE</span>
                   <div className="relative">
                     <input 
                       type="checkbox" 
                       className="sr-only" 
                       checked={isEditing ? editAnonymous : profile.is_anonymous} 
                       onChange={(e) => isEditing && setEditAnonymous(e.target.checked)} 
                       disabled={!isEditing}
                     />
                     <div className={`block w-12 h-6 rounded-full transition-colors ${
                        (isEditing ? editAnonymous : profile.is_anonymous) 
                        ? 'bg-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                        : 'bg-white/10 border border-white/20'
                     }`}></div>
                     <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        (isEditing ? editAnonymous : profile.is_anonymous) ? 'transform translate-x-6' : ''
                     }`}></div>
                   </div>
                 </label>
               )}
            </div>

            {/* Save Button Group */}
            {isEditing && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-neon-cyan hover:bg-white text-black font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Portfolio Space */}
      <div className="w-full max-w-4xl px-4 md:px-0 mt-4">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="text-neon-violet drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]" />
          Featured Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((item) => (
             <motion.div 
                key={item} 
                whileHover={{ y: -8 }}
                className="glass-panel aspect-video rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden relative group cursor-pointer flex flex-col items-center justify-center"
             >
               <ImageIcon className="w-12 h-12 text-white/20 group-hover:text-neon-cyan/50 transition-colors duration-300" />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617]/90 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-bold text-white">Project Case Study {item}</p>
                  <p className="text-xs text-neon-cyan mt-1 font-medium">View details &gt;</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
