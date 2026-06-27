import { useQuery } from '@tanstack/react-query';
import { specialTheatersService } from '../services/special-theaters.service';
import { TheaterType } from '../dto/special-theaters.dto';

export const specialTheatersKeys = {
  all: ['special-theaters'] as const,
  type: (type: TheaterType) => [...specialTheatersKeys.all, type] as const,
};

export const useSpecialTheater = (type: TheaterType) => {
  return useQuery({
    queryKey: specialTheatersKeys.type(type),
    queryFn: () => specialTheatersService.getTheaterType(type),
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
