import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { PersonDetail, PersonMovieCredit } from '../types/person.types';
import { imageHelper } from '@/shared/utils/imageHelper';

export async function fetchPersonDetail(id: number | string): Promise<PersonDetail | null> {
  try {
    const res = await apiClient.get(ENDPOINTS.MASTER.PERSON(id));
    if (res.data?.success && res.data?.data) {
      const p = res.data.data;

      const castMovies: PersonMovieCredit[] = Array.isArray(p.cast_movies)
        ? p.cast_movies.map((cm: any) => ({
            movieId: cm.movie_id || cm.id,
            slug: cm.slug || 'movie-detail',
            title: cm.title || 'Phim tham gia',
            posterUrl: cm.poster ? imageHelper.getPosterUrl(cm.poster) : undefined,
            characterName: cm.character_name || cm.character,
            order: cm.order,
          }))
        : [];

      const crewMovies: PersonMovieCredit[] = Array.isArray(p.crew_movies)
        ? p.crew_movies.map((crm: any) => ({
            movieId: crm.movie_id || crm.id,
            slug: crm.slug || 'movie-detail',
            title: crm.title || 'Phim sản xuất',
            posterUrl: crm.poster ? imageHelper.getPosterUrl(crm.poster) : undefined,
            job: crm.job || 'Đạo diễn',
            department: crm.department || 'Directing',
          }))
        : [];

      const genderLabel = p.gender === 1 ? 'Nữ' : p.gender === 2 ? 'Nam' : 'Chưa rõ';

      return {
        id: p.id || id,
        tmdbPersonId: p.tmdb_person_id,
        name: p.name || 'Nghệ Sĩ',
        originalName: p.original_name,
        gender: p.gender,
        genderLabel,
        avatarUrl: p.avatar ? imageHelper.getPosterUrl(p.avatar) : undefined,
        adult: Boolean(p.adult),
        popularity: Number(p.popularity || 0),
        knownForDepartment: p.known_for_department || (crewMovies.length > 0 ? 'Directing' : 'Acting'),
        bio: p.bio || p.biography || 'Đang cập nhật tiểu sử nghệ sĩ...',
        birthday: p.birthday,
        deathday: p.deathday,
        placeOfBirth: p.place_of_birth,
        imdbId: p.imdb_id,
        homepage: p.homepage,
        castMovies,
        crewMovies,
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to fetch person detail', e);
    return null;
  }
}
