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

export function useMovieDetail(slug: string, initialMovie?: MovieDetail | null) {
  const [movie, setMovie] = useState<MovieDetail | null>(initialMovie || null);
  const [cast, setCast] = useState<MovieCastMember[]>(initialMovie?.castMembers || []);
  const [crew, setCrew] = useState<MovieCrewMember[]>(initialMovie?.crewMembers || []);
  const [recommended, setRecommended] = useState<MovieCardItem[]>([]);
  const [reviews, setReviews] = useState<MovieReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialMovie);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!initialMovie) {
        setLoading(true);
      }
      try {
        const movieData = initialMovie || (await fetchMovieDetail(slug));

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
  }, [slug, initialMovie]);

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