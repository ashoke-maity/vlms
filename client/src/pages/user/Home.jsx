import { useState, useEffect } from "react";
import Header from "../../components/ui/user/Header";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import { HeroSection } from "../../components/layouts/user/HeroSection";
import { fetchTMDBVideos, fetchTrendingMovies, fetchTMDBGenres } from "../../libs/tmdb";
import { useAuth } from "../../context/AuthContext.jsx";
import favoritesService from "../../services/favorites.js";

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [videos, setVideos] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Deduplicate by TMDB id
  const uniqueById = (arr) => {
    const map = new Map();
    for (const item of arr || []) {
      if (item && item.id != null && !map.has(item.id)) map.set(item.id, item);
    }
    return Array.from(map.values());
  };

  // Load user's favorites
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (user?.id) {
        try {
          const res = await favoritesService.getFavorites(user.id);
          if (res.ok && Array.isArray(res.data)) {
            const favoriteVideoIds = res.data.map(fav => fav.video_id || fav.id);
            setFavorites(favoriteVideoIds);
          }
        } catch (error) {
          console.error('Error loading user favorites:', error);
        }
      }
    };

    loadUserFavorites();
  }, [user?.id]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load genres
        const genresData = await fetchTMDBGenres();
        setGenres(genresData || []);

        // Load trending movies for hero section
        const trendingData = await fetchTrendingMovies();
        
        const validMovies = (trendingData || []).filter(movie => 
          movie && movie.id && movie.title && (movie.backdrop_path || movie.poster_path)
        );
        
        setHeroMovies(validMovies.slice(0, 5));
      } catch (error) {
        console.error('Error loading initial data:', error);
        setGenres([]);
        setHeroMovies([]);
      }
    };

    loadInitialData();
  }, []);

  // Load videos based on search and genre
  useEffect(() => {
    setLoading(true);
    setPage(1);
    
    const genreId = selectedGenre !== 'all' ? selectedGenre : null;
    
    fetchTMDBVideos({ query: searchQuery, page: 1, genre: genreId })
      .then(results => {
        const list = results || [];
        setVideos(uniqueById(list));
        setHasMore(list.length === 20);
      })
      .catch(() => {
        setVideos([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [searchQuery, selectedGenre]);

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    const genreId = selectedGenre !== 'all' ? selectedGenre : null;
    
    setIsLoadingMore(true);
    fetchTMDBVideos({ query: searchQuery, page: nextPage, genre: genreId })
      .then(results => {
        const newResults = results || [];
        setVideos(prev => uniqueById([...prev, ...newResults]));
        setPage(nextPage);
        setHasMore(newResults.length === 20);
      })
      .catch(() => setHasMore(false))
      .finally(() => setIsLoadingMore(false));
  };

  const filteredVideos = videos;

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

  // Create hero slides from trending movies
  const heroSlides = heroMovies
    .filter(movie => movie && movie.id && movie.title) // Filter out invalid movies
    .map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      subtitle: movie.description || "Discover amazing content",
      description: movie.description,
      genre: movie.genre_ids?.[0] ? `Genre ID: ${movie.genre_ids[0]}` : "Movie",
      year: movie.year,
      rating: movie.rating,
      image: movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : movie.poster_path 
        ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
        : null,
      color: `from-${['blue', 'purple', 'red', 'green', 'yellow'][index % 5]}-600 to-${['purple', 'pink', 'orange', 'blue', 'red'][index % 5]}-800`
    }));



  const renderVideos = (videos) => {
    if (videos.length === 0) return null;

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
              {/* Genre Selector */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
              />
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
                  Try adjusting your search to discover more amazing content.
                </p>
                <div className="mt-8">
                  
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Results Summary removed */}

                {/* Enhanced Video Grid/List */}
                <div className="relative video-grid">
                  {renderVideos(filteredVideos)}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {isLoadingMore ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}

                {/* Enhanced Footer */}
                {!hasMore && (
                  <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
                      <span className="text-neutral-400">🎬</span>
                      <span className="text-white font-medium">
                        End of results • {filteredVideos.length} videos loaded
                      </span>
                      <span className="text-neutral-400">🎬</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
