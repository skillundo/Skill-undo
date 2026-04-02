'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addProjectAction(formData: any) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('You must be logged in to add a project.');
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
  }

  const { data: insertedData, error } = await adminSupabase
    .from('portfolio_items')
    .insert([{
      profile_id: userId,
      title: formData.title,
      description: formData.description,
      demo_url: formData.demo_url
    }])
    .select();

  if (error) {
    console.error("Server Action RLS Bypass Error (Project):", error);
    throw new Error(error.message || 'Failed to sync project to grid.');
  }

  return { success: true, data: insertedData };
}
