import { useState, useEffect } from "react";
import Header from "../../components/ui/user/Header";
import { VideoGrid } from "../../components/layouts/user/VideoGrid";
import { VideoCarousel } from "../../components/layouts/user/VideoCarousel";
import { VideoList } from "../../components/ui/user/VideoList";
import { CinematicShelf } from "../../components/layouts/user/CinematicShelf";
import { GenreSelector } from "../../components/layouts/user/GenreSelector";
import { ViewModeSelector } from "../../components/layouts/user/ViewModeSelector";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import { HeroSection } from "../../components/layouts/user/HeroSection";
import { mockVideos } from "../../libs/mockVideos";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  Star,
  Play,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);


  const filteredVideos = mockVideos.filter((video) => {
    const matchesGenre =
      selectedGenre === "all" || video.genre === selectedGenre;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const toggleFavorite = (videoId) => {
    setFavorites((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleVideoSelect = (video) => {
    setRecentlyWatched((prev) => [video.id, ...prev.filter((id) => id !== video.id)].slice(0, 5));
  };

  const featuredVideos = mockVideos.slice(0, 6);
  const trendingVideos = mockVideos.filter(v => v.watchCount > 1000).slice(0, 8);

  const heroSlides = [
    {
      id: 1,
      title: "AVATAR",
      subtitle: "Enter the world of Pandora and discover a new dimension of storytelling",
      genre: "Sci-Fi",
      year: "2022",
      rating: "9.2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&h=800&fit=crop",
      color: "from-cyan-600 to-blue-800"
    },
    {
      id: 2,
      title: "DUNE",
      subtitle: "The spice must flow. A cinematic masterpiece of epic proportions",
      genre: "Sci-Fi",
      year: "2021",
      rating: "8.9",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=800&fit=crop",
      color: "from-amber-600 to-orange-800"
    },
    {
      id: 3,
      title: "BLADE RUNNER 2049",
      subtitle: "The future is now. A visual and narrative masterpiece",
      genre: "Sci-Fi",
      year: "2017",
      rating: "8.7",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1400&h=800&fit=crop",
      color: "from-purple-600 to-pink-800"
    },
    {
      id: 4,
      title: "MAD MAX: FURY ROAD",
      subtitle: "A high-octane thrill ride through the wasteland",
      genre: "Action",
      year: "2015",
      rating: "8.8",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1400&h=800&fit=crop",
      color: "from-red-600 to-orange-700"
    },
    {
      id: 5,
      title: "INCEPTION",
      subtitle: "Your mind is the scene of the crime. Dreams within dreams",
      genre: "Sci-Fi",
      year: "2010",
      rating: "8.8",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1400&h=800&fit=crop",
      color: "from-indigo-600 to-purple-800"
    },
    {
      id: 6,
      title: "THE DARK KNIGHT",
      subtitle: "Why so serious? The definitive superhero film",
      genre: "Action",
      year: "2008",
      rating: "9.0",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&h=800&fit=crop",
      color: "from-gray-800 to-black"
    }
  ];



  const renderVideos = (videos) => {
    if (videos.length === 0) return null;

    switch (viewMode) {
      case "grid":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {videos.map((video, index) => (
              <div 
                key={video.id} 
                className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`
                }}
              >
                <div className="relative">
                  <VideoCard
                    video={video}
                    isFavorite={favorites.includes(video.id)}
                    isRecentlyWatched={recentlyWatched.includes(video.id)}
                    onSelect={() => handleVideoSelect(video)}
                    onToggleFavorite={() => toggleFavorite(video.id)}
                    animationDelay={index * 0.1}
                  />
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div 
                key={video.id}
                className="transform transition-all duration-500 hover:scale-[1.02] hover:translate-x-2"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: `fadeInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`
                }}
              >
                <VideoList
                  videos={[video]}
                  favorites={favorites}
                  recentlyWatched={recentlyWatched}
                  onVideoSelect={handleVideoSelect}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        );
      case "carousel":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950 pointer-events-none z-10"></div>
            <VideoCarousel
              videos={videos}
              favorites={favorites}
              recentlyWatched={recentlyWatched}
              onVideoSelect={handleVideoSelect}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        );
      case "shelf":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 pointer-events-none z-10"></div>
            <CinematicShelf
              videos={videos}
              favorites={favorites}
              recentlyWatched={recentlyWatched}
              onVideoSelect={handleVideoSelect}
              onToggleFavorite={toggleFavorite}
              selectedGenre={selectedGenre}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <Header />
      
      {/* Full Width Hero Section */}
      <HeroSection slides={heroSlides} />
      
      <main className="max-w-7xl mx-auto px-6 py-12 layout-content">
        {/* Enhanced Section Header */}
        <div className="mb-12 section-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                Discover Amazing Content
              </h2>
              <p className="text-neutral-400 text-lg">
                Explore our curated collection of premium videos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <GenreSelector selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
              <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <section className="relative">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
          
          {/* Content Container */}
          <div className="relative z-10">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-6xl">🎬</span>
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                  No videos found
                </h3>
                <p className="text-neutral-400 max-w-md mx-auto text-lg leading-relaxed">
                  Try adjusting your search or genre filters to discover more amazing content.
                </p>
                <div className="mt-8">
                  <button 
                    onClick={() => setSelectedGenre("all")}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Show All Videos
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-8 results-summary">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 glass-card">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium text-white">
                        {filteredVideos.length} videos found
                      </span>
                    </div>
                    {selectedGenre !== "all" && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30 glass-card">
                        <span className="text-sm font-medium text-blue-300">
                          Genre: {selectedGenre}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Viewing as</p>
                    <p className="text-lg font-semibold text-white capitalize">{viewMode}</p>
                  </div>
                </div>

                {/* Enhanced Video Grid/List */}
                <div className="relative video-grid">
                  {renderVideos(filteredVideos)}
                </div>

                {/* Enhanced Footer */}
                <div className="mt-16 text-center">
                  <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
                    <span className="text-neutral-400">🎬</span>
                    <span className="text-white font-medium">
                      End of results • {filteredVideos.length} videos loaded
                    </span>
                    <span className="text-neutral-400">🎬</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
