import { DEFAULT_API_RESULTS_LIMIT, DEFAULT_DAY_LIMIT } from '../../constants'
import { getAccessToken } from '../../utils/token-handler'
import {
  addArtistsToDatabase,
  fetchFollowedArtists,
  removeUnfollowedArtists,
} from '../artist/artist.service'
import {
  addNewReleasesToDatabase,
  fetchAndFilterNewReleases,
  getTracksFromNewReleases,
} from '../release/release.service'
import { getAllUsers } from '../user/user.service'
import { NightlyJobResult } from './job.service.types'

export const nightlyJob = async ({ dayLimit }: NightlyJobResult) => {
  console.log('Nightly job started')

  const users = await getAllUsers()

  for (const user of users) {
    const userId = user.id

    const accessToken = await getAccessToken(userId)

    const followedArtists = await fetchFollowedArtists({
      accessToken,
      followedArtists: [],
    })

    const addedArtists = await addArtistsToDatabase({
      followedArtists,
      userId,
    })

    const removedArtists = await removeUnfollowedArtists({
      followedArtists,
      userId,
    })

    console.log(
      `${addedArtists} artists added, ${removedArtists} artists removed`,
    )

    const newReleases = await fetchAndFilterNewReleases({
      accessToken,
      userId,
      daysLimit: dayLimit || DEFAULT_DAY_LIMIT,
      apiResultsLimit: DEFAULT_API_RESULTS_LIMIT,
    })

    if (newReleases.length === 0) {
      console.log('No new releases added')
      return
    }

    const addedNewReleases = await addNewReleasesToDatabase(newReleases)

    const followedArtistIds = followedArtists.map((artist) => artist.id)

    await getTracksFromNewReleases({
      newReleases: addedNewReleases,
      accessToken,
      user,
      followedArtistIds,
    })

    console.log(`Added ${addedNewReleases.length} new releases`)
  }
}
