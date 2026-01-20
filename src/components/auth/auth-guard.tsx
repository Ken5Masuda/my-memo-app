"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthGuardProps = {
  children: React.ReactNode;
};

// 認証状態を管理するコンポーネント
// ログインしていない場合はログインページにリダイレクト
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを確認
    const checkSession = async () => {
      try {
        // Supabaseから現在のセッション情報を取得
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // ログイン済みの場合はユーザー情報をセット
          setUser(session.user);
        } else {
          // 未ログインの場合はログインページへリダイレクト
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 認証状態の変更を監視
    // ログイン/ログアウト時に自動的に状態を更新
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          router.push("/auth/login");
        }
      }
    );

    // クリーンアップ：コンポーネントがアンマウントされたら監視を解除
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-500">認証確認中...</p>
        </div>
      </div>
    );
  }

  // 未ログインの場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null;
  }

  // ログイン済みの場合は子コンポーネントを表示
  return <>{children}</>;
}

// ユーザー情報を取得するためのカスタムフック
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 初期状態を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 状態変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user };
}
