import React, { useState } from "react";
import { mockVideos } from "../../libs/mockVideos";

export default function HomeSimple() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = mockVideos.filter((video) => {
    const matchesGenre = selectedGenre === "all" || video.genre === selectedGenre;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background-primary text-white p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Video Library Management System</h1>
        <div className="mb-4">
          <a href="/full" className="text-blue-400 hover:text-blue-300 underline">
            Try Full Version
          </a>
          {" | "}
          <a href="/test" className="text-blue-400 hover:text-blue-300 underline">
            Test Component
          </a>
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-background-elevated rounded-lg text-white border border-white/20"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 bg-background-elevated rounded-lg text-white border border-white/20"
          >
            <option value="all">All Genres</option>
            <option value="horror">Horror</option>
            <option value="comedy">Comedy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="action">Action</option>
            <option value="drama">Drama</option>
          </select>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-background-elevated rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div
                className="w-full h-48 rounded-lg mb-4"
                style={{ backgroundColor: video.coverColor }}
              ></div>
              <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
              <p className="text-foreground-secondary text-sm mb-2 line-clamp-2">
                {video.description}
              </p>
              <div className="flex justify-between items-center text-sm text-foreground-muted">
                <span className="capitalize bg-white/10 px-2 py-1 rounded">
                  {video.genre}
                </span>
                <span>{video.year}</span>
                <span>⭐ {video.rating}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-foreground-secondary">
              Try adjusting your search or genre filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}