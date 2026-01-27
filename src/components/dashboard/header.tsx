"use client";

import { Search, Plus, SlidersHorizontal, Grid3X3, List, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOrder = "created_at" | "updated_at" | "title";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onNewNote: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const sortLabels: Record<SortOrder, string> = {
  created_at: "作成日順",
  updated_at: "更新日順",
  title: "タイトル順",
};

export function Header({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onNewNote,
  isDarkMode,
  onToggleDarkMode,
  sortOrder,
  onSortChange,
}: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">マイノート</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-9 bg-secondary border-0"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-transparent" title={sortLabels[sortOrder]}>
              <SlidersHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onSortChange("created_at")}
              className={sortOrder === "created_at" ? "bg-accent" : ""}
            >
              作成日順
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("updated_at")}
              className={sortOrder === "updated_at" ? "bg-accent" : ""}
            >
              更新日順
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("title")}
              className={sortOrder === "title" ? "bg-accent" : ""}
            >
              タイトル順
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-border bg-secondary p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => onViewModeChange("list")}
          >
            <List className="size-4" />
          </Button>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="bg-transparent"
        >
          {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {/* New Note Button */}
        <Button onClick={onNewNote} className="gap-2">
          <Plus className="size-4" />
          新規作成
        </Button>
      </div>
    </header>
  );
}
