export interface CreatePlaylistProps {
  playlistName: string
  publicPlaylist?: boolean
  collaborative?: boolean
  description?: boolean
  accessToken?: string
  nextToken?: string
  userSpotifyId?: string
  appUsername?: string
}
