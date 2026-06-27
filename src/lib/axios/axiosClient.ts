import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { env } from '../env/env';
import { logger } from '../logger/logger';
import { getMockPath } from '@mocks/mockRoutes';
import { ApiError } from '@shared/types/api.type';
import { isRequestCanceled } from '@shared/utils/isRequestCanceled';

export const axiosClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  // withCredentials is intentionally omitted: the backend sends
  // Access-Control-Allow-Origin: * which browsers reject for credentialed
  // requests. Auth is handled via the Authorization: Bearer header below.
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Mock Mode Strategy
    if (env.NEXT_PUBLIC_USE_MOCK && config.url) {
      const mockPath = getMockPath(config.url);
      if (mockPath) {
        // Save original URL and params for client-side filtering in response interceptor
        (config as any)._originalUrl = config.url;
        (config as any)._originalParams = config.params ? { ...config.params } : {};

        //SSR-safe: window không tồn tại trong Server Component
        let origin: string;
        if (typeof window !== 'undefined') {
          origin = window.location.origin;
        } else {
          // Next.js tự set PORT khi chọn port available
          const port = process.env.PORT ?? '3000';
          origin = `http://localhost:${port}`;
        }
        config.baseURL = origin;
        config.url = mockPath;
        config.method = 'GET';
        config.params = {}; // Clear params to prevent appending to local file request
        logger.info(`🚀 [Mock Mode] Redirecting to ${mockPath}`);
      }
    }

    // 2. Auth Injection
    const token = Cookies.get('cine_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const movieTitlesLookup: Record<string, string> = {
  'dune-part-two': 'Dune: Part Two',
  'godzilla-x-kong': 'Godzilla x Kong',
  'ghostbusters-frozen': 'Ghostbusters: Frozen Empire',
  'civil-war': 'Civil War',
  'furiosa': 'Furiosa: A Mad Max Saga',
  'inside-out-2': 'Inside Out 2',
  'kingdom-of-the-planet': 'Kingdom of the Planet of the Apes',
  'despicable-me-4': 'Despicable Me 4',
  'deadpool-wolverine': 'Deadpool & Wolverine',
  'alien-romulus': 'Alien: Romulus',
  'joker-two': 'Joker: Folie à Deux',
  'gladiator-two': 'Gladiator II',
};

// Client-side mock filtering
const handleMockFilter = (url: string, params: any, responseData: any) => {
  const path = url.split('?')[0];

  // 1. Movies filtering
  if (path.endsWith('/movies') || path.endsWith('/movies/trending') || path.endsWith('/movies/popular') || path.endsWith('/movies/search') || path.endsWith('/movies/navbar')) {
    let results = Array.isArray(responseData) ? responseData : (responseData?.data?.results || responseData?.data || responseData?.results || []);

    // Filter by category
    if (params.category) {
      if (params.category === 'now-showing') {
        results = results.filter((m: any) => m.status === 'now-showing');
      } else if (params.category === 'coming-soon') {
        results = results.filter((m: any) => m.status === 'coming-soon');
      } else {
        results = results.filter((m: any) => m.categories && m.categories.includes(params.category));
      }
    }

    // Filter by status
    if (params.status) {
      const statuses = params.status.split(',');
      results = results.filter((m: any) => statuses.includes(m.status));
    }

    // Filter by featured
    if (params.featured === 'true' || params.featured === true) {
      results = results.filter((m: any) => m.featured === true);
    }

    // Filter by search/query
    const searchVal = params.search || params.query;
    if (searchVal) {
      const q = String(searchVal).toLowerCase();
      results = results.filter((m: any) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
      );
    }

    // Pagination
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        page,
        results: paginated,
        totalPages: Math.ceil(results.length / limit),
        totalResults: results.length,
      }
    };
  }

  // 2. Star shop products filtering
  if (path.endsWith('/star-shop/products')) {
    const rawResults = responseData?.data?.results || responseData?.results || [];
    let results = [...rawResults];

    if (params.category) {
      results = results.filter((p: any) => p.category === params.category);
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        page,
        results: paginated,
        totalPages: Math.ceil(results.length / limit),
        totalResults: results.length,
      }
    };
  }

  // 3. Showtimes filtering and dynamic mapping
  if (path.endsWith('/showtimes')) {
    const rawResults = responseData?.data?.results || responseData?.results || [];
    let results = JSON.parse(JSON.stringify(rawResults)); // Deep copy

    // Adjust movieId and title if queried
    if (params.movieId) {
      results.forEach((item: any) => {
        item.movie.movieId = isNaN(Number(params.movieId)) ? params.movieId : Number(params.movieId);
        if (movieTitlesLookup[params.movieId]) {
          item.movie.title = movieTitlesLookup[params.movieId];
        }
      });
    }

    // Adjust cinemaId and cinema name if queried
    if (params.cinemaId) {
      results = results.filter((item: any) => {
        item.cinema.cinemaId = isNaN(Number(params.cinemaId)) ? params.cinemaId : Number(params.cinemaId);
        if (params.cinemaId === 'cn-001' || params.cinemaId === 'cinema_1') {
          item.cinema.name = 'CINE Landmark - Q1';
        } else if (params.cinemaId === 'cn-002' || params.cinemaId === 'cinema_2') {
          item.cinema.name = 'CINE Crescent - Q7';
        } else if (params.cinemaId === 'cn-003' || params.cinemaId === 'cinema_3') {
          item.cinema.name = 'CineDot Hà Nội — Vincom Bà Triệu';
        } else if (params.cinemaId === 'cn-004' || params.cinemaId === 'cinema_4') {
          item.cinema.name = 'CineDot Đà Nẵng — Vincom';
        }
        return true;
      });
    }

    // Adjust date of showtimes if queried
    if (params.date) {
      results.forEach((item: any) => {
        const stParts = item.time.startTime.split('T');
        const etParts = item.time.endTime.split('T');
        item.time.startTime = `${params.date}T${stParts[1] || '10:00:00'}`;
        item.time.endTime = `${params.date}T${etParts[1] || '12:02:00'}`;
      });
    }

    return {
      success: true,
      data: {
        results,
      }
    };
  }

  return responseData;
};

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const config = response.config as any;
    if (env.NEXT_PUBLIC_USE_MOCK && config._originalUrl) {
      return handleMockFilter(config._originalUrl, config._originalParams, response.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (isRequestCanceled(error)) {
      return Promise.reject({
        success: false,
        message: 'canceled',
        code: 'REQUEST_CANCELED',
      });
    }

    const status = error.response?.status;
    const responseData = error.response?.data as any;

    const normalizedError: ApiError = {
      success: false,
      message: responseData?.message || error.message || 'Something went wrong',
      code: responseData?.code || 'UNKNOWN_ERROR',
      errors: responseData?.errors,
    };

    logger.error(`❌ [Axios] ${normalizedError.code}: ${normalizedError.message}`, { status });

    return Promise.reject(normalizedError);
  },
);
