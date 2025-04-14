import { useReleases } from '@/api/releases/release.queries'
import { useEffect, useState } from 'react'

export const usePreloadAppData = () => {
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { isFetched: releasesFetched, error: releasesError } = useReleases()

  useEffect(() => {
    if (releasesFetched && !initialLoaded) {
      setInitialLoaded(true)
    }
  }, [releasesFetched, initialLoaded])

  return { error: releasesError, initialLoaded }
}
