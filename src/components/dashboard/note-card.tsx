"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MoreHorizontal, Bookmark, ExternalLink } from "lucide-react";
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
  title: string;
  content: string;
  createdAt: string;
  isStarred: boolean;
  isBookmark: boolean;
  url?: string;
  category: string;
  tags?: string[];
}

interface NoteCardProps {
  note: Note;
  onToggleStar: (id: string) => void;
  onClick: (note: Note) => void;
}

export function NoteCard({ note, onToggleStar, onClick }: NoteCardProps) {
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
            {note.isBookmark && (
              <Bookmark className="size-3.5 fill-primary text-primary" />
            )}
            <h3 className="line-clamp-1 font-medium text-card-foreground">
              {note.title}
            </h3>
          </div>
          {note.url && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="size-3" />
              <span className="line-clamp-1">{new URL(note.url).hostname}</span>
            </div>
          )}
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
                note.isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
              )}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>編集</DropdownMenuItem>
              <DropdownMenuItem>フォルダに移動</DropdownMenuItem>
              <DropdownMenuItem>コピー</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">削除</DropdownMenuItem>
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
          <span className="ml-auto text-xs text-muted-foreground">{note.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}
