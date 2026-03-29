'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Briefcase, MapPin, Edit2, X, Check, LogOut, Upload, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import { supabase, type PortfolioItem, type Profile } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const decodedUsername = decodeURIComponent(username).toLowerCase();
  
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editAnonymous, setEditAnonymous] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Portfolio Modal State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', demo_url: '' });

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', decodedUsername)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setEditName(data.full_name || '');
        setEditSkills((data.skills || []).join(', '));
        setEditAnonymous(data.is_anonymous || false);

        // Fetch Portfolio
        const { data: portfolioData } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('profile_id', data.id)
          .order('created_at', { ascending: false });
          
        if (portfolioData) {
          setPortfolioItems(portfolioData);
        }
      }
      setIsLoading(false);
    };

    fetchProfileData();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAvatarUpload = async (e: any) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      setIsUploadingAvatar(true);
      
      // Bucket Verification
      const { error: bucketError } = await supabase.storage.getBucket('avatars');
      if (bucketError) {
        throw new Error("Bucket 'avatars' not found. Please create it in your Supabase Dashboard.");
      }
      
      // Upload to Supabase Storage with Timestamp Name (Cache-Busting)
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update Database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;
      
      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Avatar visibly upgraded!', { style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }});
      
    } catch (error: unknown) {
      toast.error('Failed to upload image', { 
        description: error instanceof Error ? error.message : 'Unknown error',
        style: { boxShadow: '0 0 20px rgba(219, 39, 119, 0.4)' }
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSavePortfolio = async () => {
    if (!newProject.title) {
      toast.error('Gotta name your masterpiece!');
      return;
    }
    
    setIsSaving(true);
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([{
        profile_id: profile.id,
        title: newProject.title,
        description: newProject.description,
        demo_url: newProject.demo_url
      }])
      .select();

    setIsSaving(false);

    if (error) {
      toast.error('Failed to add project', { description: error.message });
    } else if (data) {
      setPortfolioItems([data[0], ...portfolioItems]);
      setShowPortfolioModal(false);
      setNewProject({ title: '', description: '', demo_url: '' });
      toast.success('Project added to your legend!', { style: { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }});
    }
  };

  const displayName = profile.is_anonymous ? `@${profile.username}` : (profile.full_name || `@${profile.username}`);

  return (
    <div className="flex flex-col items-center gap-12 mt-12 animate-fade-in pb-20 px-4 md:px-0 relative">
      
      {/* Glass Showcase Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl glass-panel bg-[#020617]/50 backdrop-blur-xl p-6 md:p-12 border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-500 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-neon-cyan/20 transition-colors duration-500" />
        
        {/* Action Buttons Top Right */}
        {isOwner && !isEditing && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-3 z-20">
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

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10 w-full mt-12 md:mt-4">
          <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 ${isUploadingAvatar ? 'animate-pulse border-neon-cyan shadow-[0_0_30px_rgba(6,182,212,0.8)]' : 'border-neon-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]'} bg-[#0f172a] flex items-center justify-center overflow-hidden flex-shrink-0 animate-float group/avatar`}>
             {profile.avatar_url || (isOwner && user?.imageUrl) ? (
               <img src={profile.avatar_url || user?.imageUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="text-4xl md:text-5xl text-neon-cyan font-bold">{profile.username.charAt(0).toUpperCase()}</div>
             )}
             
             {/* Upload Overlay */}
             {(isEditing || isOwner) && (
               <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer z-10">
                 {isUploadingAvatar ? (
                   <div className="w-6 h-6 border-2 border-t-neon-cyan rounded-full animate-spin" />
                 ) : (
                   <>
                     <Upload className="w-6 h-6 text-white mb-1" />
                     <span className="text-[10px] font-bold text-white tracking-wider">EDIT IMAGE</span>
                   </>
                 )}
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={handleAvatarUpload}
                   disabled={isUploadingAvatar}
                 />
               </label>
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
                <div className="flex flex-col items-center md:items-start w-full">
                  <h1 className="text-2xl md:text-5xl font-extrabold text-white tracking-tight text-center md:text-left">{displayName}</h1>
                  {!profile.is_anonymous && (
                    <div className="flex flex-col mt-2 items-center md:items-start w-full">
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
                 
                 <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <label className="text-sm text-gray-400 font-bold tracking-wider">MY PORTFOLIO & EXPERIENCE</label>
                     <button
                       onClick={() => setShowPortfolioModal(true)}
                       className="flex items-center gap-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                     >
                       <Plus className="w-4 h-4" />
                       Add New Project
                     </button>
                   </div>
                   {portfolioItems.length > 0 ? (
                     <p className="text-xs text-gray-500 italic">You have {portfolioItems.length} projects linked to your profile.</p>
                   ) : (
                     <p className="text-xs text-gray-500 italic">No projects added yet.</p>
                   )}
                 </div>
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
                    <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-neon-violet drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"/> {portfolioItems.length} Projects Showcase</div>
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
        {portfolioItems.length === 0 ? (
          <div className="text-gray-500 italic w-full text-center py-10 glass-panel border border-white/5">
            No epic feats recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {portfolioItems.map((item) => (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    whileHover={{ y: -8 }}
                    className="glass-panel aspect-video rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden relative group cursor-pointer flex flex-col items-center justify-center"
                 >
                   <ImageIcon className="w-12 h-12 text-white/20 group-hover:text-neon-cyan/50 transition-colors duration-300" />
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617]/90 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-bold text-white truncate">{item.title}</p>
                      {item.description && <p className="text-xs text-gray-300 truncate mt-1">{item.description}</p>}
                      {item.demo_url ? (
                        <a href={item.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-cyan mt-2 font-medium inline-block hover:text-white transition-colors">
                          View details &gt;
                        </a>
                      ) : (
                        <p className="text-xs text-neon-cyan/50 mt-2 font-medium italic">No link provided</p>
                      )}
                   </div>
                 </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showPortfolioModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] relative"
            >
              <button 
                onClick={() => setShowPortfolioModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">PROJECT TITLE *</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    placeholder="e.g. CampusGigs Redesign"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">SHORT DESCRIPTION</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    rows={3}
                    placeholder="Briefly describe what you built..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold tracking-wider mb-2 block">DEMO LINK (OPTIONAL)</label>
                  <input
                    type="url"
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSavePortfolio}
                  disabled={isSaving}
                  className="bg-neon-cyan hover:bg-white text-black font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
