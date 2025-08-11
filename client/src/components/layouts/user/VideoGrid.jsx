import { VideoCard } from "./VideoCard"

export function VideoGrid({ videos, favorites, recentlyWatched, onVideoSelect, onToggleFavorite }) {
  return (
    <div className="space-y-8">
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <VideoCard
              video={video}
              isFavorite={favorites?.includes(video.id) || false}
              isRecentlyWatched={recentlyWatched?.includes(video.id) || false}
              onSelect={() => onVideoSelect(video)}
              onToggleFavorite={() => onToggleFavorite(video.id)}
              animationDelay={index * 0.1}
            />
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-background-elevated/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground-primary mb-2">
            No videos to display
          </h3>
          <p className="text-foreground-secondary max-w-md mx-auto">
            Try adjusting your filters or search terms to find more content
          </p>
        </div>
      )}
      
      {/* Loading State (if needed) */}
      {videos.length > 0 && (
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse-slow"></div>
            <span>Showing {videos.length} videos</span>
          </div>
        </div>
      )}
    </div>
  )
}