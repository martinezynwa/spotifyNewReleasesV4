import { useQuery } from '@tanstack/react-query'
import { handleFetch } from '../fetch'

export const useReleases = () => {
  return useQuery({
    queryKey: ['releases'],
    queryFn: () => handleFetch('/releases'),
  })
}
