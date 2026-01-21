"use client";

import { cn } from "@/lib/utils";
import { NoteCard, type Note } from "./note-card";

interface NoteGridProps {
  notes: Note[];
  viewMode: "grid" | "list";
  onToggleStar: (id: string) => void;
  onNoteClick: (note: Note) => void;
}

export function NoteGrid({ notes, viewMode, onToggleStar, onNoteClick }: NoteGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-secondary p-4">
          <svg
            className="size-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">メモがありません</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          新しいメモを作成して、アイデアを記録しましょう
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col gap-3"
      )}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onToggleStar={onToggleStar}
          onClick={onNoteClick}
        />
      ))}
    </div>
  );
}
