import { UserProfile } from "./mock-data";

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mocked Auth User Type
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

// In-memory store for mock session
let currentUser: AuthUser | null = null;
// In-memory store for user profiles
const profiles = new Map<string, Partial<UserProfile>>();

export const mockFirebaseAuth = {
  signInWithEmail: async (email: string, password: string): Promise<AuthUser> => {
    await delay(800);
    const user = {
      uid: "mock-uid-123",
      email,
      displayName: email.split("@")[0],
      photoURL: "https://i.pravatar.cc/150?u=mock",
    };
    currentUser = user;
    return user;
  },
  
  signInWithGoogle: async (): Promise<AuthUser> => {
    await delay(1000);
    const user = {
      uid: "mock-uid-google-456",
      email: "student@college.edu",
      displayName: "Google User",
      photoURL: "https://i.pravatar.cc/150?u=google",
    };
    currentUser = user;
    return user;
  },

  signUp: async (email: string, password: string): Promise<AuthUser> => {
    await delay(1000);
    const user = {
      uid: "mock-uid-new-" + Math.random().toString(36).substring(7),
      email,
      displayName: email.split("@")[0],
      photoURL: null,
    };
    currentUser = user;
    return user;
  },

  signOut: async (): Promise<void> => {
    await delay(500);
    currentUser = null;
  },

  getCurrentUser: (): AuthUser | null => {
    return currentUser;
  },
};

export const mockFirestore = {
  getUserProfile: async (uid: string): Promise<Partial<UserProfile> | null> => {
    await delay(500);
    return profiles.get(uid) || null;
  },

  saveUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await delay(800);
    const existing = profiles.get(uid) || {};
    profiles.set(uid, { ...existing, ...data });
  },
};
