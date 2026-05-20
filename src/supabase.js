import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loadPool() {
  const { data, error } = await supabase
    .from('pool_state')
    .select('data')
    .eq('id', 'main')
    .single();
  if (error) { console.error('Load error:', error); return null; }
  return data?.data || null;
}

export async function savePool(poolData) {
  const { error } = await supabase
    .from('pool_state')
    .upsert({ id: 'main', data: poolData, updated_at: new Date().toISOString() });
  if (error) console.error('Save error:', error);
}
