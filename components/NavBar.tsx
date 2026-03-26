'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/profile/${searchQuery.trim()}`);
    }
  };

  // Completely remove NavBar from the Landing Page for a cinematic feel
  if (pathname === '/') return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto glass-panel px-3 py-2 flex items-center justify-center gap-4 md:gap-8 rounded-full animate-float border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {/* LEFT: Logo */}
      <Link href="/" className="flex items-center gap-2 group shrink-0 pl-3">
        <span className="font-extrabold text-xl md:text-2xl tracking-tight text-white">
          Campus<span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Gigs</span>
        </span>
      </Link>
      
      {/* CENTER: Global Search Bar */}
      <div className="relative w-48 md:w-64 lg:w-80 hidden md:block shrink-0">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search creators..."
            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
      </div>
      {/* RIGHT: Navigation & Avatar */}
      <div className="flex items-center justify-end shrink-0 pr-1">
         {isLoaded && isSignedIn && user ? (
            <Link 
              href="/profile/me?edit=true" 
              className="flex items-center gap-3 bg-[#020617]/80 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/50 p-1.5 pr-5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all glass-panel"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neon-cyan/50 shrink-0">
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-neon-cyan font-bold uppercase tracking-widest leading-none mb-0.5">Edit mode</span>
                <span className="text-xs font-extrabold text-white leading-none">Your Profile</span>
              </div>
            </Link>
         ) : (
            <div className="flex items-center min-h-[32px]">
              <Link href="/sign-in" className="text-sm font-bold text-black hover:text-white transition-colors bg-neon-cyan px-5 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">Sign In</Link>
            </div>
         )}
      </div>
    </div>
  );
}
