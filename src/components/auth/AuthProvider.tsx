"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  isProfileComplete: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  checkProfileCompleteness: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/auth"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkProfileCompleteness = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('firebase_uid', uid)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

      const isComplete = !!data?.username;
      setIsProfileComplete(isComplete);
      
      if (isComplete) {
        localStorage.setItem(`profile_complete_${uid}`, "true");
      } else {
        localStorage.removeItem(`profile_complete_${uid}`);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const authUser: AuthUser = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        setUserState(authUser);
        
        const localComplete = localStorage.getItem(`profile_complete_${currentUser.uid}`) === "true";
        if (localComplete) {
          setIsProfileComplete(true);
        } else {
          await checkProfileCompleteness(currentUser.uid);
        }
      } else {
        setUserState(null);
        setIsProfileComplete(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (!newUser) {
      signOut(auth).catch(console.error);
      setIsProfileComplete(false);
    }
  };

  // Route guarding
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push("/auth");
    } else if (user) {
      if (!isProfileComplete && pathname !== "/onboarding" && pathname !== "/") {
        router.push("/onboarding");
      } else if (isProfileComplete && (pathname === "/auth" || pathname === "/onboarding")) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, isProfileComplete, router]);

  return (
    <AuthContext.Provider value={{ user, isProfileComplete, loading, setUser, checkProfileCompleteness }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
