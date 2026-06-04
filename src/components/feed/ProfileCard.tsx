"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/mock-data";
import { HireMeModal } from "./HireMeModal";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);

  useEffect(() => {
    if (!user.portfolio || user.portfolio.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPortfolioIndex((prev) => (prev + 1) % user.portfolio.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [user.portfolio]);

  return (
    <HireMeModal user={user}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group relative cursor-pointer rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white/10 dark:bg-black dark:hover:border-white dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col gap-4"
      >
        {/* Portfolio Slideshow Section */}
        {user.portfolio && user.portfolio.length > 0 && (
          <div className="h-40 w-full rounded-xl bg-muted/30 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5 relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPortfolioIndex}
                src={user.portfolio[currentPortfolioIndex]}
                alt={`${user.username}'s portfolio item`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-16 w-16 rounded-full border border-black/10 object-cover grayscale transition-all duration-300 group-hover:grayscale-0 dark:border-white/10"
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-lg leading-none tracking-tight">{user.username}</h3>
              <div className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-black text-black dark:fill-white dark:text-white" />
                <span className="text-black dark:text-white">{user.rating.toFixed(1)}</span>
                <span className="mx-1.5 opacity-30">•</span>
                <span>{user.completedJobs} jobs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>{user.college}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{user.locality}</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="rounded-md px-2.5 py-0.5 text-xs font-mono font-medium transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black"
            >
              #{skill.toLowerCase()}
            </Badge>
          ))}
        </div>
      </motion.div>
    </HireMeModal>
  );
}
