import axios from 'axios';
import Constants from 'expo-constants';

const TMDB_API_KEY = Constants.expoConfig?.extra?.tmdbApiKey || '91ba9439b43829229892d98d998964ee';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  vote_count: number;
  budget: number;
  revenue: number;
  spoken_languages: { english_name: string }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface SearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrending = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/trending/movie/week');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const getPopular = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const getTopRated = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/movie/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/movie/now_playing');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/movie/upcoming');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }
};

export const getActionMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '28', // Action genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching action movies:', error);
    return [];
  }
};

export const getComedyMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '35', // Comedy genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching comedy movies:', error);
    return [];
  }
};

export const getDramaMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '18', // Drama genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching drama movies:', error);
    return [];
  }
};

export const getHorrorMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '27', // Horror genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching horror movies:', error);
    return [];
  }
};

export const getAnimationMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '16', // Animation genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching animation movies:', error);
    return [];
  }
};

export const getSciFiMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: '878', // Sci-Fi genre ID
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching sci-fi movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  try {
    const response = await api.get<MovieDetails>(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  try {
    const response = await api.get<Credits>(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

export const getMovieVideos = async (movieId: number): Promise<Video[]> => {
  try {
    const response = await api.get<{ results: Video[] }>(`/movie/${movieId}/videos`);
    return response.data.results.filter(
      video => video.site === 'YouTube' && video.official
    );
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
};

export const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>(`/movie/${movieId}/similar`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
};

export const getRecommendedMovies = async (movieId: number): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>(`/movie/${movieId}/recommendations`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
};

export const getMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    let endpoint = '';
    switch (category) {
      case 'trending':
        endpoint = '/trending/movie/week';
        break;
      case 'popular':
        endpoint = '/movie/popular';
        break;
      case 'topRated':
        endpoint = '/movie/top_rated';
        break;
      case 'action':
        endpoint = '/discover/movie';
        return getMoviesByGenre(28); // Action genre ID
      case 'comedy':
        endpoint = '/discover/movie';
        return getMoviesByGenre(35); // Comedy genre ID
      case 'drama':
        endpoint = '/discover/movie';
        return getMoviesByGenre(18); // Drama genre ID
      case 'horror':
        endpoint = '/discover/movie';
        return getMoviesByGenre(27); // Horror genre ID
      case 'animation':
        endpoint = '/discover/movie';
        return getMoviesByGenre(16); // Animation genre ID
      case 'scifi':
        endpoint = '/discover/movie';
        return getMoviesByGenre(878); // Science Fiction genre ID
      case 'documentary':
        endpoint = '/discover/movie';
        return getMoviesByGenre(99); // Documentary genre ID
      default:
        throw new Error(`Unknown category: ${category}`);
    }

    const response = await api.get<SearchResult>(endpoint);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return [];
  }
};

const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await api.get<SearchResult>('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
}; 