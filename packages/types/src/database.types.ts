import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Account {
  access_token: string | null;
  expires_at: number | null;
  id: Generated<string>;
  id_token: string | null;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  scope: string | null;
  session_state: string | null;
  token_type: string | null;
  type: string;
  userId: string;
}

export interface Artist {
  createdAt: Generated<Timestamp>;
  groupId: string | null;
  id: Generated<string>;
  image: string | null;
  name: string;
  spotifyId: string;
  updatedAt: Generated<Timestamp>;
  userId: string | null;
}

export interface Group {
  connectedPlaylistId: string;
  connectedPlaylistName: string;
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  name: string;
  updatedAt: Generated<Timestamp>;
  userId: string | null;
}

export interface Log {
  action: string;
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  message: string;
  updatedAt: Generated<Timestamp>;
  userId: string | null;
}

export interface Release {
  artistNames: string[] | null;
  artistSpotifyIds: string[] | null;
  createdAt: Generated<Timestamp>;
  groupId: string | null;
  id: Generated<string>;
  image: string | null;
  name: string;
  releaseDate: string;
  spotifyReleaseId: string;
  type: "album" | "appears_on" | "compilation" | "single";
  updatedAt: Generated<Timestamp>;
  userId: string | null;
}

export interface User {
  addAlbumsToSeparatePlaylist: Generated<boolean>;
  addOnlySongsFromFollowedArtists: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  email: string;
  emailVerified: string;
  id: Generated<string>;
  ignoreKeyWords: string[];
  image: string | null;
  name: string;
  refreshToken: string | null;
  spotifyId: string | null;
  spotifyName: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  Account: Account;
  Artist: Artist;
  Group: Group;
  Log: Log;
  Release: Release;
  User: User;
}
