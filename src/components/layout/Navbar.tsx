"use client";

import { Search, Bell, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const isPublicPage = pathname === "/" || pathname === "/auth";
  const showSearchBar = pathname === "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tighter">SKILLUNDO</Link>
          {showSearchBar && (
            <div className="relative hidden w-64 md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search skills, users..."
                className="w-full rounded-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && !isPublicPage ? (
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
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-[#DFE5E7] dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[120%] w-[120%] text-white dark:text-gray-600 mt-2">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
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
          ) : user && pathname === "/" ? (
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2"
            >
              Go to Dashboard
            </Link>
          ) : !user ? (
            pathname === "/" ? (
              <div className="flex items-center gap-4">
                <a 
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
                <Link 
                  href="/auth"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            ) : !isPublicPage ? (
              <Link 
                href="/auth"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2"
              >
                Sign In
              </Link>
            ) : null
          ) : null}
        </div>
      </div>
    </nav>
  );
}
