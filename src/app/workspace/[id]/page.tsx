"use client";

import { use } from "react";
import { MOCK_PROJECTS, CURRENT_USER } from "@/lib/mock-data";
import { ChatInterface } from "@/components/workspace/ChatInterface";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = MOCK_PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Link href="/">
          <Button variant="outline">Go back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isWorker = CURRENT_USER.id === project.worker.id;
  const otherParty = isWorker ? project.client : project.worker;
  const roleText = isWorker ? "Client" : "Worker";

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      {/* Workspace Header */}
      <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="font-medium">@{otherParty.username}</span>
                <span className="opacity-50">•</span>
                <span>{roleText}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="px-3 py-1.5 h-auto text-sm border-black/20 dark:border-white/20 rounded-full flex gap-1.5 items-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Due {new Date(project.deadline).toLocaleDateString()}
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 h-auto text-sm border-black/20 dark:border-white/20 rounded-full flex gap-1.5 items-center font-mono">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              ₹{project.budget}
            </Badge>
            <Badge className={`px-3 py-1.5 h-auto text-sm rounded-full ${project.status === 'In Progress' ? 'bg-black dark:bg-white animate-pulse-slow' : 'bg-muted-foreground'}`}>
              {project.status}
            </Badge>
          </div>

        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 min-h-0">
        <ChatInterface project={project} />
      </div>
    </div>
  );
}
