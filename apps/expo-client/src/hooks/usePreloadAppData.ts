import { useLogs } from '@/api/logs/log.queries'
import { useReleases } from '@/api/releases/release.queries'
import { useEffect, useState } from 'react'

export const usePreloadAppData = () => {
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { isFetched: releasesFetched, error: releasesError } = useReleases()
  const { isFetched: logsFetched, error: logsError } = useLogs()

  useEffect(() => {
    if (releasesFetched && logsFetched && !initialLoaded) {
      setInitialLoaded(true)
    }
  }, [releasesFetched, logsFetched, initialLoaded])

  return { error: releasesError || logsError, initialLoaded }
}
