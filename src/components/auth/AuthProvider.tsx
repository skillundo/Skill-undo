"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, mockFirestore } from "@/lib/firebase";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkProfileCompleteness = async (uid: string) => {
    try {
      const profile = await mockFirestore.getUserProfile(uid);
      const isComplete = !!(profile && profile.username && profile.skills && profile.skills.length > 0);
      setIsProfileComplete(isComplete);
      
      // Store completeness in localStorage for mock persistence
      if (isComplete) {
        localStorage.setItem(`profile_complete_${uid}`, "true");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  useEffect(() => {
    // Check mock session from localStorage
    const savedSession = localStorage.getItem("mock_session");
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession) as AuthUser;
      setUser(parsedUser);
      
      const isComplete = localStorage.getItem(`profile_complete_${parsedUser.uid}`) === "true";
      setIsProfileComplete(isComplete);
      
      if (!isComplete) {
        checkProfileCompleteness(parsedUser.uid);
      }
    }
    setLoading(false);
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("mock_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("mock_session");
      setIsProfileComplete(false);
    }
  }, [user]);

  // Route guarding
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push("/auth");
    } else if (user) {
      if (!isProfileComplete && pathname !== "/onboarding") {
        router.push("/onboarding");
      } else if (isProfileComplete && (pathname === "/auth" || pathname === "/onboarding" || pathname === "/")) {
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
