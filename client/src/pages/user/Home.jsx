import { useState, useEffect } from "react";
import { Header } from "../../components/ui/user/Header";
import { VideoGrid } from "../../components/layouts/user/VideoGrid";
import { VideoCarousel } from "../../components/layouts/user/VideoCarousel";
import { VideoList } from "../../components/ui/user/VideoList";
import { CinematicShelf } from "../../components/layouts/user/CinematicShelf";
import { GenreSelector } from "../../components/layouts/user/GenreSelector";
import { ViewModeSelector } from "../../components/layouts/user/ViewModeSelector";
import { VideoCard } from "../../components/layouts/user/VideoCard";
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
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

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
      title: "The Shawshank Redemption",
      subtitle: "Hope is a good thing, maybe the best of things",
      genre: "Drama",
      year: "1994",
      rating: "9.3",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: 2,
      title: "Inception",
      subtitle: "Your mind is the scene of the crime",
      genre: "Sci-Fi",
      year: "2010",
      rating: "8.8",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
      color: "from-purple-600 to-pink-700"
    },
    {
      id: 3,
      title: "Pulp Fiction",
      subtitle: "You won't know the facts until you've seen the fiction",
      genre: "Crime",
      year: "1994",
      rating: "8.9",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
      color: "from-orange-600 to-red-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const renderVideos = (videos) => {
    if (videos.length === 0) return null;

    switch (viewMode) {
      case "grid":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {videos.map((video, index) => (
              <div key={video.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoCard
                  video={video}
                  isFavorite={favorites.includes(video.id)}
                  isRecentlyWatched={recentlyWatched.includes(video.id)}
                  onSelect={() => handleVideoSelect(video)}
                  onToggleFavorite={() => toggleFavorite(video.id)}
                  animationDelay={index * 0.1}
                />
              </div>
            ))}
          </div>
        );
      case "list":
        return (
          <VideoList
            videos={videos}
            favorites={favorites}
            recentlyWatched={recentlyWatched}
            onVideoSelect={handleVideoSelect}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "carousel":
        return (
          <VideoCarousel
            videos={videos}
            favorites={favorites}
            recentlyWatched={recentlyWatched}
            onVideoSelect={handleVideoSelect}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "shelf":
        return (
          <CinematicShelf
            videos={videos}
            favorites={favorites}
            recentlyWatched={recentlyWatched}
            onVideoSelect={handleVideoSelect}
            onToggleFavorite={toggleFavorite}
            selectedGenre={selectedGenre}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalVideos={filteredVideos.length}
        totalFavorites={favorites.length}
      />

      {/* Hero */}
      <section className="relative h-96 mb-12 overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentHeroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              </div>
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${slide.color} text-white`}>
                        {slide.genre}
                      </span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{slide.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-300">{slide.year}</span>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <Play className="w-5 h-5" />
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentHeroSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 p-6 bg-background-elevated/50 backdrop-blur-sm rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <GenreSelector
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {featuredVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground-primary">
                Featured Collection
              </h2>
            </div>
            <VideoCarousel
              videos={featuredVideos}
              favorites={favorites}
              recentlyWatched={recentlyWatched}
              onVideoSelect={handleVideoSelect}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        )}

        {trendingVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground-primary">
                Trending Now
              </h2>
            </div>
            {renderVideos(trendingVideos.slice(0, 8))}
          </section>
        )}

        {recentlyWatched.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground-primary">
                Continue Watching
              </h2>
            </div>
            {(() => {
              const recentVideos = recentlyWatched.slice(0, 5)
                .map(videoId => mockVideos.find(v => v.id === videoId))
                .filter(Boolean);
              return renderVideos(recentVideos);
            })()}
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground-primary">
              {selectedGenre === "all" ? "All Videos" : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Collection`}
            </h2>
            {filteredVideos.length > 0 && (
              <span className="px-3 py-1 bg-background-elevated/50 rounded-full text-sm text-foreground-secondary border border-white/10">
                {filteredVideos.length} videos
              </span>
            )}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-background-elevated/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-foreground-muted" />
              </div>
              <h3 className="text-xl font-semibold text-foreground-primary mb-2">
                No videos found
              </h3>
              <p className="text-foreground-secondary max-w-md mx-auto">
                Try adjusting your search or genre filters to discover more content
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {renderVideos(filteredVideos)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
