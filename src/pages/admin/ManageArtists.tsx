import { useEffect, useState } from "react"
import { getArtists, createArtist } from "../../services/artist.service"
import type { Artist } from "../../types/artist.types"

const ManageArtists = () => {
    const [artists, setArtists] = useState<Artist[]>([])
    const [artistName, setArtistName] = useState('')
    const [about, setAbout] = useState('')
    const [image, setImage] = useState<File | null>(null)

    const fetchArtists = async () => {
        const data = await getArtists()
        setArtists(data)
    }

    useEffect(() => {
        fetchArtists()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('artistName', artistName)
        formData.append('about', about)
        if (image) formData.append('fileImage', image)

        await createArtist(formData)
        setArtistName('')
        setAbout('')
        setImage(null)
        fetchArtists() // רענון הרשימה אחרי הוספה
    }

    // const toImageSrc = (arrImage: number[]) => {
    //     const bytes = new Uint8Array(arrImage)
    //     const blob = new Blob([bytes], { type: 'image/jpeg' })
    //     return URL.createObjectURL(blob)
    // }
    const toImageSrc = (arrImage: string) => {
        return `data:image/jpeg;base64,${arrImage}`
    }
    return (
        <div>
            <h2>ניהול אמנים</h2>

            {/* טופס הוספה */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="שם אמן"
                    value={artistName}
                    onChange={e => setArtistName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="אודות"
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImage(e.target.files?.[0] ?? null)}
                />
                <button type="submit">הוסף אמן</button>
            </form>

            {/* רשימת אמנים */}
            <div>
                {artists.map(artist => (
                    <div key={artist.id}>
                        {artist.arrImage && (
                            <img src={toImageSrc(artist.arrImage)} alt={artist.artistName} width={80} />
                        )}
                        <p>{artist.artistName}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageArtists