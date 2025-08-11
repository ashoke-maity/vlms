import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { VideoCard } from "../../../components/layouts/user/VideoCard"

export function VideoCarousel({
  videos,
  favorites,
  recentlyWatched,
  onVideoSelect,
  onToggleFavorite,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)

  const itemsPerView = 5
  const maxIndex = Math.max(0, videos.length - itemsPerView)

  const scroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex(Math.max(0, currentIndex - 1))
    } else {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1))
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, maxIndex])

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-background-elevated/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 
                2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground-primary mb-2">
          No videos to display
        </h3>
        <p className="text-foreground-secondary max-w-md mx-auto">
          Add some videos to see them in the carousel
        </p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Navigation Controls */}
      <div className="absolute top-0 right-0 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-3 bg-background-elevated/80 backdrop-blur-sm border border-white/10 rounded-xl text-foreground-secondary hover:text-foreground-primary hover:bg-white/10 transition-all duration-200"
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
            className="p-3 bg-background-elevated/80 backdrop-blur-sm border border-white/10 rounded-xl text-foreground-secondary hover:text-foreground-primary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={currentIndex >= maxIndex}
            className="p-3 bg-background-elevated/80 backdrop-blur-sm border border-white/10 rounded-xl text-foreground-secondary hover:text-foreground-primary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-700 ease-out gap-6 p-2"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex-shrink-0 animate-fade-in"
              style={{
                width: `${100 / itemsPerView}%`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <VideoCard
                video={video}
                isFavorite={favorites?.includes(video.id) || false}
                isRecentlyWatched={recentlyWatched?.includes(video.id) || false}
                onSelect={() => onVideoSelect(video)}
                onToggleFavorite={() => onToggleFavorite(video.id)}
                animationDelay={index * 0.1}
                variant="carousel"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative transition-all duration-300 group ${
                index === currentIndex
                  ? "w-8 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  : "w-2 h-2 bg-foreground-muted hover:bg-foreground-secondary rounded-full"
              }`}
            >
              {index === currentIndex && (
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-sm"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && maxIndex > 0 && (
        <div className="mt-4">
          <div className="w-full bg-background-elevated/50 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background-primary to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background-primary to-transparent pointer-events-none z-10"></div>
    </div>
  )
}
