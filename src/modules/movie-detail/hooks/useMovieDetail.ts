'use client';

import { useState, useEffect, useCallback } from 'react';
import { MovieDetail, MovieCastMember, MovieCrewMember, MovieReviewItem } from '../types/movie-detail.types';
import { MovieCardItem } from '@/modules/home/types/home.types';
import {
  fetchMovieDetail,
  fetchRecommendedMovies,
  fetchMovieReviews,
  submitMovieReview,
} from '../services/movie-detail.service';

export function useMovieDetail(slug: string) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<MovieCastMember[]>([]);
  const [crew, setCrew] = useState<MovieCrewMember[]>([]);
  const [recommended, setRecommended] = useState<MovieCardItem[]>([]);
  const [reviews, setReviews] = useState<MovieReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const movieData = await fetchMovieDetail(slug);

        if (isMounted && movieData) {
          setMovie(movieData);
          setCast(movieData.castMembers || []);
          setCrew(movieData.crewMembers || []);

          const genreId = movieData.genreIds?.[0];

          // Fetch recommended & reviews using movie id
          const [recommendedData, reviewsData] = await Promise.all([
            fetchRecommendedMovies(genreId, movieData.id),
            fetchMovieReviews(movieData.id),
          ]);

          if (isMounted) {
            setRecommended(recommendedData);
            setReviews(reviewsData);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handlePostReview = useCallback(async (rating: number, comment: string) => {
    if (!movie?.id) return { success: false, message: 'Phim không tồn tại' };
    const res = await submitMovieReview(movie.id, { rating, comment });
    if (res.success && res.review) {
      setReviews((prev) => [res.review!, ...prev]);
    }
    return res;
  }, [movie?.id]);

  return { movie, cast, crew, recommended, reviews, loading, handlePostReview };
}
