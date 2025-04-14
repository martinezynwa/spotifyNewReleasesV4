import { Log } from '@example-app/types'
import { useQuery } from '@tanstack/react-query'
import { handleFetch } from '../fetch'

export const useLogs = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: () => handleFetch<Log[]>('/logs'),
  })
}
