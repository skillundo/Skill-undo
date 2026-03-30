import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nncubpfzoyygrmwaklli.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY3VicGZ6b3l5Z3Jtd2FrbGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MTkwODcsImV4cCI6MjA5MDA5NTA4N30.gVGyc7IDvZMWVm23fkvvjkilAR8P-1xjOPp7gOda7Rg');

async function test() {
  const { error } = await supabase.from('tasks').insert([
    {
      title: 'test',
      budget: 100,
      deadline: new Date().toISOString(),
      category: 'test',
      status: 'pending',
      posted_by: 'test_user_id',
      assigned_to: 'test_target_id'
    }
  ]);
  console.log("Supabase Error Details: ", JSON.stringify(error, null, 2));
}

test();
