import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Next.js Supabase client. Edge functions or standard client will assume Mumbai (ap-south-1) region if deployed closely.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = 'Digital Artist' | 'Content Writing' | 'UI/UX Design' | 'Full-Stack Dev' | 'Video Editing';

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  is_anonymous: boolean;
  skills: string[];
  top_rated: boolean;
  avatar_url?: string;
  created_at?: string;
};

export type PortfolioItem = {
  id: string;
  profile_id: string;
  title: string;
  description?: string;
  demo_url?: string;
  created_at?: string;
};

export type Task = {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  category: Category;
  status: 'open' | 'assigned' | 'completed';
  posted_by?: string;
  assigned_to?: string | null;
  created_at?: string;
};

export const postTask = async (task: Omit<Task, 'id' | 'created_at' | 'status'>) => {
  return await supabase.from('tasks').insert([
    {
      ...task,
      status: 'open',
    }
  ]);
};
