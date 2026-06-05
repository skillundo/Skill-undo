"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth, db, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/input";
import { Loader2, User, Upload } from "lucide-react";
import { UserProfile } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user && auth.currentUser) {
      setSaving(true);
      try {
        const fileRef = ref(storage, `avatars/${user.uid}`);
        
        const uploadTask = async () => {
          const snapshot = await uploadBytes(fileRef, file);
          return await getDownloadURL(snapshot.ref);
        };

        const downloadURL = await Promise.race([
          uploadTask(),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Storage connection timed out. Please ensure you have clicked 'Get Started' under Storage in your Firebase Console.")), 15000))
        ]);
        
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        setUser({ ...user, photoURL: downloadURL });
        setProfile(prev => prev ? { ...prev, avatarUrl: downloadURL } : { avatarUrl: downloadURL });
        
        alert("Profile photo uploaded successfully!");
      } catch (err: unknown) {
        console.error("Error uploading photo:", err);
        alert("Failed to upload photo: " + ((err as Error).message || "Unknown error"));
      } finally {
        setSaving(false);
      }
    }
  };

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Partial<UserProfile>);
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
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
      const docRef = doc(db, "users", user.uid);
      
      // Add a 10-second timeout to prevent infinite hanging if Firestore isn't created
      await Promise.race([
        setDoc(docRef, profile, { merge: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timed out. Please ensure you have clicked 'Create Database' under Firestore Database in your Firebase Console.")), 10000))
      ]);
      
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile: " + ((err as Error).message || "Unknown error"));
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
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b">
              <Avatar className="h-24 w-24 border border-border">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-[#DFE5E7] dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[120%] w-[120%] text-white dark:text-gray-600 mt-6">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">We recommend an image of at least 300x300. Gifs work too.</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </button>
              </div>
            </div>

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
