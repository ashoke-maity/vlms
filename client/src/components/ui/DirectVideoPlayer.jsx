import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function DirectVideoPlayer({ videoData, onClose }) {
  console.log('🎬 DirectVideoPlayer received data:', videoData);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);

  if (!videoData?.trailer?.key) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 max-w-md text-center">
          <h3 className="text-xl font-bold mb-4 text-white">No Trailer Available</h3>
          <p className="text-neutral-300 mb-6">
            Sorry, no trailer is available for "{videoData?.title || 'this movie'}".
          </p>
          {videoData?.all_videos && videoData.all_videos.length > 0 && (
            <div className="mb-6">
              <p className="text-neutral-400 text-sm mb-3">Available videos:</p>
              <div className="space-y-2">
                {videoData.all_videos.slice(0, 3).map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    {video.name} ({video.type})
                  </a>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoData.trailer.key}?autoplay=1&controls=1&rel=0`;
  const directUrl = `https://www.youtube.com/watch?v=${videoData.trailer.key}`;

  console.log('🎞️ Trailer URLs:', { embedUrl, directUrl });

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Movie title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-white text-xl font-bold">{videoData?.title} - Trailer</h2>
      </div>

      {/* Video iframe */}
      <iframe
        src={embedUrl}
        title={`${videoData?.title} - Trailer`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {/* Fallback button */}
      <div className="absolute bottom-4 left-4 z-10">
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-flex items-center space-x-2"
        >
          <span>🎬</span>
          <span>Open in YouTube</span>
        </a>
      </div>
    </div>
  );
}
