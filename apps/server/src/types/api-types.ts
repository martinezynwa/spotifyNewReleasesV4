import { Release } from '@packages/types/dist'

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

type ExternalURL = {
  spotify: string
}

type Followers = {
  href?: string
  total: number
}

type Image = {
  url: string
  height?: number
  width?: number
}

type Restriction = {
  reason: string
}

type Copyright = {
  text: string
  type: string
}

type ExternalIds = {
  isrc: string
  ean: string
  upc: string
}

export type SimplifiedTrackArtistObject = {
  external_urls: ExternalURL
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export type LinkedFrom = {
  external_urls: ExternalURL
  href: string
  id: string
  type: string
  uri: string
}

export type APIArtist = {
  external_urls: ExternalURL
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}

export type APIArtistRelease = {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalURL
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: Restriction
  type: string
  uri: string
  copyrights?: Copyright[]
  external_ids?: ExternalIds
  genres?: string[]
  label?: string
  popularity?: number
  album_group?: Release['type']
  artists: SimplifiedTrackArtistObject[]
}

export type APIAlbumTrack = {
  artists: SimplifiedTrackArtistObject[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: ExternalURL
  href: string
  id: string
  is_playable: boolean
  linked_from: LinkedFrom
  restrictions: Restriction
  name: string
  preview_url: string
  track_number: BigInteger
  type: string
  uri: string
  is_local: boolean
}

type APIUserPlaylistOwner = {
  id: string
  type: 'user'
}

export type APIUserPlaylist = {
  id: string
  name: string
  owner: APIUserPlaylistOwner
}

type Cursor = {
  after: string
}

export type APIObject = {
  href: string
  limit: number
  next: string
  cursors: Cursor
  total: number
  offset: number
  previous: string
}

export type APIUserPlaylistsResponse = Pick<APIObject, 'href'> & {
  items: APIUserPlaylist[]
}

export type APIArtistsResponse = {
  artists: Omit<APIObject & { items: APIArtist[] }, 'offset' | 'previous'>
}

export type APIArtistReleaseResponse = Omit<APIObject, 'cursors'> & {
  items: APIArtistRelease[]
}

export type APIAlbumTracksResponse = Omit<APIObject, 'cursors'> & {
  items: APIAlbumTrack[]
}

export type APIArtistReleaseWithGroupId = APIArtistRelease & {
  groupId?: string
}

export type APICreatePlaylistResponse = {
  id: string
  name: string
}

export interface APITokenResponse {
  data: unknown
}

export enum ReleaseType {
  ALBUM = 'album',
  SINGLE = 'single',
  COMPILATION = 'compilation',
  APPEARS_ON = 'appears_on',
}
