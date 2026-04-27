import type { Song } from './song.types';

export interface Playlist {
    id: number;
    playlistName: string;
    playlistCoverPath: string | null;
    userName: string;
    songsCount: number;
    arrCover: string | null; // זה ה-byte[] שמגיע מהשרת כ-Base64
}

export interface PlaylistDetails extends Playlist {
    songs: Song[];
}