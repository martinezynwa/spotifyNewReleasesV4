import { db } from '../../db'
import { ENDPOINTS, FETCH_TYPES } from '../../endpoints'
import {
  APIArtist,
  APIArtistsResponse,
  RequestMethod,
} from '../../types/api-types'
import { requestDataFromAPI } from '../../utils/api-handler'
import { ServiceProps } from './artist.service.types'

export const getAllArtists = async () => {
  return await db.selectFrom('Artist').selectAll().execute()
}

export const getArtistById = async (id: string) => {
  return await db
    .selectFrom('Artist')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export const fetchFollowedArtists = async ({
  accessToken,
  nextToken,
  followedArtists,
}: ServiceProps): Promise<APIArtist[]> => {
  const data = await requestDataFromAPI<APIArtistsResponse>({
    requestMethod: RequestMethod.GET,
    endpoint: ENDPOINTS.ME_FOLLOWING,
    params: {
      type: FETCH_TYPES.ARTISTS,
      limit: '50',
      after: nextToken ?? undefined,
    },
    accessToken,
  })

  followedArtists.push(...data.artists.items)

  const fetchAgain = data?.artists?.cursors?.after

  if (fetchAgain) {
    return fetchFollowedArtists({
      nextToken: fetchAgain,
      accessToken,
      followedArtists,
    })
  }

  return followedArtists
}

export const addArtistsToDatabase = async ({
  followedArtists,
  userId,
}: ServiceProps): Promise<number> => {
  const spotifyResponseArtistIds = followedArtists.map((artist) => artist.id)

  const artistsInDb = await db
    .selectFrom('Artist')
    .select('spotifyId')
    .where('userId', '=', userId!)
    .where('spotifyId', 'in', spotifyResponseArtistIds)
    .execute()

  const artistIdsInDb = artistsInDb.map((obj) => obj.spotifyId)

  const artistIdsNotInDb = spotifyResponseArtistIds.filter(
    (value) => !artistIdsInDb.includes(value),
  )

  if (artistIdsNotInDb.length === 0) {
    return 0
  }

  const artistsMap = new Map(
    followedArtists.map((artist) => [artist.id, artist]),
  )

  const newArtists = artistIdsNotInDb.map((artistSpotifyId) => {
    const spotifyArtist = artistsMap.get(artistSpotifyId)!

    return {
      userId,
      spotifyId: artistSpotifyId,
      name: spotifyArtist.name,
      image: spotifyArtist.images[0]?.url,
    }
  })

  if (newArtists.length === 0) {
    return 0
  }

  const created = await db.insertInto('Artist').values(newArtists).execute()

  return created.length
}

export const removeUnfollowedArtists = async ({
  followedArtists,
  userId,
}: ServiceProps): Promise<number> => {
  const artistsInDb = await db
    .selectFrom('Artist')
    .select('spotifyId')
    .where('userId', '=', userId!)
    .execute()

  const artistsNotFollowed = artistsInDb
    .filter(
      (artist) =>
        !followedArtists.some(
          (followedArtist) => followedArtist.id === artist.spotifyId,
        ),
    )
    .map((artist) => artist.spotifyId)

  if (artistsNotFollowed.length === 0) {
    return 0
  }

  await db
    .deleteFrom('Artist')
    .where('userId', '=', userId!)
    .where('spotifyId', 'in', artistsNotFollowed)
    .execute()

  return artistsNotFollowed.length
}
