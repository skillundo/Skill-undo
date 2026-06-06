import { supabase } from './supabase';

export async function syncUserToSupabase(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) {
  if (!user || !user.uid) return;

  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        firebase_uid: user.uid,
        email: user.email,
        full_name: user.displayName,
        avatar_url: user.photoURL,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'firebase_uid'
      });

    if (error) {
      console.error('Error syncing user to Supabase:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to sync user:', err);
    throw err;
  }
}
