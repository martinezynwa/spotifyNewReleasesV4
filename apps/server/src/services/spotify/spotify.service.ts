import { ENDPOINTS } from '../../endpoints'
import { APICreatePlaylistResponse, RequestMethod } from '../../types/api-types'
import { requestDataFromAPI } from '../../utils/api-handler'
import { CreatePlaylistProps } from './spotify.service.types'

export const createPlaylist = async ({
  accessToken,
  userSpotifyId,
  playlistName,
  publicPlaylist = false,
}: CreatePlaylistProps) => {
  const data = await requestDataFromAPI<APICreatePlaylistResponse>({
    requestMethod: RequestMethod.POST,
    endpoint: ENDPOINTS.USERS,
    subEndpoint: `/${userSpotifyId ?? ''}/playlists`,
    body: {
      name: playlistName,
      public: publicPlaylist,
    },
    accessToken,
  })

  return data
}
