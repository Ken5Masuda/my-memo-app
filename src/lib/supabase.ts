import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントを作成してエクスポート
// このクライアントを使ってデータベース操作や認証を行う
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
