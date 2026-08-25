import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';

export interface AdminPersonItem {
  id: number | string;
  person_id?: number | string;
  tmdb_person_id?: number;
  name: string;
  original_name?: string;
  gender?: number;
  profile_path?: string;
  avatar?: string;
  adult?: boolean;
  popularity?: number;
  known_for_department?: string;
  biography?: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  imdb_id?: string;
  homepage?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetPersonsParams {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
  department?: string;
  gender?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  sort_direction?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export const adminPersonsService = {
  async getPersons(params: GetPersonsParams = {}) {
    const page = params.page || 1;
    const limit = params.limit || params.per_page || 15;
    
    // Extract filter values if passed via CineDataTable filters object
    let department = params.department;
    let gender = params.gender;

    if (params.filters) {
      if (params.filters.known_for_department) {
        department = params.filters.known_for_department.eq || params.filters.known_for_department.contains || params.filters.known_for_department;
      }
      if (params.filters.department) {
        department = params.filters.department.eq || params.filters.department.contains || params.filters.department;
      }
      if (params.filters.gender) {
        gender = params.filters.gender.eq || params.filters.gender;
      }
    }

    const queryPayload: Record<string, any> = {
      page,
      limit,
      per_page: limit,
    };

    if (params.search && params.search.trim()) {
      queryPayload.search = params.search.trim();
    }

    if (department && department !== 'ALL') {
      queryPayload.department = department;
    }

    if (gender !== undefined && gender !== null && String(gender) !== 'ALL') {
      queryPayload.gender = gender;
    }

    if (params.sort_by) {
      queryPayload.sort_by = params.sort_by;
      queryPayload.sort_dir = params.sort_dir || params.sort_direction || 'desc';
    }

    const res = await apiClient.get(ENDPOINTS.ADMIN.PERSONS, {
      params: queryPayload,
    });

    const payload = res.data?.data;
    const meta = res.data?.meta || payload;
    const rawList = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];

    const normalized: AdminPersonItem[] = rawList.map((p: any) => ({
      id: p.id || p.person_id || p.personId,
      person_id: p.person_id || p.personId || p.id,
      tmdb_person_id: p.tmdb_person_id || p.tmdbPersonId,
      name: p.name || '',
      original_name: p.original_name || p.originalName,
      gender: p.gender,
      profile_path: p.profile_path || p.profilePath || p.avatar,
      avatar: p.avatar || p.profile_path || p.profilePath,
      adult: Boolean(p.adult),
      popularity: Number(p.popularity || 0),
      known_for_department: p.known_for_department || p.knownForDepartment || 'Acting',
      biography: p.biography || p.bio,
      birthday: p.birthday,
      deathday: p.deathday,
      place_of_birth: p.place_of_birth || p.placeOfBirth,
      imdb_id: p.imdb_id || p.imdbId,
      homepage: p.homepage,
      created_at: p.created_at || p.createdAt,
      updated_at: p.updated_at || p.updatedAt,
    }));

    const total = meta?.total || meta?.totalResults || payload?.totalResults || payload?.total || normalized.length;
    const totalPages = meta?.last_page || meta?.totalPages || payload?.totalPages || payload?.last_page || Math.ceil(total / limit) || 1;
    const currentPage = meta?.current_page || payload?.page || payload?.current_page || page;

    return {
      data: normalized,
      items: normalized,
      results: normalized,
      meta: {
        current_page: currentPage,
        per_page: limit,
        total,
        last_page: totalPages,
        totalPages,
        totalResults: total,
      },
      pagination: {
        page: currentPage,
        currentPage,
        perPage: limit,
        total,
        totalResults: total,
        totalPages,
        lastPage: totalPages,
      },
      page: currentPage,
      totalPages,
      totalResults: total,
    };
  },

  async getPerson(id: string | number) {
    const res = await apiClient.get(`${ENDPOINTS.ADMIN.PERSONS}/${id}`);
    return res.data?.data;
  },

  async createPerson(data: Partial<AdminPersonItem>) {
    const res = await apiClient.post(ENDPOINTS.ADMIN.PERSONS, data);
    return res.data;
  },

  async updatePerson(id: string | number, data: Partial<AdminPersonItem>) {
    const res = await apiClient.put(`${ENDPOINTS.ADMIN.PERSONS}/${id}`, data);
    return res.data;
  },

  async deletePerson(id: string | number) {
    const res = await apiClient.delete(`${ENDPOINTS.ADMIN.PERSONS}/${id}`);
    return res.data;
  },
};
