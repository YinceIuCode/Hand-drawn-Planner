import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Kiểm tra xem cấu hình Supabase đã đầy đủ và hợp lệ chưa.
 * Cho phép ứng dụng fallback an toàn sang chế độ Local-only nếu chưa có env.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Supabase client instance.
 * Sẽ là SupabaseClient nếu có cấu hình, hoặc null nếu chưa cấu hình.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
