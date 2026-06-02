import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { OnboardingModal } from '@/components/OnboardingModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CampusGigs | Elite Campus Talent',
  description: 'The high-end talent marketplace for elite campus creators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_FRONTEND_API
  );

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617]`}>
        {clerkConfigured ? (
          <ClerkProvider>
            <NavBar />
            <OnboardingModal />
            <main className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
              {children}
            </main>
            <Toaster
              theme="dark"
              toastOptions={{
                className: 'glass-panel !bg-black/40 !border-cyan-500/50 !text-white'
              }}
            />
          </ClerkProvider>
        ) : (
          <>
            <NavBar />
            <main className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
              {children}
            </main>
            <Toaster
              theme="dark"
              toastOptions={{
                className: 'glass-panel !bg-black/40 !border-cyan-500/50 !text-white'
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
