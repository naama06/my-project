import axiosInstance from "./axios"
import type { Artist } from "../types/artist.types"

export const getArtists = async (): Promise<Artist[]> => {
    const response = await axiosInstance.get('Artist')
    return response.data
}

export const createArtist = async (formData: FormData): Promise<void> => {
    await axiosInstance.post('Artist', formData)
}