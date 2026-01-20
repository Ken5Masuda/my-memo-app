"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";

// タスクの型定義（Supabaseのテーブル構造に合わせる）
type Task = {
  id: number;
  title: string;  // Supabaseのカラム名に合わせる
  completed: boolean;
  created_at?: string;
};

export default function TodoPage() {
  // 状態管理
  const [tasks, setTasks] = useState<Task[]>([]); // タスク一覧
  const [inputValue, setInputValue] = useState(""); // 入力欄の値
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const isComposingRef = useRef(false); // IME変換中かどうか

  // ページ読み込み時にSupabaseからタスクを取得
  // 空の依存配列[]により、コンポーネントのマウント時に1回だけ実行される
  useEffect(() => {
    fetchTasks();
  }, []);

  // Supabaseからタスク一覧を取得する関数
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Supabaseのtodosテーブルから全データを取得
      // select('*')で全カラムを取得、order()で作成日時順にソート
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      // エラーがあればthrowしてcatchブロックで処理
      if (error) throw error;

      // 取得したデータをstateにセット
      setTasks(data || []);
    } catch (err) {
      // エラーメッセージを設定
      setError("タスクの取得に失敗しました");
      console.error("Fetch error:", err);
    } finally {
      // 成功・失敗に関わらずローディングを終了
      setIsLoading(false);
    }
  };

  // タスクを追加する関数
  const addTask = async () => {
    // 空文字の場合は何もしない
    if (inputValue.trim() === "") return;

    try {
      setError(null);

      // Supabaseのtodosテーブルに新しいタスクをINSERT
      // insert()でデータを挿入、select()で挿入したデータを返す
      // single()で単一のオブジェクトとして取得
      const { data, error } = await supabase
        .from("todos")
        .insert({ title: inputValue.trim(), completed: false })
        .select()
        .single();

      if (error) throw error;

      // 成功したら、返ってきたデータをタスク一覧に追加
      // Supabaseが自動生成したidやcreated_atも含まれる
      setTasks([...tasks, data]);
      setInputValue(""); // 入力欄をクリア
    } catch (err) {
      setError("タスクの追加に失敗しました");
      console.error("Insert error:", err);
    }
  };

  // タスクの完了/未完了を切り替える関数
  const toggleTask = async (id: number) => {
    // 対象のタスクを検索
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      setError(null);

      // Supabaseのtodosテーブルを更新
      // update()で更新内容を指定、eq()で条件を指定（id一致）
      const { error } = await supabase
        .from("todos")
        .update({ completed: !task.completed })
        .eq("id", id);

      if (error) throw error;

      // 成功したら、ローカルのstateも更新
      // map()で該当タスクのcompletedを反転
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

      // Supabaseのtodosテーブルから削除
      // delete()で削除、eq()で条件を指定（id一致）
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 成功したら、ローカルのstateからも削除
      // filter()で該当タスク以外を残す
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("タスクの削除に失敗しました");
      console.error("Delete error:", err);
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
            <CardTitle className="text-2xl font-bold text-center">
              ToDoアプリ
            </CardTitle>
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
