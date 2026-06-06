"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, MOCK_USERS } from "@/lib/mock-data";

export interface Skill {
  id: string;
  title: string;
  category: string;
  catColor: string;
  status: "Active" | "Paused" | "Draft";
  views: number;
  orders: number;
  rating: number | null;
  earned: string;
  price: number;
  imageUrl: string;
  user: UserProfile;
}

export interface Order {
  id: string;
  buyerName: string;
  service: string;
  amount: string;
  status: "In Progress" | "Delivered" | "In Review" | "Completed";
  due: string;
}

export interface Notification {
  id: number;
  type: "order" | "message" | "review" | "view";
  text: string;
  time: string;
  read: boolean;
}

interface DashboardContextType {
  skills: Skill[];
  orders: Order[];
  notifications: Notification[];
  addSkill: (skill: Omit<Skill, "id" | "views" | "orders" | "rating" | "earned" | "user">) => void;
  toggleSkillStatus: (id: string) => void;
  deleteSkill: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const INITIAL_SKILLS: Skill[] = [
  {
    id: "s1",
    title: "I will build a full-stack web application",
    category: "Engineering",
    catColor: "bg-blue-500",
    status: "Active",
    views: 89,
    orders: 2,
    rating: 4.9,
    earned: "9,500",
    price: 5000,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    user: MOCK_USERS[0],
  },
  {
    id: "s2",
    title: "I will design a modern UI/UX system in Figma",
    category: "Design",
    catColor: "bg-pink-500",
    status: "Active",
    views: 43,
    orders: 1,
    rating: 5.0,
    earned: "3,000",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    user: MOCK_USERS[0],
  },
  {
    id: "s3",
    title: "I will automate your tasks with Python scripts",
    category: "Engineering",
    catColor: "bg-blue-500",
    status: "Paused",
    views: 12,
    orders: 0,
    rating: null,
    earned: "0",
    price: 1000,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    user: MOCK_USERS[0],
  },
  {
    id: "s4",
    title: "I will write SEO-optimized blog content",
    category: "Writing",
    catColor: "bg-green-500",
    status: "Draft",
    views: 0,
    orders: 0,
    rating: null,
    earned: "0",
    price: 800,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=800",
    user: MOCK_USERS[0],
  },
];

const INITIAL_ORDERS: Order[] = [
  { id: "o1", buyerName: "Arjun K", service: "Full-stack web app", amount: "5,000", status: "In Progress", due: "3 days" },
  { id: "o2", buyerName: "Meera S", service: "UI Design System", amount: "3,000", status: "Delivered", due: "—" },
  { id: "o3", buyerName: "Rahul T", service: "Backend API", amount: "4,500", status: "In Review", due: "1 day" },
  { id: "o4", buyerName: "Sneha P", service: "SEO Blog Posts", amount: "800", status: "Completed", due: "—" },
  { id: "o5", buyerName: "Kiran M", service: "Flutter App", amount: "3,500", status: "In Progress", due: "5 days" },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: "order", text: "Arjun K placed a new order", time: "2h ago", read: false },
  { id: 2, type: "message", text: "New message from Meera S", time: "4h ago", read: false },
  { id: 3, type: "review", text: "You received a 5-star review", time: "1d ago", read: false },
  { id: 4, type: "view", text: "Your profile was viewed 12 times", time: "2d ago", read: false },
];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Load from local storage if exists
    const storedSkills = localStorage.getItem("skillundo_skills");
    if (storedSkills) {
      try {
        setSkills(JSON.parse(storedSkills));
      } catch (e) {}
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("skillundo_skills", JSON.stringify(skills));
    }
  }, [skills, isClient]);

  const addSkill = (newSkillData: Omit<Skill, "id" | "views" | "orders" | "rating" | "earned" | "user">) => {
    const newSkill: Skill = {
      ...newSkillData,
      id: `s${Date.now()}`,
      views: 0,
      orders: 0,
      rating: null,
      earned: "0",
      user: MOCK_USERS[0], // Using current mock user
    };
    setSkills(prev => [newSkill, ...prev]);
  };

  const toggleSkillStatus = (id: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === id) {
        if (skill.status === "Active") return { ...skill, status: "Paused" };
        if (skill.status === "Paused") return { ...skill, status: "Active" };
      }
      return skill;
    }));
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DashboardContext.Provider value={{
      skills,
      orders,
      notifications,
      addSkill,
      toggleSkillStatus,
      deleteSkill,
      markAllNotificationsRead,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}
