// TMDB API utility
export async function fetchTMDBVideos({ query = '', page = 1 }) {
  // Use Vite env variable, fallback to default if undefined
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'c3a2953df64613ec2f0a13e14db08ec6';
  const BASE_URL = 'https://api.themoviedb.org/3';

  let url;
  if (query && query.trim() !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch TMDB videos');
  const data = await res.json();
  return data.results || [];
}
