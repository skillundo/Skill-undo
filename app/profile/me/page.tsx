'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfileMeRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchMyUsername = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();
        
      if (data && data.username) {
        const queryString = typeof window !== 'undefined' ? window.location.search : '';
        router.push(`/profile/${data.username}${queryString}`);
      } else {
        // If they don't have a profile yet, they belong on the dashboard where the Onboarding Modal will catch them.
        router.push('/dashboard');
      }
    };

    fetchMyUsername();
  }, [user, isLoaded, router]);

  return (
    <div className="flex justify-center flex-col items-center min-h-[50vh] mt-32 gap-6 animate-fade-in">
      <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
      <p className="text-neon-cyan font-bold tracking-wider animate-pulse">LOCATING CREATOR PROFILE...</p>
    </div>
  );
}
