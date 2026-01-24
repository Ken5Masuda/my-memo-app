"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      // Supabaseのメール/パスワード認証でログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ログイン成功したらメモアプリへリダイレクト
      toast.success("ログインしました");
      router.push("/memos");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "ログインに失敗しました";
      setError(errorMessage);
      toast.error("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // サインアップ処理
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      // Supabaseでユーザー登録
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // 登録成功メッセージを表示
      setMessage("確認メールを送信しました。メールを確認してください。");
      toast.success("アカウントを作成しました。確認メールをご確認ください。");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "サインアップに失敗しました";
      setError(errorMessage);
      toast.error("サインアップに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            NoteBox
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded text-sm">
              {error}
            </div>
          )}

          {/* 成功メッセージ */}
          {message && (
            <div className="mb-4 p-3 bg-success/10 border border-success/30 text-success rounded text-sm">
              {message}
            </div>
          )}

          {/* ログイン/サインアップタブ */}
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">サインアップ</TabsTrigger>
            </TabsList>

            {/* ログインフォーム */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">メールアドレス</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">パスワード</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </form>
            </TabsContent>

            {/* サインアップフォーム */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">メールアドレス</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">パスワード</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="6文字以上のパスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登録中..." : "アカウント作成"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
