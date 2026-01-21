"use client";

import React from "react";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  X,
  Star,
  Bookmark,
  Trash2,
  MoreHorizontal,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Code,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note } from "@/components/dashboard/note-card";

interface NoteEditorProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note> & { title: string; content: string }) => void;
  onDelete?: (id: string) => void;
}

const folders = [
  { id: "work", name: "仕事" },
  { id: "personal", name: "プライベート" },
  { id: "learning", name: "学習" },
  { id: "meetings", name: "会議メモ" },
  { id: "projects", name: "プロジェクト" },
  { id: "ideas", name: "アイデア" },
  { id: "reading", name: "読書メモ" },
];

export function NoteEditor({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("personal");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const isEditing = !!note;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsStarred(note.isStarred);
      setIsBookmark(note.isBookmark);
      setUrl(note.url || "");
      setCategory(note.category || "personal");
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setIsStarred(false);
      setIsBookmark(false);
      setUrl("");
      setCategory("personal");
      setTags([]);
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: note?.id,
      title,
      content,
      isStarred,
      isBookmark,
      url: url || undefined,
      category,
      tags,
      createdAt: note?.createdAt || new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Editor Modal */}
      <div className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {isEditing ? "メモを編集" : "新規メモ作成"}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsStarred(!isStarred)}
              className={cn(
                "size-9",
                isStarred && "text-yellow-500 hover:text-yellow-600"
              )}
            >
              <Star className={cn("size-4", isStarred && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmark(!isBookmark)}
              className={cn(
                "size-9",
                isBookmark && "text-primary hover:text-primary/80"
              )}
            >
              <Bookmark className={cn("size-4", isBookmark && "fill-current")} />
            </Button>
            {isEditing && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-9">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      onDelete(note.id);
                      onClose();
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="size-9">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力..."
            className="mb-4 border-none bg-transparent px-0 text-2xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0"
          />

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-border pb-4">
            <Button variant="ghost" size="icon" className="size-8">
              <Bold className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Italic className="size-4" />
            </Button>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button variant="ghost" size="icon" className="size-8">
              <List className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <ListOrdered className="size-4" />
            </Button>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button variant="ghost" size="icon" className="size-8">
              <Link2 className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <ImageIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Code className="size-4" />
            </Button>
          </div>

          {/* URL field for bookmarks */}
          {isBookmark && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                URL
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="bg-secondary/50"
              />
            </div>
          )}

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容を入力..."
            className="min-h-[300px] resize-none border-none bg-transparent px-0 text-base leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          {/* Folder selection */}
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-muted-foreground">
              フォルダ
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  {folders.find((f) => f.id === category)?.name || "選択"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => setCategory(folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              タグ
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="タグを追加..."
                className="h-7 w-32 bg-secondary/50 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {note?.createdAt && `作成日: ${note.createdAt}`}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onClose}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()}>
                {isEditing ? "保存" : "作成"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
