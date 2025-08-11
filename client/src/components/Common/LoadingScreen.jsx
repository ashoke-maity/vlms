import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            CINEMATIC LIBRARY
          </h1>
          <p className="text-gray-400">Loading your collection...</p>
        </div>

        <div className="w-80 bg-gray-800 rounded-full h-2 mx-auto">
          <div
            className="bg-gradient-to-r from-red-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white mt-4 text-lg">{progress}%</p>
      </div>
    </div>
  );
}
