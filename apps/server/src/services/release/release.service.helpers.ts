import { Release, User } from '@packages/types'
import {
  SPOTIFY_TRACK_JOIN_SIGN,
  SPOTIFY_TRACK_SEPARATOR,
} from '../../constants'
import { db } from '../../db'
import { ENDPOINTS, FETCH_TYPES } from '../../endpoints'
import {
  APIAlbumTrack,
  APIAlbumTracksResponse,
  APIArtistReleaseResponse,
  APIArtistReleaseWithGroupId,
  ReleaseType,
  RequestMethod,
} from '../../types/api-types'
import { requestDataFromAPI } from '../../utils/api-handler'
import { formatToDateWithMs, passingDaysLimit } from '../../utils/date-and-time'
import { createPlaylist } from '../spotify/spotify.service'
import {
  AddTracksToPlaylistsProps,
  FilterArtistsReleasesProps,
  GetAllArtistsReleases,
  GetAllTrackIdsProps,
  GetAllTracksProps,
  GetArtistReleasesProps,
  HandleNewReleasedAlbumsProps,
  HandleNewReleasedSinglesProps,
  JoinedTracksByGroup,
  NewRelease,
  ReleasedAlbum,
  TrackWithGroupId,
} from './release.service.types'

const releaseTypeMapper: Record<string, ReleaseType> = {
  album: ReleaseType.ALBUM,
  single: ReleaseType.SINGLE,
  compilation: ReleaseType.COMPILATION,
  appears_on: ReleaseType.APPEARS_ON,
}

export const getAllArtistsReleases = async ({
  artists,
  accessToken,
  apiResultsLimit,
}: GetAllArtistsReleases) => {
  const allReleases: APIArtistReleaseWithGroupId[] = []

  for (const artist of artists) {
    const releasesOfArtist = await getAllReleasesOfSingleArtist({
      artist,
      accessToken,
      apiResultsLimit,
    })

    if (releasesOfArtist.length !== 0) {
      allReleases.push(...releasesOfArtist)
    }
  }
  return allReleases
}

export const getAllReleasesOfSingleArtist = async ({
  artist,
  accessToken,
  apiResultsLimit,
}: GetArtistReleasesProps) => {
  const releaseTypes = [ReleaseType.ALBUM, ReleaseType.SINGLE]

  const allReleases: APIArtistReleaseWithGroupId[] = []

  for (const type of releaseTypes) {
    const { items: releases } =
      await requestDataFromAPI<APIArtistReleaseResponse>({
        requestMethod: RequestMethod.GET,
        endpoint: ENDPOINTS.ARTISTS,
        subEndpoint: `/${artist.spotifyId}/${FETCH_TYPES.ALBUMS}`,
        params: {
          include_groups: type.toLowerCase(),
          apiResultsLimit,
        },
        accessToken,
      })

    if (releases.length !== 0) {
      allReleases.push(
        ...releases.map((release) => ({
          ...release,
          groupId: artist.groupId ?? undefined,
        })),
      )
    }
  }
  return allReleases
}

export const filterNewReleasesOfArtists = ({
  allReleases,
  daysLimit,
  userId,
}: FilterArtistsReleasesProps) => {
  const filteredReleases: NewRelease[] = allReleases
    .filter((release) => passingDaysLimit(release.release_date, daysLimit))
    .map((release, i) => ({
      spotifyReleaseId: release.id,
      userId,
      name: release.name,
      groupId: release.groupId ?? undefined,
      releaseDate: formatToDateWithMs(release.release_date, i),
      type: releaseTypeMapper[release.album_group!] ?? ReleaseType.SINGLE,
      image: release.images[1]?.url ?? '',
      artistNames: release.artists.map((artist) => artist.name),
      artistSpotifyIds: release.artists.map((artist) => artist.id),
    }))

  return filteredReleases
}

export const filterDuplicatedReleases = async (newReleases: NewRelease[]) => {
  const uniqueNewReleases = [
    ...new Map(newReleases.map((r) => [r.spotifyReleaseId, r])).values(),
  ]

  const uniqueNewReleaseIds = uniqueNewReleases.map(
    (release) => release.spotifyReleaseId,
  )

  const releasesInDb = await db
    .selectFrom('Release')
    .selectAll()
    .where('spotifyReleaseId', 'in', uniqueNewReleaseIds)
    .execute()

  const releasesToBeAdded = uniqueNewReleases.filter(
    (release) =>
      !releasesInDb.some(
        (db) => db.spotifyReleaseId === release.spotifyReleaseId,
      ),
  )

  return releasesToBeAdded
}

export const categorizeByReleaseType = (releases: Release[]) =>
  releases.reduce(
    (acc, item) => {
      const releaseType = item.type

      acc[releaseType] = acc[releaseType] ?? []
      acc[releaseType]?.push(item)

      return acc
    },
    {} as Record<ReleaseType, Release[]>,
  )

