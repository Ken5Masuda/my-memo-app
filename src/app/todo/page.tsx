"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// タスクの型定義
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const isComposingRef = useRef(false); // IME変換中かどうか

  // タスクを追加
  const addTask = () => {
    if (inputValue.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
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

  // タスクの完了/未完了を切り替え
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // タスクを削除
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
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
              />
              <Button onClick={addTask}>追加</Button>
            </div>

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
                      {task.text}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
