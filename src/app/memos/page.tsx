"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { NoteGrid } from "@/components/dashboard/note-grid";
import { NoteEditor } from "@/components/dashboard/note-editor";
import type { Note } from "@/components/dashboard/note-card";

// Sample data
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Next.js 15 の新機能まとめ",
    content:
      "App Router の改善点、Server Actions の安定化、Turbopack の統合など、Next.js 15 で追加された主要な機能についてまとめました。特にキャッシュの扱いが大きく変わっています。",
    createdAt: "2024年1月20日",
    isStarred: true,
    isBookmark: false,
    category: "learning",
    tags: ["Next.js", "React", "開発"],
  },
  {
    id: "2",
    title: "プロジェクト企画書 - AI チャットボット",
    content:
      "社内向け AI チャットボットの企画書。目的、機能要件、技術スタック、スケジュールなどを整理。RAG を活用した社内ドキュメント検索機能が鍵になる。",
    createdAt: "2024年1月19日",
    isStarred: true,
    isBookmark: false,
    category: "projects",
    tags: ["企画", "AI", "プロジェクト"],
  },
  {
    id: "3",
    title: "Figma デザインシステム参考",
    content:
      "優れたデザインシステムの実装例。カラーパレット、タイポグラフィ、コンポーネント設計の参考になるリソースをまとめたブックマーク。",
    createdAt: "2024年1月18日",
    isStarred: false,
    isBookmark: true,
    url: "https://www.figma.com/community",
    category: "bookmarks",
    tags: ["デザイン", "UI/UX"],
  },
  {
    id: "4",
    title: "週次ミーティング議事録 - 1/17",
    content:
      "開発進捗の共有。フロントエンド: ダッシュボード実装完了。バックエンド: API設計レビュー中。次週の目標: E2Eテスト環境構築、本番デプロイ準備。",
    createdAt: "2024年1月17日",
    isStarred: false,
    isBookmark: false,
    category: "meetings",
    tags: ["ミーティング", "議事録"],
  },
  {
    id: "5",
    title: "読書メモ: アトミックハビット",
    content:
      "習慣形成の4つの法則: 1. きっかけを明確にする 2. 魅力的にする 3. 簡単にする 4. 満足感を得る。小さな改善を積み重ねることで大きな変化を生む。",
    createdAt: "2024年1月15日",
    isStarred: false,
    isBookmark: false,
    category: "reading",
    tags: ["読書", "自己啓発"],
  },
  {
    id: "6",
    title: "Tailwind CSS チートシート",
    content:
      "よく使う Tailwind CSS のクラスをまとめた。flex, grid レイアウト、spacing、typography、colors など。特にレスポンシブ対応のブレイクポイントは要確認。",
    createdAt: "2024年1月14日",
    isStarred: true,
    isBookmark: true,
    url: "https://tailwindcss.com/docs",
    category: "bookmarks",
    tags: ["CSS", "開発"],
  },
  {
    id: "7",
    title: "アプリアイデア: 家計簿アプリ",
    content:
      "シンプルな家計簿アプリのアイデア。レシート読み取り機能、カテゴリ自動分類、月次レポート生成。差別化ポイントはAIによる支出傾向分析と節約提案。",
    createdAt: "2024年1月12日",
    isStarred: false,
    isBookmark: false,
    category: "ideas",
    tags: ["アイデア", "アプリ"],
  },
  {
    id: "8",
    title: "TypeScript 型ユーティリティ集",
    content:
      "実務で役立つ TypeScript の型ユーティリティ。Partial, Required, Pick, Omit, Record など。ジェネリクスを活用した型の再利用方法も整理。",
    createdAt: "2024年1月10日",
    isStarred: false,
    isBookmark: false,
    category: "learning",
    tags: ["TypeScript", "開発"],
  },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "starred") {
        filtered = filtered.filter((note) => note.isStarred);
      } else if (selectedCategory === "bookmarks") {
        filtered = filtered.filter((note) => note.isBookmark);
      } else {
        filtered = filtered.filter((note) => note.category === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [notes, selectedCategory, searchQuery]);

  const handleToggleStar = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isStarred: !note.isStarred } : note
      )
    );
  };

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (noteData: Partial<Note> & { title: string; content: string }) => {
    if (noteData.id) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteData.id ? { ...note, ...noteData } : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        content: noteData.content,
        createdAt: noteData.createdAt || new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        isStarred: noteData.isStarred || false,
        isBookmark: noteData.isBookmark || false,
        url: noteData.url,
        category: noteData.category || "personal",
        tags: noteData.tags || [],
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewNote={handleNewNote}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <NoteGrid
            notes={filteredNotes}
            viewMode={viewMode}
            onToggleStar={handleToggleStar}
            onNoteClick={handleNoteClick}
          />
        </div>
      </main>

      {/* Note Editor Modal */}
      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
