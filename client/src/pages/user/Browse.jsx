import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Eye,
  Heart,
  Play,
  X,
  SlidersHorizontal
} from "lucide-react";
import { mockVideos } from "../../libs/mockVideos";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import { VideoList } from "../../components/ui/user/VideoList";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);

  // Available filter options
  const genres = ["action", "comedy", "drama", "horror", "sci-fi"];
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const ratings = ["9+", "8+", "7+", "6+"];
  const sortOptions = [
    { value: "title", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
    { value: "year", label: "Year (Newest)" },
    { value: "year-desc", label: "Year (Oldest)" },
    { value: "rating", label: "Rating (High)" },
    { value: "rating-desc", label: "Rating (Low)" },
    { value: "watchCount", label: "Most Watched" },
    { value: "dateAdded", label: "Recently Added" }
  ];

  // Filter and sort videos
  const filteredVideos = mockVideos
    .filter((video) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Genre filter
      const matchesGenre = selectedGenres.length === 0 || 
        selectedGenres.includes(video.genre);
      
      // Year filter
      const matchesYear = selectedYears.length === 0 || 
        selectedYears.includes(video.year.toString());
      
      // Rating filter
      const matchesRating = selectedRatings.length === 0 || 
        selectedRatings.some(rating => video.rating >= parseInt(rating));
      
      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "year":
          return b.year - a.year;
        case "year-desc":
          return a.year - b.year;
        case "rating":
          return b.rating - a.rating;
        case "rating-desc":
          return a.rating - b.rating;
        case "watchCount":
          return b.watchCount - a.watchCount;
        case "dateAdded":
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return 0;
      }
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

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYears([]);
    setSelectedRatings([]);
    setSearchQuery("");
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleYear = (year) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const renderVideos = () => {
    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No videos found</h3>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">
            Try adjusting your search criteria or filters to discover more content.
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredVideos.map((video, index) => (
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
    }

    return (
      <VideoList
        videos={filteredVideos}
        favorites={favorites}
        recentlyWatched={recentlyWatched}
        onVideoSelect={handleVideoSelect}
        onToggleFavorite={toggleFavorite}
      />
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900/50 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold">Browse Videos</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters 
                    ? "bg-blue-600 text-white" 
                    : "bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" 
                      ? "bg-blue-600 text-white" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list" 
                      ? "bg-blue-600 text-white" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search videos..."
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Genres</h3>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-neutral-300 capitalize">
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Years */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Release Year</h3>
                  <div className="space-y-2">
                    {years.map((year) => (
                      <label key={year} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedYears.includes(year)}
                          onChange={() => toggleYear(year)}
                          className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-neutral-300">
                          {year}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Minimum Rating</h3>
                  <div className="space-y-2">
                    {ratings.map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => toggleRating(rating)}
                          className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-neutral-300 flex items-center gap-1">
                          {rating} <Star size={12} className="text-yellow-400" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedGenres.length > 0 || selectedYears.length > 0 || selectedRatings.length > 0 || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} found
                </h2>
                {(selectedGenres.length > 0 || selectedYears.length > 0 || selectedRatings.length > 0) && (
                  <p className="text-sm text-neutral-400 mt-1">
                    Filtered by: {[
                      ...selectedGenres.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
                      ...selectedYears,
                      ...selectedRatings.map(r => `${r}+ stars`)
                    ].join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Videos Grid/List */}
            {renderVideos()}
          </div>
        </div>
      </div>
    </div>
  );
}
