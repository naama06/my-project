import axiosInstance from "./axios"
import type { Song } from "../types/song.types"

export const getSongs = async (): Promise<Song[]> => {
    const response = await axiosInstance.get('Song')
    return response.data
}

export const createSong = async (formData: FormData): Promise<void> => {
    await axiosInstance.post('Song', formData)
}

export const updateSong = async (id: number, formData: FormData): Promise<void> => {
    await axiosInstance.put(`Song/${id}`, formData)
}

export const deleteSong = async (id: number): Promise<void> => {
    await axiosInstance.delete(`Song/${id}`)
}