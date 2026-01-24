"use client";

import React, { useMemo } from "react";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FileText,
  Bookmark,
  Star,
  Trash2,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Hash,
  Inbox,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Note } from "@/components/dashboard/note-card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  notes: Note[];
}

export function Sidebar({ selectedCategory, onSelectCategory, notes }: SidebarProps) {
  const router = useRouter();
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["work", "personal"]);

  // ログアウト処理
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("ログアウトに失敗しました");
      return;
    }
    toast.success("ログアウトしました");
    router.push("/auth/login");
  };

  // メモ数を動的に計算
  const counts = useMemo(() => {
    return {
      all: notes.length,
      bookmarks: notes.filter((n) => n.is_bookmarked).length,
      starred: notes.filter((n) => n.is_starred).length,
      inbox: notes.filter((n) => n.folder === "inbox").length,
      work: notes.filter((n) => n.folder === "work").length,
      meetings: notes.filter((n) => n.folder === "meetings").length,
      projects: notes.filter((n) => n.folder === "projects").length,
      personal: notes.filter((n) => n.folder === "personal").length,
      ideas: notes.filter((n) => n.folder === "ideas").length,
      reading: notes.filter((n) => n.folder === "reading").length,
      learning: notes.filter((n) => n.folder === "learning").length,
    };
  }, [notes]);

  const categories = [
    { id: "all", name: "すべてのメモ", icon: <FileText className="size-4" />, count: counts.all },
    { id: "bookmarks", name: "ブックマーク", icon: <Bookmark className="size-4" />, count: counts.bookmarks },
    { id: "starred", name: "スター付き", icon: <Star className="size-4" />, count: counts.starred },
  ];

  const folders = [
    { id: "inbox", name: "受信箱", icon: <Inbox className="size-4" />, count: counts.inbox },
    {
      id: "work",
      name: "仕事",
      icon: <FolderOpen className="size-4" />,
      count: counts.work + counts.meetings + counts.projects,
      children: [
        { id: "meetings", name: "会議メモ", icon: <Hash className="size-4" />, count: counts.meetings },
        { id: "projects", name: "プロジェクト", icon: <Hash className="size-4" />, count: counts.projects },
      ],
    },
    {
      id: "personal",
      name: "プライベート",
      icon: <FolderOpen className="size-4" />,
      count: counts.personal + counts.ideas + counts.reading,
      children: [
        { id: "ideas", name: "アイデア", icon: <Hash className="size-4" />, count: counts.ideas },
        { id: "reading", name: "読書メモ", icon: <Hash className="size-4" />, count: counts.reading },
      ],
    },
    { id: "learning", name: "学習", icon: <FolderOpen className="size-4" />, count: counts.learning },
  ];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <FileText className="size-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sidebar-foreground">NoteBox</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Main Categories */}
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                selectedCategory === category.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {category.icon}
              <span className="flex-1 text-left">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Folders */}
        <div className="mb-2 flex items-center justify-between px-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            フォルダ
          </span>
          <Button variant="ghost" size="icon" className="size-6">
            <Plus className="size-3.5" />
          </Button>
        </div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => {
                  if (folder.children) {
                    toggleFolder(folder.id);
                  }
                  onSelectCategory(folder.id);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedCategory === folder.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {folder.children ? (
                  expandedFolders.includes(folder.id) ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )
                ) : (
                  <span className="w-3.5" />
                )}
                {folder.icon}
                <span className="flex-1 text-left">{folder.name}</span>
                <span className="text-xs text-muted-foreground">{folder.count}</span>
              </button>
              {folder.children && expandedFolders.includes(folder.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {folder.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => onSelectCategory(child.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                        selectedCategory === child.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {child.icon}
                      <span className="flex-1 text-left">{child.name}</span>
                      <span className="text-xs text-muted-foreground">{child.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trash */}
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={() => onSelectCategory("trash")}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              selectedCategory === "trash"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Trash2 className="size-4" />
            <span className="flex-1 text-left">ゴミ箱</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
