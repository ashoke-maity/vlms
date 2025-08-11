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
    <div className="flex bg-background-elevated/50 backdrop-blur-sm rounded-xl p-1 border border-white/10">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.value}
            onClick={() => onViewModeChange(mode.value)}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105
              ${
                viewMode === mode.value
                  ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg scale-105`
                  : "text-foreground-secondary hover:text-foreground-primary hover:bg-white/5"
              }
            `}
          >
            {/* Background glow for selected */}
            {viewMode === mode.value && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${mode.gradient} rounded-lg blur-xl opacity-50`}></div>
            )}

            <div className="relative flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-background-elevated/95 backdrop-blur-xl border border-white/10 rounded-lg text-xs text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {mode.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background-elevated/95"></div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
