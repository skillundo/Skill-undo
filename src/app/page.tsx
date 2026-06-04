import Link from "next/link";
import { ArrowRight, Code, PenTool, Video, LineChart, Mail } from "lucide-react";
import BlurText from "@/components/ui/blur-text";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2022_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mx-auto">
            ✨ Now open for students globally
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center justify-center gap-2">
            <BlurText 
              as="span" 
              text="The Student-to-Student" 
              delay={100} 
              animateBy="words" 
              direction="top" 
              className="justify-center text-center" 
            />
            <BlurText 
              as="span" 
              text="Skill Marketplace" 
              delay={100} 
              animateBy="words" 
              direction="top" 
              className="justify-center text-center"
              elementsClassName="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-500" 
            />
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hire talented peers for your projects, or offer your own skills to earn money. Build your portfolio while you study.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/auth" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full sm:w-auto"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/auth" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full sm:w-auto"
            >
              Explore Gigs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Code, label: "Web Development" },
              { icon: PenTool, label: "UI/UX Design" },
              { icon: Video, label: "Video Editing" },
              { icon: LineChart, label: "Marketing" },
            ].map((skill, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl border border-border/50 hover:border-foreground/20 transition-all hover:-translate-y-1 cursor-pointer">
                <skill.icon className="h-8 w-8 mb-4 text-muted-foreground" />
                <span className="font-medium text-sm">{skill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal About Section */}
      <section id="about" className="py-24 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">About Skillundo</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Skillundo is a peer-to-peer marketplace built exclusively for students. 
            We believe that the best talent is often found right on campus. Whether you need a developer for your startup idea, a designer for your presentation, or you simply want to offer your own skills to earn on the side—Skillundo connects you with the right peers seamlessly.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-border/40 py-10 px-4 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:hello@skillundo.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Skillundo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
