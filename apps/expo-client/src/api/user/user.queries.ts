import { useAuth } from '@/providers/AuthProvider'
import { User } from '@example-app/types'
import { useQuery } from '@tanstack/react-query'
import { handleFetch } from '../fetch'

export const useUser = () => {
  const { session } = useAuth()
  const userId = session?.user.id!

  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => handleFetch<User>(`/users/${userId}`),
    enabled: !!userId,
  })
}
