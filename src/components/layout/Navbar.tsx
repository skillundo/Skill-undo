import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tighter">SKILLUNDO</h1>
          <div className="relative hidden w-64 md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills, users..."
              className="w-full rounded-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-black dark:bg-white"></span>
          </button>
          
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium leading-none">{CURRENT_USER.username}</span>
              <span className="text-xs text-muted-foreground">Balance: ₹4,500</span>
            </div>
            <Avatar className="h-9 w-9 border border-border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.username} />
              <AvatarFallback className="font-bold bg-black text-white dark:bg-white dark:text-black">
                {CURRENT_USER.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
