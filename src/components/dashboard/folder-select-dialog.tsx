"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Inbox, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const folders = [
  { id: "inbox", name: "受信箱", icon: <Inbox className="size-4" /> },
  { id: "work", name: "仕事", icon: <FolderOpen className="size-4" /> },
  { id: "meetings", name: "会議メモ", icon: <Hash className="size-4" /> },
  { id: "projects", name: "プロジェクト", icon: <Hash className="size-4" /> },
  { id: "personal", name: "プライベート", icon: <FolderOpen className="size-4" /> },
  { id: "ideas", name: "アイデア", icon: <Hash className="size-4" /> },
  { id: "reading", name: "読書メモ", icon: <Hash className="size-4" /> },
  { id: "learning", name: "学習", icon: <FolderOpen className="size-4" /> },
];

interface FolderSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (folderId: string) => void;
  currentFolder: string;
}

export function FolderSelectDialog({
  isOpen,
  onClose,
  onSelect,
  currentFolder,
}: FolderSelectDialogProps) {
  const handleSelect = (folderId: string) => {
    onSelect(folderId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>フォルダに移動</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant="ghost"
              className={cn(
                "justify-start gap-3",
                currentFolder === folder.id && "bg-accent"
              )}
              onClick={() => handleSelect(folder.id)}
              disabled={currentFolder === folder.id}
            >
              {folder.icon}
              <span>{folder.name}</span>
              {currentFolder === folder.id && (
                <span className="ml-auto text-xs text-muted-foreground">現在のフォルダ</span>
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
