"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function MySkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!user) return;
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });
          
        if (data && !error) {
          setSkills(data.map((s: any) => ({
            id: s.id,
            title: s.title,
            category: s.category,
            status: s.status, // "active", "paused", "draft"
            imageUrl: s.image_url,
            views: 0,
            orders: 0,
            earned: 0,
            rating: 0
          })));
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [user]);

  const counts = {
    All: skills.length,
    Active: skills.filter(s => s.status === "active").length,
    Paused: skills.filter(s => s.status === "paused").length,
    Draft: skills.filter(s => s.status === "draft").length,
  };

  const filteredSkills = skills.filter(s => activeTab === "All" || s.status === activeTab.toLowerCase());

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await supabase.from('skills').update({ status: newStatus }).eq('id', id);
    setSkills(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await supabase.from('skills').delete().eq('id', id);
      setSkills(prev => prev.filter(s => s.id !== id));
    }
  };

  if (isLoading) {
    return <div className="w-full px-6 py-8">Loading skills...</div>;
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-end gap-3">
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <span className="text-sm font-semibold text-muted-foreground pb-1">{counts.All} total</span>
        </div>
        <Link 
          href="/dashboard/list-skill"
          className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center shrink-0"
        >
          + Add New Skill
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 border-b border-border/50 mb-8 overflow-x-auto no-scrollbar">
        {["All", "Active", "Paused", "Draft"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold tracking-wide transition-all whitespace-nowrap relative ${
              activeTab === tab 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab} ({counts[tab as keyof typeof counts]})
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full animate-in fade-in zoom-in-95 duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-border/80 transition-colors">
            
            {/* Image Area */}
            <div className="relative h-[160px] bg-zinc-900 flex items-center justify-center overflow-hidden">
              {skill.imageUrl ? (
                <img src={skill.imageUrl} alt={skill.title} className="w-full h-full object-cover opacity-80" />
              ) : (
                <ImageIcon className="h-10 w-10 text-zinc-700" />
              )}
              
              {/* Category Badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 backdrop-blur-md bg-black/40 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm`}>
                {skill.category}
              </div>

              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md text-white ${
                skill.status === 'active' ? 'bg-green-500/80' : 
                skill.status === 'paused' ? 'bg-zinc-500/80' : 
                'bg-amber-500/80'
              }`}>
                {skill.status}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-base leading-snug line-clamp-2 mb-4 h-[42px]">
                {skill.title}
              </h3>

              {skill.status === "draft" ? (
                <Link href="/dashboard/list-skill" className="text-sm font-bold text-amber-500 hover:underline mb-1">
                  Complete setup &rarr;
                </Link>
              ) : (
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 mb-2">
                  <span>👁 {skill.views} views</span>
                  <span>·</span>
                  <span>📦 {skill.orders} orders</span>
                  <span>·</span>
                  <span>⭐ {skill.rating ? skill.rating.toFixed(1) : "—"} rating</span>
                </div>
              )}
              
              <div className="text-sm font-semibold text-muted-foreground mt-auto">
                ₹{skill.earned} earned
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-border/50 grid grid-cols-3 bg-muted/10 divide-x divide-border/50">
              <Link href="/dashboard/list-skill" className="p-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </Link>
              
              {skill.status !== "draft" ? (
                <button 
                  onClick={() => handleToggle(skill.id, skill.status)}
                  className={`p-3 flex items-center justify-center gap-2 text-xs font-bold transition-colors hover:bg-muted/30 ${
                    skill.status === 'active' ? 'text-amber-500 hover:text-amber-600' : 'text-green-500 hover:text-green-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {skill.status === 'active' ? (
                      <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>
                    ) : (
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    )}
                  </svg>
                  {skill.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              ) : (
                <div className="p-3 flex items-center justify-center" />
              )}
              
              <button 
                onClick={() => handleDelete(skill.id)}
                className="p-3 flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>

          </div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">No skills found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              You don't have any skills matching this filter.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
