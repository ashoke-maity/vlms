import React, { useState } from "react";
import {
  Play,
  Heart,
  Star,
  Clock,
  Eye,
  MoreVertical,
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

  const handleCardClick = () => {
    onSelect();
  };

  return (
    <div
      className="group relative"
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Container */}
      <div className="relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 cursor-pointer">
        
        {/* Poster Container */}
        <div
          className="aspect-[2/3] relative overflow-hidden"
          style={{ backgroundColor: video.coverColor }}
          onClick={handleCardClick}
        >
          {/* Simple Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Play Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "bg-black/20" : "bg-transparent"
          }`}>
            <div className={`w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}>
              <Play className="w-5 h-5 text-black ml-0.5" />
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Recently Watched Indicator */}
          {isRecentlyWatched && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
              Watched
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2">
            {video.title}
          </h3>
          
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
            <span>{video.year}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{video.rating}</span>
            </div>
            <span>•</span>
            <span>{video.duration}</span>
          </div>

          {/* Genre */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              {video.genre}
            </span>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Eye className="w-3 h-3" />
              <span>{typeof video.watchCount === 'number' ? video.watchCount.toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
