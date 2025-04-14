import { useUser } from '@/api'
import { useUserDataStore } from '@/store'
import { useEffect, useState } from 'react'

export const usePreloadAppCatalogData = () => {
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { setUserData } = useUserDataStore()

  const { data: user, error: userError } = useUser()

  useEffect(() => {
    if (!initialLoaded && !!user) {
      setUserData({ user })
      setInitialLoaded(true)
    }
  }, [initialLoaded, user])

  const error = userError

  return { error, initialLoaded }
}
