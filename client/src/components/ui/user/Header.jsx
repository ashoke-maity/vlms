import React from "react";
import { SearchBar } from "./Searchbar";

export function Header({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalVideos = 0,
  totalFavorites = 0,
}) {
  return (
    <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600" />
          <h1 className="text-xl font-bold text-white">VLMS</h1>
          <span className="text-sm text-foreground-secondary hidden sm:inline">
            Video Library
          </span>
        </div>

        <div className="flex-1 flex justify-center">
          <SearchBar onSearch={onSearchChange} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-foreground-secondary">
            {totalVideos} videos
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-foreground-secondary">
            {totalFavorites} favorites
          </span>
        </div>
      </div>
    </header>
  );
}


