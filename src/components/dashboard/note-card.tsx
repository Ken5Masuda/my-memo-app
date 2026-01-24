"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MoreHorizontal, Bookmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  is_starred: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at?: string;
}

interface NoteCardProps {
  note: Note;
  onToggleStar: (id: string) => void;
  onClick: (note: Note) => void;
  onEdit: (note: Note) => void;
  onMoveToFolder: (note: Note) => void;
  onCopy: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export function NoteCard({ note, onToggleStar, onClick, onEdit, onMoveToFolder, onCopy, onDelete }: NoteCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 ease-out",
        "border-border/50 bg-card",
        "hover:-translate-y-1.5 hover:border-primary/40",
        "hover:shadow-xl hover:shadow-primary/10"
      )}
      onClick={() => onClick(note)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {note.is_bookmarked && (
              <Bookmark className="size-3.5 fill-primary text-primary" />
            )}
            <h3 className="line-clamp-1 font-medium text-card-foreground">
              {note.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(note.id);
            }}
          >
            <Star
              className={cn(
                "size-4",
                note.is_starred ? "fill-star text-star" : "text-muted-foreground"
              )}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit(note)}>編集</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMoveToFolder(note)}>フォルダに移動</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(note)}>コピー</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(note)}>削除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
          {note.content}
        </p>
        <div className="mt-4 flex items-center justify-between">
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(note.created_at).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
