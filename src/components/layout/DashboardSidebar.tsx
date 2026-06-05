"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Compass, MessageSquare, PlusSquare, MoreHorizontal, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { mockFirebaseAuth } from "@/lib/firebase";
import { useState } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await mockFirebaseAuth.signOut();
    setUser(null);
    router.push("/");
  };

  const navItems = [
    { icon: Search, label: "Search", href: "#search", isAction: true },
    { icon: Compass, label: "Explore", href: "/dashboard" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 2 },
    { icon: PlusSquare, label: "Create Gig", href: "/workspace/new" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 xl:w-64 border-r border-border bg-background transition-all duration-300 flex flex-col">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 pt-4 mb-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter">SKILLUNDO</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Search") setShowSearch(!showSearch);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-foreground/80 hover:text-foreground group ${showSearch && item.label === "Search" ? "font-bold text-foreground bg-muted/80" : "hover:bg-muted/80"}`}
              >
                <Icon className={`h-6 w-6 group-hover:scale-105 transition-transform ${showSearch && item.label === "Search" ? "stroke-[2.5]" : ""}`} />
                <span className="hidden xl:block text-base font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowSearch(false)}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors group relative ${
                isActive && !showSearch
                  ? "font-bold text-foreground" 
                  : "text-foreground/80 hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className={`h-6 w-6 group-hover:scale-105 transition-transform ${isActive && !showSearch ? "fill-foreground/10 stroke-[2.5]" : "stroke-[2]"}`} />
              <span className="hidden xl:block text-base">{item.label}</span>
              {item.badge && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden xl:block">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Slide-out Search Pane */}
      {showSearch && (
        <div className="absolute top-0 left-full h-screen w-80 bg-background border-r border-border z-30 shadow-2xl animate-in slide-in-from-left-8 fade-in-20">
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Search</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Search skills, people, college..." 
                className="w-full bg-muted border-none rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="h-px bg-border my-4" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Recent Filters</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium cursor-pointer hover:bg-muted/80">#Python</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium cursor-pointer hover:bg-muted/80">MIT</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium cursor-pointer hover:bg-muted/80">Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Management Section */}
      <div className="relative p-4 mt-auto border-t border-border/50">
        {showProfileMenu && (
          <div className="absolute bottom-full left-4 mb-2 w-56 bg-card border border-border rounded-xl shadow-lg p-2 z-50 animate-in slide-in-from-bottom-2 fade-in-20">
            <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/80 text-sm font-medium transition-colors">
              <User className="h-4 w-4" /> View Profile
            </Link>
            <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/80 text-sm font-medium transition-colors">
              <Settings className="h-4 w-4" /> Edit Profile
            </Link>
            <div className="h-px bg-border my-1" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-colors"
        >
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
            <AvatarFallback className="bg-muted flex items-center justify-center">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden text-left hidden xl:block">
            <p className="text-sm font-semibold truncate leading-tight">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground hidden xl:block" />
        </button>
      </div>
    </aside>
  );
}
