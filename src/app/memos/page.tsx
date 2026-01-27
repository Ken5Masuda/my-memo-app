"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header, SortOrder } from "@/components/dashboard/header";
import { NoteGrid } from "@/components/dashboard/note-grid";
import { NoteEditor } from "@/components/dashboard/note-editor";
import { FolderSelectDialog } from "@/components/dashboard/folder-select-dialog";
import { DeleteConfirmDialog } from "@/components/dashboard/delete-confirm-dialog";
import type { Note } from "@/components/dashboard/note-card";
import { supabase } from "@/lib/supabase";
import { AuthGuard, useAuth } from "@/components/auth/auth-guard";

function Dashboard() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("created_at");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ダイアログ用の状態
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNoteForAction, setSelectedNoteForAction] = useState<Note | null>(null);

  // ダークモードの切り替え
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // メモをSupabaseから取得
  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("memos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("メモの取得に失敗しました:", error);
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error("メモの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回ロード時にメモを取得
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // フィルタリングとソート
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by category/folder
    if (selectedCategory !== "all") {
      if (selectedCategory === "starred") {
        filtered = filtered.filter((note) => note.is_starred);
      } else if (selectedCategory === "bookmarks") {
        filtered = filtered.filter((note) => note.is_bookmarked);
      } else {
        // フォルダでフィルタ
        filtered = filtered.filter((note) => note.folder === selectedCategory);
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

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "updated_at":
          return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
        case "title":
          return a.title.localeCompare(b.title, "ja");
        default:
          return 0;
      }
    });

    return sorted;
  }, [notes, selectedCategory, searchQuery, sortOrder]);

  // スター切り替え
  const handleToggleStar = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const newStarred = !note.is_starred;

    // 楽観的更新
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_starred: newStarred } : n))
    );

    // DBを更新
    const { error } = await supabase
      .from("memos")
      .update({ is_starred: newStarred, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("スターの更新に失敗しました:", error);
      // 失敗したら元に戻す
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_starred: !newStarred } : n))
      );
    }
  };

  // メモクリック（編集モーダルを開く）
  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // 新規メモ作成
  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  // メモ保存（新規作成・更新）
  const handleSaveNote = async (
    noteData: Partial<Note> & { title: string; content: string }
  ) => {
    if (!user) return;

    if (noteData.id) {
      // 既存メモの更新
      const { error } = await supabase
        .from("memos")
        .update({
          title: noteData.title,
          content: noteData.content,
          folder: noteData.folder,
          tags: noteData.tags,
          is_starred: noteData.is_starred,
          is_bookmarked: noteData.is_bookmarked,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteData.id);

      if (error) {
        console.error("メモの更新に失敗しました:", error);
        toast.error("メモの更新に失敗しました");
        return;
      }

      // ローカル状態を更新
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteData.id
            ? {
                ...note,
                title: noteData.title,
                content: noteData.content,
                folder: noteData.folder || note.folder,
                tags: noteData.tags || note.tags,
                is_starred: noteData.is_starred ?? note.is_starred,
                is_bookmarked: noteData.is_bookmarked ?? note.is_bookmarked,
                updated_at: new Date().toISOString(),
              }
            : note
        )
      );
      toast.success("メモを更新しました");
    } else {
      // 新規メモ作成
      const newNote = {
        user_id: user.id,
        title: noteData.title,
        content: noteData.content,
        folder: noteData.folder || "inbox",
        tags: noteData.tags || [],
        is_starred: noteData.is_starred || false,
        is_bookmarked: noteData.is_bookmarked || false,
      };

      const { data, error } = await supabase
        .from("memos")
        .insert(newNote)
        .select()
        .single();

      if (error) {
        console.error("メモの作成に失敗しました:", error);
        toast.error("メモの作成に失敗しました");
        return;
      }

      // ローカル状態に追加
      setNotes((prev) => [data, ...prev]);
      toast.success("メモを作成しました");
    }
  };

  // メモ削除
  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from("memos").delete().eq("id", id);

    if (error) {
      console.error("メモの削除に失敗しました:", error);
      toast.error("メモの削除に失敗しました");
      return;
    }

    // ローカル状態から削除
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("メモを削除しました");
  };

  // エディタを閉じる
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  // コンテキストメニュー: 編集
  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // コンテキストメニュー: フォルダに移動ダイアログを開く
  const handleOpenFolderDialog = (note: Note) => {
    setSelectedNoteForAction(note);
    setIsFolderDialogOpen(true);
  };

  // フォルダ移動を実行
  const handleMoveToFolder = async (folderId: string) => {
    if (!selectedNoteForAction) return;

    const { error } = await supabase
      .from("memos")
      .update({ folder: folderId, updated_at: new Date().toISOString() })
      .eq("id", selectedNoteForAction.id);

    if (error) {
      console.error("フォルダの移動に失敗しました:", error);
      toast.error("フォルダの移動に失敗しました");
      return;
    }

    // ローカル状態を更新
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteForAction.id
          ? { ...note, folder: folderId, updated_at: new Date().toISOString() }
          : note
      )
    );

    toast.success("フォルダに移動しました");
    setSelectedNoteForAction(null);
  };

  // コンテキストメニュー: コピー（複製）
  const handleCopy = async (note: Note) => {
    if (!user) return;

    const copiedNote = {
      user_id: user.id,
      title: `${note.title} (コピー)`,
      content: note.content,
      folder: note.folder,
      tags: note.tags,
      is_starred: false,
      is_bookmarked: false,
    };

    const { data, error } = await supabase
      .from("memos")
      .insert(copiedNote)
      .select()
      .single();

    if (error) {
      console.error("メモのコピーに失敗しました:", error);
      toast.error("メモのコピーに失敗しました");
      return;
    }

    // ローカル状態に追加
    setNotes((prev) => [data, ...prev]);
    toast.success("メモをコピーしました");
  };

  // コンテキストメニュー: 削除ダイアログを開く
  const handleOpenDeleteDialog = (note: Note) => {
    setSelectedNoteForAction(note);
    setIsDeleteDialogOpen(true);
  };

  // 削除を実行
  const handleConfirmDelete = async () => {
    if (!selectedNoteForAction) return;

    const { error } = await supabase
      .from("memos")
      .delete()
      .eq("id", selectedNoteForAction.id);

    if (error) {
      console.error("メモの削除に失敗しました:", error);
      toast.error("メモの削除に失敗しました");
      return;
    }

    // ローカル状態から削除
    setNotes((prev) => prev.filter((note) => note.id !== selectedNoteForAction.id));
    toast.success("メモを削除しました");
    setSelectedNoteForAction(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        notes={notes}
      />

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
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary"></div>
                <p className="mt-2 text-muted-foreground">読み込み中...</p>
              </div>
            </div>
          ) : (
            <NoteGrid
              notes={filteredNotes}
              viewMode={viewMode}
              onToggleStar={handleToggleStar}
              onNoteClick={handleNoteClick}
              onEdit={handleEdit}
              onMoveToFolder={handleOpenFolderDialog}
              onCopy={handleCopy}
              onDelete={handleOpenDeleteDialog}
            />
          )}
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

      {/* Folder Select Dialog */}
      <FolderSelectDialog
        isOpen={isFolderDialogOpen}
        onClose={() => {
          setIsFolderDialogOpen(false);
          setSelectedNoteForAction(null);
        }}
        onSelect={handleMoveToFolder}
        currentFolder={selectedNoteForAction?.folder || "inbox"}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedNoteForAction(null);
        }}
        onConfirm={handleConfirmDelete}
        noteTitle={selectedNoteForAction?.title || ""}
      />
    </div>
  );
}

// 認証ガードでラップしてエクスポート
export default function MemosPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
