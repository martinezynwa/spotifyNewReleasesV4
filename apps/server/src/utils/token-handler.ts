import { SPOTIFY_REFRESH_TOKEN_URL } from '../constants'
import { db } from '../db'
import { getUserById } from '../services/user/user.service'
import { logger } from './logger'

type JWT = {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  error?: string
}

export const updateUserRefreshToken = async (
  userId: string,
  refreshToken: string,
) => {
  await db
    .updateTable('User')
    .set({ refreshToken })
    .where('id', '=', userId)
    .execute()
}

export const tokenHandler = async (refreshToken: string) => {
  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64')

  const response = await fetch(SPOTIFY_REFRESH_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = (await response.json()) as {
    access_token: string
    expires_in: number
    scope: string
    token_type: string
    refresh_token: string
  }

  return data
}

export const getAccessToken = async (userId: string): Promise<string> => {
  const userData = await getUserById(userId)

  if (!userData?.refreshToken) {
    await logger({
      action: 'getAccessToken',
      message: 'Error obtaining userId',
    })
    throw new Error('Error obtaining userId') //Error handling TBD
  }

  try {
    const data = await tokenHandler(userData.refreshToken)
    await updateUserRefreshToken(userId, data.refresh_token)

    return data.access_token
  } catch (error) {
    console.error(error)
    await logger({
      action: 'getAccessToken',
      message: 'Error obtaining access token',
      userId: userData.id,
    })
    throw new Error('Error obtaining access token') //Error handling TBD
  }
}

export const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const { access_token, expires_in } = await tokenHandler(
      token.refreshToken ?? '',
    )

    return {
      ...token,
      accessToken: access_token,
      accessTokenExpires: Date.now() + expires_in * 1000,
    }
  } catch (error) {
    console.error(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
