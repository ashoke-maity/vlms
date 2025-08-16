import { Sparkles, Zap, Ghost, Smile, Rocket, Heart, Film } from "lucide-react"

export function GenreSelector({ selectedGenre, onGenreChange }) {
  const genres = [
    { 
      value: "all", 
      label: "All Genres", 
      gradient: "from-indigo-500 to-purple-600",
      icon: Sparkles,
      description: "Browse all content"
    },
    { 
      value: "horror", 
      label: "Horror", 
      gradient: "from-red-500 to-rose-600",
      icon: Ghost,
      description: "Spine-chilling thrillers"
    },
    { 
      value: "comedy", 
      label: "Comedy", 
      gradient: "from-yellow-500 to-orange-500",
      icon: Smile,
      description: "Laugh-out-loud moments"
    },
    { 
      value: "sci-fi", 
      label: "Sci-Fi", 
      gradient: "from-blue-500 to-indigo-600",
      icon: Rocket,
      description: "Futuristic adventures"
    },
    { 
      value: "action", 
      label: "Action", 
      gradient: "from-orange-500 to-red-500",
      icon: Zap,
      description: "High-octane excitement"
    },
    { 
      value: "drama", 
      label: "Drama", 
      gradient: "from-purple-500 to-pink-500",
      icon: Heart,
      description: "Emotional storytelling"
    },
    { 
      value: "thriller", 
      label: "Thriller", 
      gradient: "from-gray-600 to-gray-700",
      icon: Film,
      description: "Edge-of-seat suspense"
    },
  ]

  return (
    <div className="flex gap-3 flex-wrap">
      {genres.map((genre) => {
        const Icon = genre.icon
        return (
          <button
            key={genre.value}
            onClick={() => onGenreChange(genre.value)}
            className={`
              group relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
              ${
                selectedGenre === genre.value
                  ? `bg-gradient-to-r ${genre.gradient} text-white shadow-2xl scale-105 border-2 border-white/20`
                  : `bg-white/10 backdrop-blur-md text-white hover:text-white hover:bg-white/20 border-2 border-white/20 hover:border-white/40`
              }
            `}
          >
            {selectedGenre === genre.value && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${genre.gradient} rounded-full blur-xl opacity-60 animate-pulse`}></div>
            )}
            
            <div className="relative flex items-center gap-3">
              <div className={`p-1.5 rounded-full ${
                selectedGenre === genre.value
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{genre.label}</span>
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
              {genre.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
