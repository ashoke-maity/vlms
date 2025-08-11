import React from "react";
import { Heart, Play } from "lucide-react";

export function VideoList({
  videos = [],
  favorites = [],
  recentlyWatched = [],
  onVideoSelect,
  onToggleFavorite,
}) {
  return (
    <div className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center justify-between gap-4 p-4 bg-background-elevated/50 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-16 h-10 rounded-md"
              style={{ backgroundColor: video.coverColor }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-medium truncate">{video.title}</h4>
                {recentlyWatched.includes(video.id) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    Watched
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-secondary truncate">
                {video.year} • {video.genre} • {video.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onVideoSelect(video)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm hover:from-indigo-600 hover:to-purple-700"
            >
              <Play className="w-4 h-4 inline mr-1" /> Play
            </button>
            <button
              onClick={() => onToggleFavorite(video.id)}
              className={`p-2 rounded-lg border text-sm transition-colors ${
                favorites.includes(video.id)
                  ? "border-red-500/30 text-red-400 bg-red-500/10"
                  : "border-white/10 text-foreground-secondary hover:text-foreground-primary hover:bg-white/5"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorites.includes(video.id) ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      ))}
      {videos.length === 0 && (
        <div className="p-8 text-center text-foreground-secondary">No videos to display</div>
      )}
    </div>
  );
}


