"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { mockFirebaseAuth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await mockFirebaseAuth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tighter">SKILLUNDO</Link>
          <div className="relative hidden w-64 md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills, users..."
              className="w-full rounded-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-black dark:bg-white"></span>
              </button>
              
              <div className="flex items-center gap-4 border-l border-border pl-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium leading-none">{user.displayName}</span>
                  <span className="text-xs text-muted-foreground">Balance: ₹0</span>
                </div>
                
                <Link href="/profile">
                  <Avatar className="h-9 w-9 border border-border cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName || "User"} />
                    <AvatarFallback className="font-bold bg-black text-white dark:bg-white dark:text-black">
                      {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/auth"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
