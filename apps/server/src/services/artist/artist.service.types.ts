import { APIArtist } from '../../types/api-types'

export interface ServiceProps {
  accessToken?: string
  nextToken?: string
  followedArtists: APIArtist[]
  userId?: string
}
