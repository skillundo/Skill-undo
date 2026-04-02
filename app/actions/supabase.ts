'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const serverSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertPortfolioItem(data: any) {


  const { data: insertedData, error } = await serverSupabase
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
  const { data: insertedData, error } = await serverSupabase
    .from('gigs')
    .insert([data])
    .select();

  if (error) {
    console.error("Server Action RLS Bypass Error (Gig):", error);
    throw new Error(error.message || 'Failed to sync signal to grid.');
  }

  return { success: true, data: insertedData };
}
