// TMDB API utility
export async function fetchTMDBVideos({ query = '', page = 1 }) {
  // Use Vite env variable, fallback to default if undefined
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

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
