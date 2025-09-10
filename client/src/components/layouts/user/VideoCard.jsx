import React, { useState } from "react";
import {
  Play,
  Heart,
  Star,
  Eye,
  Loader2,
} from "lucide-react";
import DirectVideoPlayer from "../../ui/DirectVideoPlayer";
import videoService from "../../../services/video";
import favoritesService from "../../../services/favorites";
import { useAuth } from "../../../context/AuthContext.jsx";

export function VideoCard({
  video,
  isFavorite: initialIsFavorite,
  isRecentlyWatched,
  onSelect,
  onToggleFavorite,
  animationDelay = 0,
}) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  // Keep local state in sync if parent prop changes
  React.useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite, video?.id]);

  // Build TMDB image URL if available
  const tmdbBase = 'https://image.tmdb.org/t/p';
  const posterSize = 'w500';
  const fallbackColor = video?.coverColor || '#111827'; // neutral-900 fallback
  const imagePath = video?.poster_path || video?.backdrop_path || video?.poster || video?.image || null;
  const imageUrl = imagePath ? `${tmdbBase}/${posterSize}${imagePath}` : null;

  const handleCardClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Card clicked!', video.title); // Simple click test
    
    if (loading) return;
    
    if (onSelect) onSelect();
    
    try {
      setLoading(true);
      console.log(`🎬 Loading video for: ${video.title} (ID: ${video.id})`);
      console.log('🔍 Full video object:', video);
      console.log('🆔 Video ID type:', typeof video.id, video.id);
      
      // Ensure we have a valid ID
      if (!video.id) {
        throw new Error('No video ID available');
      }
      
      const response = await videoService.getVideoForPlay(video.id);
      console.log('📡 API Response:', response);
      
      if (response && response.ok) {
        console.log('🎞️ Video data received:', response.data);
        setVideoData(response.data);
        setShowPlayer(true);
        console.log(`✅ Video loaded successfully: ${video.title}`);
      } else {
        console.error('❌ Failed to load video:', response);
        console.log('🔍 Response details:', {
          ok: response?.ok,
          message: response?.message,
          status: response?.status,
          data: response?.data
        });
        alert(`Sorry, we couldn't load the trailer for "${video.title}". Error: ${response?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('🚨 Error loading video:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Error loading video: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  return (
    <div
      className="group relative"
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Container */}
      <div 
        className={`relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 cursor-pointer ${loading ? 'opacity-75' : ''}`}
        onClick={handleCardClick}
      >
        
        {/* Poster Container */}
        <div
          className="aspect-[2/3] relative overflow-hidden"
          style={{ backgroundColor: fallbackColor }}
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
            isHovered ? "bg-black/20" : "bg-transparent"
          }`}>
            <div className={`w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
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
            onClick={async (e) => {
              e.stopPropagation();
              if (!user?.id) {
                alert("Please log in to add favorites");
                return;
              }
              const next = !isFavorite;
              // Optimistic UI update
              setIsFavorite(next);
              try {
                if (next) {
                  await favoritesService.addToFavorites(user.id, video.id);
                } else {
                  await favoritesService.removeFromFavorites(user.id, video.id);
                }
                if (onToggleFavorite) onToggleFavorite();
              } catch (err) {
                console.error("Favorite toggle failed:", err);
                // Revert on failure
                setIsFavorite(!next);
              }
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {/* Use fill via attribute to avoid Tailwind purge issues */}
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
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
          onClose={() => {
            setShowPlayer(false);
            setVideoData(null);
          }}
        />
      )}
    </div>
  );
}