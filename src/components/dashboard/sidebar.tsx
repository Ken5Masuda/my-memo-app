"use client";

import React from "react"

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  Bookmark,
  Star,
  Archive,
  Trash2,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  isFolder?: boolean;
  children?: Category[];
}

const categories: Category[] = [
  { id: "all", name: "すべてのメモ", icon: <FileText className="size-4" />, count: 24 },
  { id: "bookmarks", name: "ブックマーク", icon: <Bookmark className="size-4" />, count: 12 },
  { id: "starred", name: "スター付き", icon: <Star className="size-4" />, count: 5 },
  { id: "archive", name: "アーカイブ", icon: <Archive className="size-4" />, count: 8 },
];

const folders: Category[] = [
  {
    id: "work",
    name: "仕事",
    icon: <FolderOpen className="size-4" />,
    count: 10,
    isFolder: true,
    children: [
      { id: "meetings", name: "会議メモ", icon: <Hash className="size-4" />, count: 4 },
      { id: "projects", name: "プロジェクト", icon: <Hash className="size-4" />, count: 6 },
    ],
  },
  {
    id: "personal",
    name: "プライベート",
    icon: <FolderOpen className="size-4" />,
    count: 8,
    isFolder: true,
    children: [
      { id: "ideas", name: "アイデア", icon: <Hash className="size-4" />, count: 3 },
      { id: "reading", name: "読書メモ", icon: <Hash className="size-4" />, count: 5 },
    ],
  },
  {
    id: "learning",
    name: "学習",
    icon: <FolderOpen className="size-4" />,
    count: 6,
    isFolder: true,
  },
];

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["work", "personal"]);

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
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
          <Settings className="size-4" />
          <span>設定</span>
        </button>
      </div>
    </aside>
  );
}
