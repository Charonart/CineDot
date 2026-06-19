import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { TheaterTypeDTO, TheaterType } from '../dto/special-theaters.dto';

export const specialTheatersApi = {
  getTheaterType: (type: TheaterType): Promise<ApiResponse<TheaterTypeDTO>> =>
    axiosClient.get(`/special-theaters/${type}`),
};
