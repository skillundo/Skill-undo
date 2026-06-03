import { useState } from "react";
import { UserProfile } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HireMeModalProps {
  user: UserProfile;
  children: React.ReactElement;
}

export function HireMeModal({ user, children }: HireMeModalProps) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-black dark:border-white rounded-none sm:rounded-2xl bg-white dark:bg-black">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6"
            >
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-2xl font-bold tracking-tight">Hire @{user.username}</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  Propose a project. Escrow locks funds until delivery.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-xl border border-black/5 dark:border-white/5">
                <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full grayscale" />
                <div>
                  <h4 className="font-medium text-sm">{user.username}</h4>
                  <p className="text-xs text-muted-foreground">{user.skills.join(" • ")}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-sm font-medium">Budget Offer (₹)</label>
                  <Input 
                    id="budget" 
                    type="number" 
                    placeholder="e.g. 5000" 
                    className="rounded-xl border-black/20 focus-visible:ring-black dark:border-white/20 dark:focus-visible:ring-white h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Popover>
                    <PopoverTrigger render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl h-12 border-black/20 dark:border-white/20 hover:bg-muted/50",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    } />
                    <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Project Requirements</label>
                  <Textarea 
                    id="notes" 
                    placeholder="Describe what you need built..." 
                    className="resize-none rounded-xl border-black/20 focus-visible:ring-black dark:border-white/20 dark:focus-visible:ring-white min-h-[100px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black font-semibold tracking-wide flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Send Inquiry & Lock Escrow
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
