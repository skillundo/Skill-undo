import { MOCK_PROJECTS, CURRENT_USER } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { motion } from "framer-motion";

export function Sidebar() {
  const hiredByMe = MOCK_PROJECTS.filter((p) => p.client.id === CURRENT_USER.id);
  const myGigs = MOCK_PROJECTS.filter((p) => p.worker.id === CURRENT_USER.id);

  return (
    <aside className="w-80 border-l border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 hidden lg:block sticky top-16 h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full py-6">
        <div className="px-6 space-y-8">
          
          {/* Hired by Me Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Hired by Me</h2>
              <Badge variant="secondary" className="rounded-full">{hiredByMe.length}</Badge>
            </div>
            <div className="space-y-3">
              {hiredByMe.map((project, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={project.id}
                >
                  <Link href={`/workspace/${project.id}`} className="block group">
                    <div className="p-4 rounded-xl border border-transparent bg-muted/30 hover:bg-muted/80 hover:border-border transition-all duration-200 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm group-hover:underline decoration-1 underline-offset-2">{project.title}</h3>
                        <span className="text-xs font-mono">₹{project.budget}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <img src={project.worker.avatarUrl} alt={project.worker.username} className="w-5 h-5 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                          <span className="text-xs text-muted-foreground">{project.worker.username}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${project.status === 'In Progress' ? 'bg-black dark:bg-white animate-pulse' : 'bg-muted-foreground'}`} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* My Gigs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">My Gigs</h2>
              <Badge variant="secondary" className="rounded-full">{myGigs.length}</Badge>
            </div>
            <div className="space-y-3">
              {myGigs.map((project, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + hiredByMe.length) * 0.1 }}
                  key={project.id}
                >
                  <Link href={`/workspace/${project.id}`} className="block group">
                    <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm group-hover:underline decoration-1 underline-offset-2">{project.title}</h3>
                        <span className="text-xs font-mono">₹{project.budget}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <img src={project.client.avatarUrl} alt={project.client.username} className="w-5 h-5 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                          <span className="text-xs text-muted-foreground">Client: {project.client.username}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-sm">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </ScrollArea>
    </aside>
  );
}
