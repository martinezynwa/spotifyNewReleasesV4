import { Artist, Release, User } from '@packages/types'
import { APIArtistReleaseWithGroupId } from '../../types/api-types'

export interface FetchNewReleasesProps {
  accessToken: string
  userId: string
  apiResultsLimit: string
  daysLimit: number
}

export interface GetAllArtistsReleases {
  artists: Artist[]
  accessToken: string
  apiResultsLimit: string
}

export interface GetArtistReleasesProps {
  artist: Artist
  accessToken: string
  apiResultsLimit: string
}

export interface FilterArtistsReleasesProps {
  allReleases: APIArtistReleaseWithGroupId[]
  userId: string
  daysLimit: number
}

export interface GetNewTracksFromReleasesProps {
  accessToken: string
  newReleases: Release[]
  user: User
  followedArtistIds: string[]
}

export interface HandleNewReleasedAlbumsProps {
  accessToken: string
  newReleases: Release[]
  user: User
}

export type NewRelease = Omit<
  Release,
  'id' | 'groupId' | 'createdAt' | 'updatedAt'
>

export type ReleasedAlbum = {
  albumId: string
  trackIds: string[]
  name: string
  playlistId?: string
}

export interface GetAllTrackIdsProps {
  allTracks: TrackWithGroupId[]
}

export type TrackWithGroupId = {
  trackId: string
  groupId: string
}

export type JoinedTracksByGroup = Record<string, string[]>

export interface AddTracksToPlaylistsProps {
  accessToken: string
  joinedTracksByGroup: JoinedTracksByGroup
}

export interface HandleNewReleasedSinglesProps {
  newReleases: Release[]
  accessToken: string
  user: User
  followedArtistIds: string[]
}

export interface GetAllTracksProps {
  newReleases: Release[]
  followedArtistIds: string[]
  accessToken: string
  user: User
}
