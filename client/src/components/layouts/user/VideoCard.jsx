import React, { useState } from "react";
import {
  Play,
  Heart,
  Star,
  Clock,
  Eye,
  MoreVertical,
  Loader2,
} from "lucide-react";
import DirectVideoPlayer from "../../ui/DirectVideoPlayer";
import videoService from "../../../services/video";

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
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Build TMDB image URL if available
  const tmdbBase = 'https://image.tmdb.org/t/p';
  const posterSize = 'w500';
  const fallbackColor = video?.coverColor || '#111827'; // neutral-900 fallback
  const imagePath = video?.poster_path || video?.backdrop_path || video?.poster || video?.image || null;
  const imageUrl = imagePath ? `${tmdbBase}/${posterSize}${imagePath}` : null;

  const handleCardClick = async () => {
    if (loading) return;
    
    onSelect();
    
    try {
      setLoading(true);
      const response = await videoService.getVideoForPlay(video.id);
      
      if (response && response.ok) {
        setVideoData(response.data);
        setShowPlayer(true);
      } else {
        console.error('Failed to load video:', response?.message || 'Unknown error');
        // Show a more user-friendly error message
        alert(`Sorry, we couldn't load the trailer for "${video.title}". Please try again.`);
      }
    } catch (error) {
      console.error('Video API error:', error);
      alert(`Unable to play "${video.title}" right now. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setVideoData(null);
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
          style={{ backgroundColor: fallbackColor }}
          onClick={handleCardClick}
        >
          {/* Poster/Backdrop Image if available */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={video?.title || video?.name || 'Poster'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}

          {/* Simple Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Play Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered || loading ? "bg-black/20" : "bg-transparent"
          }`}>
            <div className={`w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered || loading ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}>
              {loading ? (
                <Loader2 className="w-5 h-5 text-black animate-spin" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" />
              )}
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
            <span>{video.year || 'N/A'}</span>
            {video.rating && video.rating !== 'N/A' && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{video.rating}</span>
                </div>
              </>
            )}
            {video.vote_count && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{video.vote_count.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Description Preview */}
          {video.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Video Player Modal */}
      {showPlayer && videoData && (
        <DirectVideoPlayer 
          videoData={videoData}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
