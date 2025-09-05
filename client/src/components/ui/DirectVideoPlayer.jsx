import React from 'react';
import { X } from 'lucide-react';

export default function DirectVideoPlayer({ videoData, onClose }) {
  console.log('🎬 DirectVideoPlayer received data:', videoData);

  if (!videoData?.trailer?.key) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h3 className="text-xl font-bold mb-4 text-black">No Trailer Available</h3>
          <p className="text-gray-600 mb-6">
            Sorry, no trailer is available for "{videoData?.title || 'this movie'}".
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
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
