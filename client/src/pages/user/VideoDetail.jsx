import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer';
import { fetchMovieDetails } from '../../libs/tmdb';

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        // Fetch movie details (includes videos)
        const details = await fetchMovieDetails(id);
        setVideo(details);
        // Find trailer in details.videos.results
        const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        } else {
          setTrailerUrl(null);
        }
      } catch (err) {
        setError('Failed to load video details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
  if (!video) return <div className="p-8 text-center text-white">No video found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-400 hover:text-blue-300">&larr; Back</button>
      <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
      <p className="text-neutral-400 mb-4">{video.overview}</p>
      {trailerUrl ? (
        <VideoPlayer url={trailerUrl} playing controls />
      ) : (
        <div className="bg-black text-white p-4 rounded">No trailer available.</div>
      )}
      <div className="mt-6 text-neutral-300">
        <div>Release Date: {video.release_date}</div>
        <div>Rating: {video.vote_average} / 10</div>
        <div>Votes: {video.vote_count}</div>
      </div>
    </div>
  );
}
