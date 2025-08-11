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
              group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105
              ${
                selectedGenre === genre.value
                  ? `bg-gradient-to-r ${genre.gradient} text-white shadow-xl scale-105`
                  : `bg-background-elevated/50 text-foreground-secondary hover:text-foreground-primary hover:bg-white/5 border border-white/10 backdrop-blur-sm`
              }
            `}
          >
            {selectedGenre === genre.value && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${genre.gradient} rounded-xl blur-xl opacity-50`}></div>
            )}
            
            <div className="relative flex items-center gap-2">
              <Icon
                className={`w-4 h-4 ${
                  selectedGenre === genre.value
                    ? "text-white"
                    : "text-foreground-muted group-hover:text-foreground-primary"
                }`}
              />
              <span>{genre.label}</span>
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-background-elevated/95 backdrop-blur-xl border border-white/10 rounded-lg text-xs text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {genre.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background-elevated/95"></div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
