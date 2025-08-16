import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  Heart,
  Grid,
  List,
  Search,
  Filter,
  Trash2,
  Play,
  Clock,
  Star,
  FolderPlus,
  MoreVertical,
  X
} from "lucide-react";
import { mockVideos } from "../../libs/mockVideos";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import { VideoList } from "../../components/ui/user/VideoList";

export default function MyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Mock user's favorite videos (in a real app, this would come from user data)
  const [favorites, setFavorites] = useState([
    mockVideos[0].id,
    mockVideos[2].id,
    mockVideos[4].id,
    mockVideos[6].id,
    mockVideos[8].id,
    mockVideos[10].id
  ]);

  const [recentlyWatched, setRecentlyWatched] = useState([]);

  const sortOptions = [
    { value: "dateAdded", label: "Date Added" },
    { value: "title", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
    { value: "year", label: "Year (Newest)" },
    { value: "rating", label: "Rating (High)" },
    { value: "duration", label: "Duration" }
  ];

  // Get favorite videos
  const favoriteVideos = mockVideos.filter(video => favorites.includes(video.id));

  // Filter and sort videos
  const filteredVideos = favoriteVideos
    .filter((video) => {
      return searchQuery === "" || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "year":
          return b.year - a.year;
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "dateAdded":
        default:
          // For demo purposes, sort by ID (simulating date added)
          return parseInt(a.id) - parseInt(b.id);
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

  const toggleVideoSelection = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const selectAllVideos = () => {
    setSelectedVideos(filteredVideos.map(video => video.id));
  };

  const deselectAllVideos = () => {
    setSelectedVideos([]);
  };

  const removeSelectedVideos = () => {
    setFavorites((prev) => prev.filter(id => !selectedVideos.includes(id)));
    setSelectedVideos([]);
    setIsSelectionMode(false);
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedVideos([]);
  };

  const renderVideos = () => {
    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? "No videos found" : "Your list is empty"}
          </h3>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">
            {searchQuery 
              ? "Try adjusting your search to find videos in your list."
              : "Start adding videos to your favorites to see them here."
            }
          </p>
          {!searchQuery && (
            <Link
              to="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Play size={16} />
              Browse Videos
            </Link>
          )}
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
              <div className="flex items-center gap-3">
                <Heart size={24} className="text-red-400" />
                <h1 className="text-2xl font-bold">My List</h1>
              </div>
            </div>
            
            {!isSelectionMode ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters 
                      ? "bg-blue-600 text-white" 
                      : "bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                  }`}
                >
                  <Filter size={16} />
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
                {filteredVideos.length > 0 && (
                  <button
                    onClick={enterSelectionMode}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Select
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400">
                  {selectedVideos.length} selected
                </span>
                <button
                  onClick={selectedVideos.length === filteredVideos.length ? deselectAllVideos : selectAllVideos}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {selectedVideos.length === filteredVideos.length ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={removeSelectedVideos}
                  disabled={selectedVideos.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
                <button
                  onClick={exitSelectionMode}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
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
                  <h3 className="text-lg font-semibold mb-4">Search My List</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your list..."
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

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">List Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Total Videos</span>
                      <span className="text-sm font-medium">{favoriteVideos.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Total Duration</span>
                      <span className="text-sm font-medium">
                        {favoriteVideos.reduce((total, video) => {
                          const duration = video.duration;
                          const hours = duration.match(/(\d+)h/)?.[1] || 0;
                          const minutes = duration.match(/(\d+)m/)?.[1] || 0;
                          return total + parseInt(hours) * 60 + parseInt(minutes);
                        }, 0)}m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Avg Rating</span>
                      <span className="text-sm font-medium">
                        {(favoriteVideos.reduce((sum, video) => sum + video.rating, 0) / favoriteVideos.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <FolderPlus size={16} />
                      Create Playlist
                    </button>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <Play size={16} />
                      Play All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} in your list
                </h2>
                {searchQuery && (
                  <p className="text-sm text-neutral-400 mt-1">
                    Filtered by: "{searchQuery}"
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
