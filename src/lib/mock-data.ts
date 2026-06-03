export type Skill = string;

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  skills: Skill[];
  rating: number;
  completedJobs: number;
}

export interface Project {
  id: string;
  title: string;
  client: UserProfile;
  worker: UserProfile;
  budget: number;
  deadline: string; // ISO date string
  status: "In Progress" | "Delivered" | "Completed";
  createdAt: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: "u1",
    username: "AlexDev",
    avatarUrl: "https://i.pravatar.cc/150?u=u1",
    skills: ["Next.js", "React", "TypeScript"],
    rating: 4.9,
    completedJobs: 12,
  },
  {
    id: "u2",
    username: "SarahDesign",
    avatarUrl: "https://i.pravatar.cc/150?u=u2",
    skills: ["Figma", "UI/UX", "Tailwind"],
    rating: 5.0,
    completedJobs: 24,
  },
  {
    id: "u3",
    username: "MikeBackend",
    avatarUrl: "https://i.pravatar.cc/150?u=u3",
    skills: ["Node.js", "PostgreSQL", "API"],
    rating: 4.7,
    completedJobs: 8,
  },
  {
    id: "u4",
    username: "EmmaWriter",
    avatarUrl: "https://i.pravatar.cc/150?u=u4",
    skills: ["Copywriting", "SEO", "Content"],
    rating: 4.8,
    completedJobs: 19,
  },
];

export const CURRENT_USER = MOCK_USERS[0];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Design Landing Page",
    client: MOCK_USERS[0], // Current user is client
    worker: MOCK_USERS[1],
    budget: 15000,
    deadline: "2026-06-10T00:00:00.000Z",
    status: "In Progress",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "p2",
    title: "Setup API Routes",
    client: MOCK_USERS[2],
    worker: MOCK_USERS[0], // Current user is worker
    budget: 8000,
    deadline: "2026-06-05T00:00:00.000Z",
    status: "Delivered",
    createdAt: "2026-05-28T09:00:00.000Z",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    projectId: "p1",
    senderId: "u1", // Current user
    content: "Hey Sarah, any updates on the wireframes?",
    timestamp: "2026-06-02T14:30:00.000Z",
  },
  {
    id: "m2",
    projectId: "p1",
    senderId: "u2", // Worker
    content: "Yes! Just finishing up the mobile view. Will send over a link in an hour.",
    timestamp: "2026-06-02T14:35:00.000Z",
  },
  {
    id: "m3",
    projectId: "p1",
    senderId: "u1",
    content: "Awesome, can't wait to see it.",
    timestamp: "2026-06-02T14:40:00.000Z",
  },
];
