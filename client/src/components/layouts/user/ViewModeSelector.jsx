import { Grid3X3, RotateCcw, Layers, List } from "lucide-react";

export function ViewModeSelector({ viewMode, onViewModeChange }) {
  const modes = [
    { 
      value: "grid",
      icon: Grid3X3, 
      label: "Grid", 
      description: "Card layout view",
      gradient: "from-indigo-500 to-purple-600"
    },
    { 
      value: "list", 
      icon: List, 
      label: "List", 
      description: "Compact list view",
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      value: "carousel", 
      icon: RotateCcw, 
      label: "Carousel", 
      description: "Horizontal scrolling",
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      value: "shelf", 
      icon: Layers, 
      label: "Shelf", 
      description: "Cinematic shelf view",
      gradient: "from-pink-500 to-rose-600"
    },
  ];

  return (
    <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1.5 border-2 border-white/20">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.value}
            onClick={() => onViewModeChange(mode.value)}
            className={`
              group relative flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5
              ${
                viewMode === mode.value
                  ? `bg-gradient-to-r ${mode.gradient} text-white shadow-2xl scale-105 border-2 border-white/20`
                  : "text-white hover:text-white hover:bg-white/20"
              }
            `}
          >
            {/* Background glow for selected */}
            {viewMode === mode.value && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${mode.gradient} rounded-full blur-xl opacity-60 animate-pulse`}></div>
            )}

            <div className="relative flex items-center gap-2">
              <div className={`p-1 rounded-full ${
                viewMode === mode.value
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline font-medium">{mode.label}</span>
            </div>

            {/* Enhanced Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
              {mode.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
