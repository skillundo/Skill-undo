"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { mockFirestore } from "@/lib/firebase";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/lib/mock-data";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const data = await mockFirestore.getUserProfile(user.uid);
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      await mockFirestore.saveUserProfile(user.uid, profile);
      // Show success toast or message here in a real app
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 bg-black/[0.01] dark:bg-white/[0.01] min-h-screen">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground mt-2">Update your personal details and seller information.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-8 bg-white dark:bg-black p-8 rounded-2xl border border-border/50">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input 
                    value={profile?.username || ""} 
                    onChange={e => setProfile({...profile, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">College</label>
                  <Input 
                    value={profile?.college || ""} 
                    onChange={e => setProfile({...profile, college: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Locality</label>
                  <Input 
                    value={profile?.locality || ""} 
                    onChange={e => setProfile({...profile, locality: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-xl font-semibold">Seller Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills (comma separated)</label>
                  <Input 
                    value={profile?.skills?.join(", ") || ""} 
                    onChange={e => setProfile({
                      ...profile, 
                      skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Portfolio Links</label>
                  <Input 
                    value={profile?.portfolio?.join(", ") || ""} 
                    onChange={e => setProfile({
                      ...profile, 
                      portfolio: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="https://github.com/me, https://behance.net/me"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
