import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Clock, Heart, Download } from "lucide-react";
import { Button } from "../../../components/ui/user/Buttons";

const genreColors = {
  all: "#8b5cf6",
  horror: "#dc2626",
  comedy: "#f59e0b",
  "sci-fi": "#06b6d4",
  action: "#ea580c",
  drama: "#7c3aed",
  documentary: "#10b981",
  educational: "#3b82f6",
  art: "#ec4899",
};

const genreThemes = {
  horror: "from-red-900/20 via-black to-red-950/30",
  comedy: "from-yellow-900/20 via-black to-pink-900/20",
  "sci-fi": "from-blue-900/20 via-black to-cyan-900/30",
  action: "from-orange-900/20 via-black to-red-900/20",
  drama: "from-purple-900/20 via-black to-indigo-900/30",
  all: "from-gray-900 via-black to-gray-900",
};

export function CinematicShelf({
  videos,
  favorites,
  recentlyWatched,
  onVideoSelect,
  onToggleFavorite,
  selectedGenre,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const videosPerPage = 6;
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const currentVideos = videos.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage
  );

  const genreColor = genreColors[selectedGenre] || genreColors.all;
  const genreTheme = genreThemes[selectedGenre] || genreThemes.all;

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${genreTheme} opacity-50`}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40"
            style={{
              backgroundColor: genreColor,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -200, 0],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12">
        {/* Shelf Title */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2
            className="text-5xl md:text-7xl font-bold mb-4 capitalize"
            style={{
              color: genreColor,
              textShadow: `0 0 30px ${genreColor}80, 0 0 60px ${genreColor}40`,
            }}
          >
            {selectedGenre === "all"
              ? "All Videos"
              : `${selectedGenre} Collection`}
          </h2>
          <div
            className="w-32 h-1 mx-auto rounded-full"
            style={{
              backgroundColor: genreColor,
              boxShadow: `0 0 20px ${genreColor}`,
            }}
          />
          <p className="text-gray-300 mt-4 text-lg">
            {videos.length} videos • Page {currentPage + 1} of {totalPages}
          </p>
        </motion.div>

        {/* 2D Shelf Structure */}
        <div className="relative w-full max-w-7xl mx-auto px-8">
          {/* Shelf Base */}
          <div
            className="w-full h-6 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-lg mb-4"
            style={{
              boxShadow: `0 0 30px ${genreColor}40, inset 0 2px 4px rgba(0,0,0,0.5)`,
            }}
          />

          {/* Video Cases Container */}
          <div className="flex justify-center items-end space-x-6 pb-8 flex-wrap gap-y-8">
            {currentVideos.map((video, videoIndex) => (
              <motion.div
                key={video.id}
                className="relative group cursor-pointer"
                initial={{
                  opacity: 0,
                  y: 100,
                  rotateY: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: videoIndex * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.1,
                  y: -20,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onVideoSelect(video)}
              >
                {/* DVD Case */}
                <div
                  className="w-40 h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 relative overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.6), 
                      0 0 30px ${genreColor}30,
                      inset 0 0 20px rgba(255,255,255,0.1)
                    `,
                  }}
                >
                  {/* Case Cover */}
                  <div
                    className="absolute inset-2 rounded-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${genreColor}60, ${
                        video.coverColor || genreColor
                      }40)`,
                    }}
                  >
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all"
                        whileHover={{ scale: 1.1 }}
                        animate={{
                          boxShadow: [
                            `0 0 20px ${genreColor}40`,
                            `0 0 40px ${genreColor}60`,
                            `0 0 20px ${genreColor}40`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </motion.div>
                    </div>

                    {/* Recently Watched Indicator */}
                    {recentlyWatched?.includes(video.id) && (
                      <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}

                    {/* Video Info Overlay */}
                    <motion.div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white text-sm font-bold truncate mb-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-bold capitalize"
                          style={{
                            backgroundColor: genreColor,
                            color: "white",
                          }}
                        >
                          {video.genre}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-yellow-400">
                            {video.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {video.year}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1 text-xs h-7"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(video.id);
                          }}
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              favorites?.includes(video.id)
                                ? "fill-current text-red-500"
                                : ""
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Holographic Reflection */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${genreColor}60, transparent)`,
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                {/* Floating Genre Badge */}
                <motion.div
                  className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold z-10 capitalize"
                  style={{
                    backgroundColor: genreColor,
                    color: "white",
                    boxShadow: `0 0 15px ${genreColor}`,
                  }}
                  animate={{
                    rotateZ: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {video.genre}
                </motion.div>

                {/* Rating Stars */}
                <motion.div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(video.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-white ml-1">
                    {video.rating}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="bg-black/50 border-white/20"
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentPage === index
                        ? "scale-125"
                        : "hover:scale-110"
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === index
                          ? genreColor
                          : "rgba(255,255,255,0.3)",
                      boxShadow:
                        currentPage === index
                          ? `0 0 15px ${genreColor}`
                          : "none",
                    }}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="bg-black/50 border-white/20"
              >
                Next
              </Button>
            </div>
          )}

          {/* Ambient Lighting Effects */}
          <div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{
              background: `
                radial-gradient(ellipse at 30% 100%, ${genreColor}15 0%, transparent 50%),
                radial-gradient(ellipse at 70% 100%, ${genreColor}10 0%, transparent 50%)
              `,
            }}
          />
        </div>
      </div>

      {/* Mood Lighting Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${genreColor}05 0%, transparent 50%)`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
