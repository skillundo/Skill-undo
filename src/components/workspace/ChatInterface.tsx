import { useState } from "react";
import { Project, CURRENT_USER, MOCK_MESSAGES } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInterfaceProps {
  project: Project;
}

export function ChatInterface({ project }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(MOCK_MESSAGES.filter(m => m.projectId === project.id));
  const [newMessage, setNewMessage] = useState("");

  const isWorker = CURRENT_USER.id === project.worker.id;
  const isClient = CURRENT_USER.id === project.client.id;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Math.random().toString(),
      projectId: project.id,
      senderId: CURRENT_USER.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-muted/10 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden relative">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 flex flex-col pb-24">
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === CURRENT_USER.id;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`px-5 py-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-black text-white dark:bg-white dark:text-black rounded-br-none' 
                      : 'bg-white text-black border border-black/10 dark:bg-black dark:text-white dark:border-white/10 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Action Zone & Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-black/10 dark:border-white/10">
        
        {/* Context Aware Action */}
        {project.status === "In Progress" && (
          <div className="mb-4 flex justify-center">
            {isWorker ? (
              <Button className="rounded-full px-6 bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-all shadow-md gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Submit Final Work
              </Button>
            ) : isClient ? (
              <Button variant="outline" className="rounded-full px-6 border-black/20 dark:border-white/20 gap-2">
                Approve & Release Funds
              </Button>
            ) : null}
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..." 
            className="rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white pr-12 h-12"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim()}
            className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
