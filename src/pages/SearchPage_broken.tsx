import React, { useState, useEffect } from 'react';
import { searchAll } from '../services/search.service';
import { getSongsByGenre } from '../services/song.service'; // שימוש בפונקציה שהוספנו
import { getPlaylistsByUserId } from '../services/playlist.service';
import { addSongToPlaylist } from '../services/playlist.service';
import { useAuthContext } from '../auth/useAuthContext';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, X, Music, Users, ChevronRight, Plus, Check } from 'lucide-react';
import '../style/SearchPage.css';

// הסדר תואם בדיוק ל-Enum: POP, ROCK, FOLK, COUNTRY, JEWISH
const genres = [
    { id: 0, name: 'Pop', color: 'genre-pink', image: 'https://images.unsplash.com/photo-1725101593263-293522ee89c3?q=80&w=400' },
    { id: 1, name: 'Rock', color: 'genre-red', image: 'https://images.unsplash.com/photo-1555165498-52fb517c055b?q=80&w=400' },
    { id: 2, name: 'Folk', color: 'genre-green', image: 'https://images.unsplash.com/photo-1445620466293-d6316392bb92?q=80&w=400' },
    { id: 3, name: 'Country', color: 'genre-orange', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400' },
    { id: 4, name: 'Jewish', color: 'genre-blue', image: 'https://images.unsplash.com/photo-1531058240690-006c446962d8?q=80&w=400' }
];

const SearchPage = () => {
    const { user } = useAuthContext();
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [addedSongs, setAddedSongs] = useState<Set<number>>(new Set());
    const [selectedPlaylists, setSelectedPlaylists] = useState<Set<number>>(new Set());

    // חיפוש טקסט חופשי - מתעלם מהז'אנר הנבחר
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setSelectedGenre(null); 

        if (val.trim().length > 1) {
            try {
                const data = await searchAll(val);
                setResults(data);
            } catch (err) {
                console.error("Error searching:", err);
            }
        } else {
            setResults(null);
        }
    };

    // חיפוש לפי ז'אנר - מנקה את שורת החיפוש
    const handleGenreClick = async (genreId: number, genreName: string) => {
        try {
            setSelectedGenre(genreName);
            setQuery('');
            const data = await getSongsByGenre(genreId);
            setResults({ songs: data, artists: [] }); 
        } catch (err) {
            console.error("Error fetching genre:", err);
        }
    };

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (user?.userId) {
                try {
                    const playlists = await getPlaylistsByUserId(Number(user.userId));
                    setUserPlaylists(playlists);
                } catch (error) {
                    console.error("שגיאה בטעינת פלייליסטים:", error);
                }
            }
        };
        fetchUserPlaylists();
    }, [user]);

    const resetView = () => {
        setQuery('');
        setResults(null);
        setSelectedGenre(null);
    };

    const handleAddSongToPlaylist = (song: any) => {
        setSelectedSong(song);
        setSelectedPlaylists(new Set()); // איפוס בחירות קודמות
        setShowPlaylistModal(true);
    };

    // טיפול בבחירת/ביטול בחירת פלייליסט
    const handlePlaylistToggle = (playlistId: number) => {
        setSelectedPlaylists(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playlistId)) {
                newSet.delete(playlistId);
            } else {
                newSet.add(playlistId);
            }
            return newSet;
        });
    };

    // הוספת שיר לכל הפלייליסטים שנבחרו
    const handleAddToSelectedPlaylists = async () => {
        if (!selectedSong || selectedPlaylists.size === 0) return;
        
        try {
            const promises = Array.from(selectedPlaylists).map(playlistId => 
                addSongToPlaylist(playlistId, selectedSong.id)
            );
            
            await Promise.all(promises);
            
            setAddedSongs(prev => new Set(prev).add(selectedSong.id));
            setShowPlaylistModal(false);
            setSelectedSong(null);
            setSelectedPlaylists(new Set());
            
            const playlistCount = selectedPlaylists.size;
            alert(`השיר "${selectedSong.songName}" נוסף בהצלחה ל-${playlistCount} פלייליסטים!`);
        } catch (error) {
            console.error("שגיאה בהוספת שיר לפלייליסטים:", error);
            alert("הוספת השיר לפלייליסטים נכשלה");
        }
    };

    return (
        <div className="search-page-container">
            <header className="search-header">
                <h1>חיפוש</h1>
                <div className="search-bar-wrapper">
                    <SearchIcon className="search-icon-inside" size={20} />
                    <input 
                        type="text" 
                        value={query}
                        onChange={handleSearch}
                        placeholder="מה תרצה לשמוע היום?"
                        className="search-input-field"
                    />
                    {(query || selectedGenre) && (
                        <button className="clear-search" onClick={resetView}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                {selectedGenre && (
    <div className="genre-breadcrumb">
        {/* לחיצה כאן תנקה את התוצאות ותחזיר אותנו למסך הג'אנרים הראשי */}
        <span 
            className="breadcrumb-link" 
            onClick={() => { setResults(null); setSelectedGenre(null); }}
        >
            ז'אנרים
        </span> 
        <ChevronRight size={14} /> 
        <strong>{selectedGenre}</strong>
    </div>
)}
            </header>

            <main className="search-content">
                {results ? (
                    <div className="results-wrapper">
                        {/* הצגת שירים */}
                        {results.songs?.length > 0 && (
                            <section className="results-section">
                                <div className="section-title"><Music size={18}/> <h2>שירים</h2></div>
                                <div className="songs-list">
                                    {results.songs.map((song: any) => (
                                        <div key={song.id} className="song-result-item">
                                            <img 
                                                src={song.arrImage ? `data:image/jpeg;base64,${song.arrImage}` : '/default-cover.png'} 
                                                alt={song.songName} 
                                            />
                                            <div className="song-info">
                                                <div className="title">{song.songName}</div>
                                                <div className="artist">{song.artistName}</div>
                                            </div>
                                            <button 
                                                className={`add-to-playlist-btn ${addedSongs.has(song.id) ? 'added' : ''}`}
                                                onClick={() => handleAddSongToPlaylist(song)}
                                                disabled={addedSongs.has(song.id)}
                                            >
                                                {addedSongs.has(song.id) ? <Check size={16} /> : <Plus size={16} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* הצגת אמנים - רק בחיפוש חופשי, לא בסינון ז'אנר */}
                        {!selectedGenre && results.artists?.length > 0 && (
                            <section className="results-section">
                                <div className="section-title"><Users size={18}/> <h2>אמנים</h2></div>
                                <div className="artists-grid-results">
                                    {results.artists.map((artist: any) => (
                                        <div key={artist.id} className="artist-result-card">
                                            <img src={`data:image/jpeg;base64,${artist.arrImage}`} alt={artist.artistName} />
                                            <p>{artist.artistName}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.songs?.length === 0 && (!results.artists || results.artists.length === 0) && (
                            <div className="no-results">לא נמצאו תוצאות עבור החיפוש שלך.</div>
                        )}
                    </div>
                ) : (
                    /* מצב דפדוף ראשוני */
                    <div className="browse-all-section">
                        <h2>דפדוף בכל הג'אנרים</h2>
                        <div className="genres-grid">
                            {genres.map((genre) => (
                                <div 
                                    key={genre.id} 
                                    className={`genre-card ${genre.color}`}
                                    onClick={() => handleGenreClick(genre.id, genre.name)}
                                >
                                    <div className="playlist-checkbox">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedPlaylists.has(playlist.id)}
                                            onChange={() => handlePlaylistToggle(playlist.id)}
                                        />
                                    </div>
                                    <img 
                                        src={playlist.arrCover ? `data:image/jpeg;base64,${playlist.arrCover}` : 'https://via.placeholder.com/50'} 
                                        alt={playlist.playlistName} 
                                    />
                                    <div className="playlist-info">
                                        <h4>{playlist.playlistName}</h4>
                                        <p>{playlist.songsCount || 0} שירים</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {userPlaylists.length === 0 && (
                            <p className="no-playlists">אין לך פלייליסטים. צור פלייליסט חדש קודם.</p>
                        )}
                        {userPlaylists.length > 0 && (
                            <div className="modal-actions">
                                <button 
                                    className="add-to-selected-btn"
                                    onClick={handleAddToSelectedPlaylists}
                                    disabled={selectedPlaylists.size === 0}
                                >
                                    הוסף ל-{selectedPlaylists.size} פלייליסטים
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default SearchPage;