const axios = require('axios');
const dotenv = require('dotenv').config();

// Get TMDB API key from environment or use a default (you'll need to set this)
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

function sendError(res, status, message, details = null) {
  return res.status(status).json({ ok: false, message, details });
}

function sendSuccess(res, data, message = 'Success') {
  return res.status(200).json({ ok: true, message, data });
}

// Get video details for playing
exports.getVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🎬 Getting video details for TMDB ID: ${id}`);
    
    // Get movie details from TMDB
    const detailsResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    );
    
    // Get movie videos (trailers, etc.) from TMDB
    const videosResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    
    const movieDetails = detailsResponse.data;
    const movieVideos = videosResponse.data.results || [];
    
    // Find the best trailer
    const trailer = movieVideos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || movieVideos.find(video => video.site === 'YouTube');
    
    const videoData = {
      id: movieDetails.id,
      title: movieDetails.title,
      overview: movieDetails.overview,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      release_date: movieDetails.release_date,
      runtime: movieDetails.runtime,
      vote_average: movieDetails.vote_average,
      vote_count: movieDetails.vote_count,
      genres: movieDetails.genres,
      production_companies: movieDetails.production_companies,
      trailer: trailer ? {
        key: trailer.key,
        site: trailer.site,
        type: trailer.type,
        url: trailer.site === 'YouTube' ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        embed_url: trailer.site === 'YouTube' ? `https://www.youtube.com/embed/${trailer.key}` : null
      } : null,
      all_videos: movieVideos.map(video => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        url: video.site === 'YouTube' ? `https://www.youtube.com/watch?v=${video.key}` : null,
        embed_url: video.site === 'YouTube' ? `https://www.youtube.com/embed/${video.key}` : null
      }))
    };
    
    console.log(`✅ Video details retrieved: ${movieDetails.title}`);
    console.log(`🎞️ Found ${movieVideos.length} videos, trailer available: ${!!trailer}`);
    
    return sendSuccess(res, videoData, 'Video details retrieved successfully');
    
  } catch (error) {
    console.error('❌ Error getting video details:', error.message);
    
    if (error.response?.status === 404) {
      return sendError(res, 404, 'Video not found');
    }
    
    return sendError(res, 500, 'Failed to get video details', error.message);
  }
};

// Get video stream URL (for now, returns trailer URL)
exports.getVideoStream = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality = '720p', type = 'trailer' } = req.query;
    
    console.log(`🎥 Getting stream for TMDB ID: ${id}, quality: ${quality}, type: ${type}`);
    
    // Get movie videos from TMDB
    const videosResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    
    const movieVideos = videosResponse.data.results || [];
    
    // Find the requested video type or default to trailer
    let targetVideo;
    
    if (type === 'trailer') {
      targetVideo = movieVideos.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ) || movieVideos.find(video => video.site === 'YouTube');
    } else {
      targetVideo = movieVideos.find(video => 
        video.type === type && video.site === 'YouTube'
      );
    }
    
    if (!targetVideo) {
      return sendError(res, 404, `No ${type} video found for this movie`);
    }
    
    const streamData = {
      video_id: targetVideo.key,
      site: targetVideo.site,
      type: targetVideo.type,
      name: targetVideo.name,
      quality: quality,
      stream_url: targetVideo.site === 'YouTube' ? `https://www.youtube.com/watch?v=${targetVideo.key}` : null,
      embed_url: targetVideo.site === 'YouTube' ? `https://www.youtube.com/embed/${targetVideo.key}` : null,
      player_config: {
        autoplay: false,
        controls: true,
        muted: false,
        loop: false
      }
    };
    
    console.log(`✅ Stream URL generated for: ${targetVideo.name}`);
    
    return sendSuccess(res, streamData, 'Stream URL retrieved successfully');
    
  } catch (error) {
    console.error('❌ Error getting video stream:', error.message);
    
    if (error.response?.status === 404) {
      return sendError(res, 404, 'Video not found');
    }
    
    return sendError(res, 500, 'Failed to get video stream', error.message);
  }
};
