"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Compass, MessageSquare, PlusSquare, MoreHorizontal, LogOut, User, Settings, LayoutDashboard, Layers, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/dashboard" },
    { icon: Search, label: "Search", href: "#search", isAction: true },
    { icon: Compass, label: "Explore", href: "/dashboard" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 2 },
    { icon: Layers, label: "My Skills", href: "/dashboard/my-skills" },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border flex flex-row items-center justify-around px-2 lg:px-0 lg:top-0 lg:h-screen lg:w-64 lg:border-r lg:border-t-0 lg:flex-col lg:items-stretch lg:justify-start">
      
      {/* Desktop Logo Area (Hidden on Mobile) */}
      <div className="hidden lg:flex h-20 items-center px-6 pt-4 mb-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter">SKILLUNDO</span>
        </Link>
      </div>

      {/* Prominent CTA (Hidden on Mobile) */}
      <div className="hidden lg:block px-4 mb-6">
        <Link 
          href="/dashboard/list-skill" 
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg group"
        >
          <PlusSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-bold">List a Skill</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-row items-center justify-around w-full lg:flex-col lg:flex-1 lg:items-stretch lg:px-3 lg:space-y-2 lg:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          const content = (
            <>
              {/* Icon Container */}
              <div className="relative flex items-center justify-center">
                <Icon className={`h-6 w-6 group-hover:scale-105 transition-transform ${(item.isAction ? showSearch : isActive && !showSearch) ? "fill-foreground/10 stroke-[2.5]" : "stroke-[2]"}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 lg:hidden bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Desktop Text + Badge */}
              <div className="hidden lg:flex flex-1 items-center justify-between min-w-0">
                <span className="text-base font-medium truncate mr-2">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
            </>
          );
          
          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Search") setShowSearch(!showSearch);
                }}
                className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 p-2 lg:p-3 rounded-xl transition-colors text-foreground/80 hover:text-foreground group ${showSearch && item.label === "Search" ? "text-foreground lg:bg-muted/80" : "lg:hover:bg-muted/80"}`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowSearch(false)}
              className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 p-2 lg:p-3 rounded-xl transition-colors group relative ${
                isActive && !showSearch
                  ? "text-foreground lg:font-bold" 
                  : "text-foreground/80 hover:text-foreground lg:hover:bg-muted/80"
              }`}
            >
              {content}
            </Link>
          );
        })}

        {/* Mobile Profile Icon */}
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="lg:hidden flex flex-col items-center justify-center p-2 rounded-xl text-foreground/80 hover:text-foreground"
        >
          <Avatar className="h-7 w-7 border border-border">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
            <AvatarFallback className="bg-muted flex items-center justify-center text-[10px]">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </nav>

      {/* Slide-out Search Pane */}
      {showSearch && (
        <>
          {/* Overlay to catch clicks outside */}
          <div 
            className="fixed inset-0 z-20 bg-black/20 lg:bg-transparent"
            onClick={() => setShowSearch(false)}
          />
          <div className="absolute bottom-16 lg:bottom-auto lg:top-0 left-0 lg:left-full h-[50vh] lg:h-screen w-full lg:w-80 bg-background border-t lg:border-t-0 lg:border-r border-border z-30 shadow-2xl animate-in slide-in-from-bottom-8 lg:slide-in-from-left-8 fade-in-20">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <button 
                  onClick={() => setShowSearch(false)}
                  className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl lg:text-2xl font-bold">Search</h2>
              </div>
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
        </>
      )}

      {/* Profile Management Section (Desktop) / Mobile Menu Overlay */}
      <div className={`relative lg:p-4 lg:mt-auto lg:border-t lg:border-border/50 ${showProfileMenu ? 'block' : 'hidden lg:block'}`}>
        {showProfileMenu && (
          <div className="absolute bottom-full right-4 lg:right-auto lg:left-4 mb-4 lg:mb-2 w-56 bg-card border border-border rounded-xl shadow-lg p-2 z-50 animate-in slide-in-from-bottom-2 fade-in-20">
            <Link href="/dashboard/profile" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/80 text-sm font-medium transition-colors">
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
        
        {/* Desktop Profile Button */}
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="hidden lg:flex w-full items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-colors"
        >
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
            <AvatarFallback className="bg-muted flex items-center justify-center">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-sm font-semibold truncate leading-tight">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}
