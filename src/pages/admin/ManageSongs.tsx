import { useEffect, useState } from "react"
import { getSongs, createSong, updateSong, deleteSong } from "../../services/song.service"
import { getArtists } from "../../services/artist.service"
import type { Song } from "../../types/song.types"
import type { Artist } from "../../types/artist.types"

const ManageSongs = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [artists, setArtists] = useState<Artist[]>([])

    // State להוספה
    const [songName, setSongName] = useState('')
    const [artistId, setArtistId] = useState<number>(0)
    const [genere, setGenere] = useState('0') // enum בדרך כלל מתחיל מ-0
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [songFile, setSongFile] = useState<File | null>(null)

    // State לעריכה
    const [editingSong, setEditingSong] = useState<Song | null>(null)

    const fetchData = async () => {
        const [songsData, artistsData] = await Promise.all([getSongs(), getArtists()])
        setSongs(songsData)
        setArtists(artistsData)
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('SongName', songName)
        formData.append('ArtistId', artistId.toString())
        formData.append('Genere', genere)
        if (imageFile) formData.append('FileImage', imageFile)
        if (songFile) formData.append('FileSong', songFile)

        await createSong(formData)
        resetForm()
        fetchData()
    }

    const resetForm = () => {
        setSongName('')
        setArtistId(0)
        setImageFile(null)
        setSongFile(null)
    }

    const handleDelete = async (id: number) => {
        if (confirm('למחוק את השיר?')) {
            await deleteSong(id)
            fetchData()
        }
    }

    return (
        <div>
            <h2>ניהול שירים</h2>
            
            <form onSubmit={handleSubmit}>
                <input placeholder="שם שיר" value={songName} onChange={e => setSongName(e.target.value)} required />
                
                <select value={artistId} onChange={e => setArtistId(Number(e.target.value))} required>
                    <option value="">בחר אמן</option>
                    {artists.map(a => <option key={a.id} value={a.id}>{a.artistName}</option>)}
                </select>

                <select value={genere} onChange={e => setGenere(e.target.value)}>
                    <option value="0">POP</option>
                    <option value="1">ROCK</option>
                    <option value="2">FOLK</option>
                    {/* הוסיפי כאן את שאר הז'אנרים מה-enum */}
                </select>

                <label>תמונת קאבר:</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                
                <label>קובץ שמע:</label>
                <input type="file" accept="audio/*" onChange={e => setSongFile(e.target.files?.[0] ?? null)} />

                <button type="submit">הוסף שיר</button>
            </form>

            <hr />

            <div className="songs-list">
                {songs.map(song => (
                    <div key={song.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        {song.arrImage && <img src={`data:image/jpeg;base64,${song.arrImage}`} width={50} alt="" />}
                        <span>{song.songName} - <strong>{song.artistName}</strong> ({song.genere})</span>
                        <button onClick={() => handleDelete(song.id)}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageSongs