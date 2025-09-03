import { X, Play, Plus, Download, Share2, Heart, Calendar, Clock, Star } from "lucide-react";

export function VideoModal({ video, isFavorite, onClose, onToggleFavorite }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="relative">
          <div
            className="h-80 rounded-t-2xl relative overflow-hidden"
            style={{ backgroundColor: video.coverColor }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            {/* Film grain effect */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white hover:bg-black/30 rounded-full p-3 transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Favorite button */}
            <button
              onClick={onToggleFavorite}
              className={`absolute top-6 right-20 rounded-full p-3 transition-colors backdrop-blur-sm ${
                isFavorite ? "text-yellow-400 hover:bg-yellow-400/20" : "text-white hover:bg-white/20"
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-4xl font-bold text-white mb-2">{video.title}</h2>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {video.year}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {video.rating}
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-300 mb-8 leading-relaxed text-lg">{video.description}</p>

          {/* Action buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105">
              <Play className="w-5 h-5" />
              Watch Now
            </button>
            <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl transition-all duration-200 shadow-lg">
              <Plus className="w-5 h-5" />
              Watchlist
            </button>
            <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl transition-all duration-200 shadow-lg">
              <Download className="w-5 h-5" />
              Download
            </button>
            <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl transition-all duration-200 shadow-lg">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{video.watchCount.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Views</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{video.rating}</div>
              <div className="text-gray-400 text-sm">User Rating</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{video.year}</div>
              <div className="text-gray-400 text-sm">Release Year</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
