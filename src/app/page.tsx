"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 認証状態を確認
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // ログイン済み → メモアプリへ
          router.replace("/memos");
        } else {
          // 未ログイン → ログイン画面へ
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          router.replace("/memos");
        } else {
          router.replace("/auth/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // ローディング中の表示
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
}
