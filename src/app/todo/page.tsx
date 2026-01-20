"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { AuthGuard, useAuth } from "@/components/auth/auth-guard";

// タスクの型定義（Supabaseのテーブル構造に合わせる）
type Task = {
  id: number;
  title: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
};

// ToDoページの本体コンポーネント
function TodoContent() {
  const router = useRouter();
  const { user } = useAuth();

  // 状態管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isComposingRef = useRef(false);

  // ページ読み込み時にSupabaseからタスクを取得
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Supabaseからタスク一覧を取得する関数
  // RLSポリシーにより、自分のタスクのみ取得される
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setTasks(data || []);
    } catch (err) {
      setError("タスクの取得に失敗しました");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // タスクを追加する関数
  const addTask = async () => {
    if (inputValue.trim() === "" || !user) return;

    try {
      setError(null);

      // user_idを含めてINSERT
      const { data, error } = await supabase
        .from("todos")
        .insert({
          title: inputValue.trim(),
          completed: false,
          user_id: user.id, // ログインユーザーのIDを設定
        })
        .select()
        .single();

      if (error) throw error;

      setTasks([...tasks, data]);
      setInputValue("");
    } catch (err) {
      setError("タスクの追加に失敗しました");
      console.error("Insert error:", err);
    }
  };

  // タスクの完了/未完了を切り替える関数
  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      setError(null);

      const { error } = await supabase
        .from("todos")
        .update({ completed: !task.completed })
        .eq("id", id);

      if (error) throw error;

      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError("タスクの更新に失敗しました");
      console.error("Update error:", err);
    }
  };

  // タスクを削除する関数
  const deleteTask = async (id: number) => {
    try {
      setError(null);

      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("タスクの削除に失敗しました");
      console.error("Delete error:", err);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Enterキーでタスクを追加（IME変換中は無視）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposingRef.current) {
      addTask();
    }
  };

  // IME変換開始
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  // IME変換終了
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">ToDoアプリ</CardTitle>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                ログアウト
              </Button>
            </div>
            {/* ログイン中のユーザー情報を表示 */}
            {user && (
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            )}
          </CardHeader>
          <CardContent>
            {/* エラーメッセージの表示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* タスク入力エリア */}
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                placeholder="新しいタスクを入力..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={addTask} disabled={isLoading}>
                追加
              </Button>
            </div>

            {/* ローディング表示 */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-500">読み込み中...</p>
              </div>
            ) : (
              <>
                {/* タスク一覧 */}
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      タスクがありません
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`flex-1 cursor-pointer ${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {task.title}
                        </label>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                        >
                          削除
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* タスク数の表示 */}
                {tasks.length > 0 && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    {tasks.filter((t) => t.completed).length} / {tasks.length} 完了
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// AuthGuardでラップしてエクスポート
// ログインしていない場合はログインページにリダイレクトされる
export default function TodoPage() {
  return (
    <AuthGuard>
      <TodoContent />
    </AuthGuard>
  );
}
