import React, { useState } from "react";
import {
  Play,
  Heart,
  Star,
  Clock,
  Eye,
  MoreVertical,
  Share2,
  Bookmark,
} from "lucide-react";

export function VideoCard({
  video,
  isFavorite,
  isRecentlyWatched,
  onSelect,
  onToggleFavorite,
  animationDelay = 0,
  variant = "default",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);


  const handleCardClick = () => {
    // For now, just call onSelect instead of navigating
    onSelect();
  };

  const getGenreColor = (genre) => {
    const colors = {
      horror: "from-red-500 to-rose-600",
      comedy: "from-yellow-500 to-orange-500",
      "sci-fi": "from-blue-500 to-indigo-600",
      action: "from-orange-500 to-red-500",
      drama: "from-purple-500 to-pink-500",
      thriller: "from-gray-600 to-gray-700",
      romance: "from-pink-500 to-rose-500",
      documentary: "from-green-500 to-emerald-600",
    };
    return colors[genre] || "from-gray-500 to-gray-600";
  };

  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-background-elevated rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer glass-effect">
        {/* Poster Container */}
        <div
          className="aspect-[2/3] relative overflow-hidden"
          style={{ backgroundColor: video.coverColor }}
          onClick={handleCardClick}
        >
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl"></div>
          </div>

          {/* Status Indicators */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {isRecentlyWatched && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span className="text-xs text-green-300 font-medium">Watched</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {isFavorite && (
              <div className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/30">
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Enhanced Play Button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isHovered ? "bg-black/40" : "bg-transparent"
            }`}
          >
            <div
              className={`w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                isHovered ? "scale-110 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>

          {/* Enhanced Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="font-medium">{video.year}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="font-medium">{video.rating}</span>
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{video.duration}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Info Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getGenreColor(
                video.genre
              )} text-white shadow-lg`}
            >
              {video.genre.toUpperCase()}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>

              <button className="p-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
                <Share2 className="w-4 h-4" />
              </button>

              <button className="p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="font-medium">
                {video.watchCount.toLocaleString()}
              </span>{" "}
              views
            </span>
            <span className="text-xs text-gray-500">
              {video.description.length > 100
                ? `${video.description.substring(0, 100)}...`
                : video.description}
            </span>
          </div>
        </div>

        {isHovered && (
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        )}
      </div>

      {/* Action Menu */}
      {showActions && (
        <div className="absolute top-16 right-3 w-48 bg-background-elevated/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          <div className="p-2">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-foreground-secondary hover:text-foreground-primary hover:bg-white/5 transition-all duration-200">
              <Play className="w-4 h-4" />
              <span>Play</span>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-foreground-secondary hover:text-foreground-primary hover:bg-white/5 transition-all duration-200">
              <Bookmark className="w-4 h-4" />
              <span>Add to List</span>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-foreground-secondary hover:text-foreground-primary hover:bg-white/5 transition-all duration-200">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <div className="border-t border-white/10 my-2"></div>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
              <span>Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
