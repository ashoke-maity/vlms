// TMDB API utility
export async function fetchTMDBVideos({ query = '', genre = '', page = 1 }) {
  // Try Vite, then process.env (SSR), then window.env (static)
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  let url;
  if (query && query.trim() !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    if (genre) {
      url += `&with_genres=${genre}`;
    }
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    if (genre) {
      url += `&with_genres=${genre}`;
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch TMDB videos');
  const data = await res.json();
  return data.results || [];
}
