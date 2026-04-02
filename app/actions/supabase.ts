'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize an admin client that bypasses RLS
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertPortfolioItem(data: any) {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. Please check your .env.local file.');
  }

  const { data: insertedData, error } = await adminSupabase
    .from('portfolio_items')
    .insert([data])
    .select();

  if (error) {
    console.error("Server Action RLS Bypass Error (Portfolio):", error);
    throw new Error(error.message || 'Failed to sync project to grid.');
  }

  return { success: true, data: insertedData };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertGigSignal(data: any) {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. Please check your .env.local file.');
  }

  const { data: insertedData, error } = await adminSupabase
    .from('gigs')
    .insert([data])
    .select();

  if (error) {
    console.error("Server Action RLS Bypass Error (Gig):", error);
    throw new Error(error.message || 'Failed to sync signal to grid.');
  }

  return { success: true, data: insertedData };
}
