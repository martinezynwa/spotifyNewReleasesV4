import { db } from '../../db'
import { ReleaseType } from '../../types/api-types'
import {
  categorizeByReleaseType,
  filterDuplicatedReleases,
  filterNewReleasesOfArtists,
  getAllArtistsReleases,
  handleNewReleasedAlbums,
  handleNewReleasedSingles,
} from './release.service.helpers'
import {
  FetchNewReleasesProps,
  GetNewTracksFromReleasesProps,
  NewRelease,
} from './release.service.types'

export const getAllReleases = async () => {
  return await db.selectFrom('Release').selectAll().execute()
}

export const getReleaseById = async (id: string) => {
  return await db
    .selectFrom('Release')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export const fetchAndFilterNewReleases = async ({
  accessToken,
  userId,
  apiResultsLimit,
  daysLimit,
}: FetchNewReleasesProps): Promise<NewRelease[]> => {
  const artists = await db
    .selectFrom('Artist')
    .selectAll()
    .where('userId', '=', userId)
    .execute()

  const allReleases = await getAllArtistsReleases({
    artists,
    accessToken,
    apiResultsLimit,
  })
  if (allReleases.length === 0) return []

  const newReleases = filterNewReleasesOfArtists({
    allReleases,
    daysLimit,
    userId: userId,
  })
  if (newReleases.length === 0) return []

  /*filter duplicates in case there are some in db(spotify bug, some releases
  are appearing every day)*/
  const releasesToBeAdded = await filterDuplicatedReleases(newReleases)

  return releasesToBeAdded
}

export const addNewReleasesToDatabase = async (newReleases: NewRelease[]) => {
  const created = await db
    .insertInto('Release')
    .values(newReleases)
    .returningAll()
    .execute()

  return created
}

export const getTracksFromNewReleases = async ({
  newReleases,
  accessToken,
  user,
  followedArtistIds,
}: GetNewTracksFromReleasesProps) => {
  const { addAlbumsToSeparatePlaylist } = user

  const categorized = addAlbumsToSeparatePlaylist
    ? categorizeByReleaseType(newReleases)
    : null

  const addedAlbums = addAlbumsToSeparatePlaylist
    ? await handleNewReleasedAlbums({
        newReleases: categorized?.[ReleaseType.ALBUM] ?? [],
        accessToken,
        user,
      })
    : null

  const addedSingles = await handleNewReleasedSingles({
    accessToken,
    followedArtistIds,
    newReleases: categorized?.[ReleaseType.SINGLE] ?? newReleases ?? [],
    user,
  })

  return addAlbumsToSeparatePlaylist
    ? { totalSongs: addedSingles }
    : { addedAlbums, addedSingles }
}
