"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
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
  Code,
  ChevronDown,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note } from "@/components/dashboard/note-card";

// TipTap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

// バリデーション定数
const VALIDATION = {
  TITLE_MAX_LENGTH: 100,
  CONTENT_MAX_LENGTH: 10000,
  TAG_MAX_LENGTH: 30,
  TAGS_MAX_COUNT: 10,
};

interface NoteEditorProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note> & { title: string; content: string }) => void;
  onDelete?: (id: string) => void;
}

const folders = [
  { id: "inbox", name: "受信箱" },
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
  const [isStarred, setIsStarred] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [folder, setFolder] = useState("inbox");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // バリデーションエラー
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});

  const isEditing = !!note;

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder: "内容を入力...",
      }),
    ],
    content: "",
    immediatelyRender: false, // SSRハイドレーションエラー回避
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] prose prose-invert max-w-none focus:outline-none text-foreground prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > VALIDATION.CONTENT_MAX_LENGTH) {
        setErrors((prev) => ({
          ...prev,
          content: `本文は${VALIDATION.CONTENT_MAX_LENGTH}文字以内で入力してください`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, content: undefined }));
      }
    },
  });

  // リンク追加
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URLを入力してください", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // バリデーションチェック
  const validateTitle = (value: string) => {
    if (value.length > VALIDATION.TITLE_MAX_LENGTH) {
      return `タイトルは${VALIDATION.TITLE_MAX_LENGTH}文字以内で入力してください`;
    }
    return undefined;
  };

  const validateTag = (value: string) => {
    if (value.length > VALIDATION.TAG_MAX_LENGTH) {
      return `タグは${VALIDATION.TAG_MAX_LENGTH}文字以内で入力してください`;
    }
    if (tags.length >= VALIDATION.TAGS_MAX_COUNT) {
      return `タグは最大${VALIDATION.TAGS_MAX_COUNT}個までです`;
    }
    return undefined;
  };

  // タイトル変更ハンドラ
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const error = validateTitle(value);
    setErrors((prev) => ({ ...prev, title: error }));
  };

  // note/isOpen変更時にエディタをリセット
  useEffect(() => {
    if (!editor) return;

    if (note) {
      setTitle(note.title);
      editor.commands.setContent(note.content || "");
      setIsStarred(note.is_starred);
      setIsBookmarked(note.is_bookmarked);
      setFolder(note.folder || "inbox");
      setTags(note.tags || []);
    } else {
      setTitle("");
      editor.commands.setContent("");
      setIsStarred(false);
      setIsBookmarked(false);
      setFolder("inbox");
      setTags([]);
    }
    setErrors({});
    setNewTag("");
  }, [note, isOpen, editor]);

  const handleSave = () => {
    if (!title.trim() || !editor) return;

    if (errors.title || errors.content) {
      return;
    }

    const content = editor.getHTML();

    onSave({
      id: note?.id,
      title,
      content,
      is_starred: isStarred,
      is_bookmarked: isBookmarked,
      folder,
      tags,
    });
    onClose();
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;

    const error = validateTag(trimmedTag);
    if (error) {
      setErrors((prev) => ({ ...prev, tag: error }));
      return;
    }

    if (tags.includes(trimmedTag)) {
      setErrors((prev) => ({ ...prev, tag: "このタグは既に追加されています" }));
      return;
    }

    setTags([...tags, trimmedTag]);
    setNewTag("");
    setErrors((prev) => ({ ...prev, tag: undefined }));
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

  const contentLength = editor?.getText().length || 0;

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
                isStarred && "text-star hover:text-star/80"
              )}
            >
              <Star className={cn("size-4", isStarred && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "size-9",
                isBookmarked && "text-primary hover:text-primary/80"
              )}
            >
              <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
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
          <div className="mb-4">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="タイトルを入力..."
              className={cn(
                "border-none bg-transparent px-0 text-2xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0",
                errors.title && "text-destructive"
              )}
              maxLength={VALIDATION.TITLE_MAX_LENGTH + 10}
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              {errors.title ? (
                <span className="text-destructive">{errors.title}</span>
              ) : (
                <span />
              )}
              <span
                className={cn(
                  "text-muted-foreground",
                  title.length > VALIDATION.TITLE_MAX_LENGTH && "text-destructive"
                )}
              >
                {title.length} / {VALIDATION.TITLE_MAX_LENGTH}
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-border pb-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("bold") && "bg-accent")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
              title="太字"
            >
              <Bold className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("italic") && "bg-accent")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
              title="斜体"
            >
              <Italic className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("code") && "bg-accent")}
              onClick={() => editor?.chain().focus().toggleCode().run()}
              disabled={!editor}
              title="コード"
            >
              <Code className="size-4" />
            </Button>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("bulletList") && "bg-accent")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
              title="箇条書きリスト"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("orderedList") && "bg-accent")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
              title="番号付きリスト"
            >
              <ListOrdered className="size-4" />
            </Button>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8", editor?.isActive("link") && "bg-accent")}
              onClick={setLink}
              disabled={!editor}
              title="リンク"
            >
              <Link2 className="size-4" />
            </Button>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              title="元に戻す"
            >
              <Undo className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              title="やり直す"
            >
              <Redo className="size-4" />
            </Button>
          </div>

          {/* Editor Content */}
          <div>
            <EditorContent editor={editor} />
            <div className="mt-1 flex items-center justify-between text-xs">
              {errors.content ? (
                <span className="text-destructive">{errors.content}</span>
              ) : (
                <span />
              )}
              <span
                className={cn(
                  "text-muted-foreground",
                  contentLength > VALIDATION.CONTENT_MAX_LENGTH && "text-destructive"
                )}
              >
                {contentLength.toLocaleString()} / {VALIDATION.CONTENT_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>
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
                  {folders.find((f) => f.id === folder)?.name || "選択"}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {folders.map((f) => (
                  <DropdownMenuItem key={f.id} onClick={() => setFolder(f.id)}>
                    {f.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                タグ
              </label>
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  tags.length >= VALIDATION.TAGS_MAX_COUNT && "text-destructive"
                )}
              >
                {tags.length} / {VALIDATION.TAGS_MAX_COUNT}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
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
                onChange={(e) => {
                  setNewTag(e.target.value);
                  if (errors.tag) {
                    setErrors((prev) => ({ ...prev, tag: undefined }));
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="タグを追加..."
                className={cn(
                  "h-7 w-32 bg-secondary/50 text-sm",
                  errors.tag && "border-destructive"
                )}
                maxLength={VALIDATION.TAG_MAX_LENGTH + 5}
                disabled={tags.length >= VALIDATION.TAGS_MAX_COUNT}
              />
            </div>
            {errors.tag && (
              <p className="mt-1 text-xs text-destructive">{errors.tag}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {note?.created_at &&
                `作成日: ${new Date(note.created_at).toLocaleDateString("ja-JP")}`}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !!errors.title || !!errors.content}
              >
                {isEditing ? "保存" : "作成"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
