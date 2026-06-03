import { UserProfile } from "@/lib/mock-data";
import { HireMeModal } from "./HireMeModal";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <HireMeModal user={user}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group relative cursor-pointer rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white/10 dark:bg-black dark:hover:border-white dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
      >
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

        <div className="mt-6 flex flex-wrap gap-2">
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
