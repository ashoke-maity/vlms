// TMDB API utility
export async function fetchTMDBVideos({ query = '', page = 1, genre = null }) {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  let url;
  if (query && query.trim() !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  } else if (genre && genre !== 'all') {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&page=${page}&sort_by=popularity.desc`;
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch TMDB videos');
  const data = await res.json();
  
  // Transform TMDB data to match our app format
  const transformedResults = (data.results || []).map(movie => ({
    id: movie.id,
    title: movie.title,
    description: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    vote_count: movie.vote_count,
    genre_ids: movie.genre_ids,
    popularity: movie.popularity,
    adult: movie.adult
  }));

  return transformedResults;
}

// Fetch multiple pages and combine results (TMDB returns 20 per page)
export async function fetchTMDBVideosPages({ query = '', startPage = 1, pages = 3, limit = null }) {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const makeUrl = (p) => (
    query && query.trim() !== ''
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${p}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${p}`
  );

  const count = Math.max(1, Number(pages) || 1);
  const first = Math.max(1, Number(startPage) || 1);
  const pageNums = Array.from({ length: count }, (_, i) => first + i);

  const responses = await Promise.all(
    pageNums.map(async (p) => {
      const r = await fetch(makeUrl(p));
      if (!r.ok) throw new Error(`Failed to fetch TMDB videos (page ${p})`);
      return r.json();
    })
  );

  let combined = responses.flatMap(d => d?.results || []);
  if (typeof limit === 'number' && limit > 0) combined = combined.slice(0, limit);
  return combined;
}

// Get TMDB genres
export async function fetchTMDBGenres() {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch TMDB genres');
  const data = await res.json();
  return data.genres || [];
}

// Get trending movies
export async function fetchTrendingMovies(timeWindow = 'week') {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const url = `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch trending movies');
  const data = await res.json();
  
  return (data.results || []).map(movie => ({
    id: movie.id,
    title: movie.title,
    description: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    vote_count: movie.vote_count,
    genre_ids: movie.genre_ids,
    popularity: movie.popularity
  }));
}

// Get movie details with videos
export async function fetchMovieDetails(movieId) {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  const data = await res.json();
  
  return {
    ...data,
    year: data.release_date ? new Date(data.release_date).getFullYear() : 'N/A',
    rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
    duration: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'N/A'
  };
}