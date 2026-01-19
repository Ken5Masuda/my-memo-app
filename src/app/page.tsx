"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");

  const handleSubmit = () => {
    setSubmittedValue(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>shadcn/ui デモ</CardTitle>
          <CardDescription>
            Button、Card、Input コンポーネントのデモです
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="demo-input" className="text-sm font-medium">
              メッセージを入力
            </label>
            <Input
              id="demo-input"
              placeholder="ここに入力してください..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {submittedValue && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">送信されたメッセージ:</p>
              <p className="font-medium">{submittedValue}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!inputValue}>
            送信
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setInputValue("");
              setSubmittedValue("");
            }}
          >
            クリア
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