export const handleNewReleasedAlbums = async ({
  newReleases,
  accessToken,
  user,
}: HandleNewReleasedAlbumsProps) => {
  const albums: ReleasedAlbum[] = []

  for (const albumRelease of newReleases) {
    const { items } = await requestDataFromAPI<APIAlbumTracksResponse>({
      requestMethod: RequestMethod.GET,
      endpoint: ENDPOINTS.ALBUMS,
      subEndpoint: `/${albumRelease.spotifyReleaseId}/${FETCH_TYPES.TRACKS}`,
      params: {
        limit: '50',
      },
      accessToken,
    })

    albums.push({
      albumId: albumRelease.spotifyReleaseId,
      trackIds: items.map((track) => track.id),
      name: `${albumRelease.artistNames?.[0]} - ${albumRelease.name}`,
    })
  }

  //create playlists
  for (const album of albums) {
    const newPlaylistDetails = await createPlaylist({
      accessToken,
      userSpotifyId: user.spotifyId ?? '',
      playlistName: album.name,
    })

    album.playlistId = newPlaylistDetails.id
  }

  const allTracks = albums.flatMap((album) =>
    album.trackIds.map((trackId) => ({
      groupId: album.playlistId!,
      trackId,
    })),
  )

  //add the songs into the playlist
  const joinedTracksByGroup = prepareTracksForPlaylists({ allTracks })

  await addTracksToPlaylists({ accessToken, joinedTracksByGroup })

  return albums.length
}

export const prepareTracksForPlaylists = ({
  allTracks,
}: GetAllTrackIdsProps) => {
  const tracksGroupedByPlaylist = allTracks.reduce<Record<string, string[][]>>(
    (acc, obj) => {
      if (!acc[obj.groupId]) {
        acc[obj.groupId] = [[]]
      }

      const group = acc[obj.groupId]!

      if (group?.[group?.length - 1]?.length === 30) {
        group.push([])
      }

      group?.[group?.length - 1]?.push(
        `${SPOTIFY_TRACK_SEPARATOR}${obj.trackId}`,
      )

      return acc
    },
    {},
  )

  const joinedTracks: Record<string, string[]> = Object.entries(
    tracksGroupedByPlaylist,
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.map((array) => array.join(SPOTIFY_TRACK_JOIN_SIGN)),
    }),
    {} as JoinedTracksByGroup,
  )

  return joinedTracks
}

export const addTracksToPlaylists = async ({
  accessToken,
  joinedTracksByGroup,
}: AddTracksToPlaylistsProps) => {
  for (const playlistId in joinedTracksByGroup) {
    const uris = joinedTracksByGroup[playlistId]!

    for (const joinedTracks of uris) {
      await requestDataFromAPI({
        requestMethod: RequestMethod.POST,
        endpoint: ENDPOINTS.PLAYLISTS,
        subEndpoint: `/${playlistId}/${FETCH_TYPES.TRACKS}?uris=${joinedTracks}`,
        accessToken,
      })
    }
  }
}

export const handleNewReleasedSingles = async ({
  accessToken,
  followedArtistIds,
  newReleases,
  user,
}: HandleNewReleasedSinglesProps) => {
  const allTracks = await getAllTracks({
    newReleases,
    accessToken,
    user,
    followedArtistIds,
  })

  const joinedTracksByGroup = prepareTracksForPlaylists({ allTracks })

  await addTracksToPlaylists({ accessToken, joinedTracksByGroup })

  return allTracks.length
}

export const getAllTracks = async ({
  newReleases,
  followedArtistIds,
  accessToken,
  user,
}: GetAllTracksProps) => {
  const { addOnlySongsFromFollowedArtists, ignoreKeyWords } = user

  const allTracks: TrackWithGroupId[] = []

  const releasesWithGroupId = newReleases.filter((obj) => obj?.groupId)

  if (releasesWithGroupId.length === 0) return []

  const shouldFilterTracks = addOnlySongsFromFollowedArtists || ignoreKeyWords

  const groups = await db
    .selectFrom('Group')
    .selectAll()
    .where('userId', '=', user.id.toString())
    .execute()

  const groupWithSpotifyIds = new Map(
    groups.map((group) => [group.id, group.connectedPlaylistId]),
  )

  for (const release of releasesWithGroupId) {
    const { items: tracks } = await requestDataFromAPI<APIAlbumTracksResponse>({
      requestMethod: RequestMethod.GET,
      endpoint: ENDPOINTS.ALBUMS,
      subEndpoint: `/${release.spotifyReleaseId}/${FETCH_TYPES.TRACKS}`,
      params: {
        limit: '50',
      },
      accessToken,
    })

    if (tracks.length !== 0) {
      allTracks.push(
        ...tracks
          .filter((track) =>
            shouldFilterTracks
              ? shouldIncludeTrack(track, user, followedArtistIds)
              : true,
          )
          .map((track) => ({
            trackId: track.id,
            groupId: groupWithSpotifyIds.get(release.groupId!)!,
          })),
      )
    }
  }

  return allTracks
}

const shouldIncludeTrack = (
  track: APIAlbumTrack,
  user: User,
  followedArtistIds: string[],
) => {
  const { addOnlySongsFromFollowedArtists, ignoreKeyWords } = user

  if (
    ignoreKeyWords?.some((keyword) =>
      track.name.toLowerCase().includes(keyword),
    )
  ) {
    return false
  }

  if (
    addOnlySongsFromFollowedArtists &&
    !track.artists.some((artist) => followedArtistIds.includes(artist.id))
  ) {
    return false
  }

  return true
}
