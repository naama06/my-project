import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // הוספת ייבוא לניווט
import { useAuthContext } from "../auth/useAuthContext";
import { removeSession } from "../auth/auth.utils";
import { getRecommendedSongs, getFavoriteArtists } from "../services/song.service";
import type { Song } from "../types/song.types";

const HomePage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate(); // אתחול הניווט
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [favoriteArtists, setFavoriteArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getImageSrc = (arrImage: string | null) => {
        if (!arrImage) return 'https://via.placeholder.com/150?text=No+Image';
        return `data:image/jpeg;base64,${arrImage}`;
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            if (user?.userId) {
                try {
                    setLoading(true);
                    const userIdNum = Number(user.userId);
                    
                    const [songs, artists] = await Promise.all([
                        getRecommendedSongs(userIdNum),
                        getFavoriteArtists(userIdNum)
                    ]);

                    setRecommendedSongs(songs);
                    setFavoriteArtists(artists);
                } catch (error) {
                    console.error("שגיאה בטעינת נתוני דף הבית", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHomeData();
    }, [user?.userId]);

    // פונקציה שעוברת לעמוד השיר
    const handleSongClick = (id: number) => {
        navigate(`/now-playing/${id}`); // מנווט לנתיב של השיר
    };

    return (
        <div style={{ padding: '20px', direction: 'rtl', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>שלום {user?.userName}!</h1>
                <button 
                    onClick={removeSession}
                    style={{ backgroundColor: '#1db954', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
                >
                    התנתק
                </button>
            </header>

            <hr style={{ borderColor: '#333', margin: '20px 0' }} />

            {loading ? (
                <p>טוען המלצות עבורך...</p>
            ) : (
                <>
                    <section>
                        <h2>שירים שמומלץ לך לשמוע</h2>
                        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                            {recommendedSongs.map(song => (
                                <div 
                                    key={song.id} 
                                    style={cardStyle} 
                                    onClick={() => handleSongClick(song.id)} // לחיצה מפעילה ניווט
                                >
                                    <img 
                                        src={getImageSrc(song.arrImage)} 
                                        alt={song.songName}
                                        style={songImageStyle}
                                    />
                                    <p style={{ margin: '10px 0 5px' }}><strong>{song.songName}</strong></p>
                                    <small style={{ color: '#b3b3b3' }}>{song.artistName} • {song.genere}</small>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section style={{ marginTop: '40px' }}>
                        <h2>אמנים שאת עשויה לאהוב</h2>
                        <div style={{ display: 'flex', gap: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
                            {favoriteArtists.map(artist => (
                                <div key={artist.id} style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <img 
                                        src={getImageSrc(artist.arrImage)} 
                                        alt={artist.artistName}
                                        style={artistImageStyle}
                                    />
                                    <p style={{ marginTop: '10px' }}>{artist.artistName}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

// אובייקטי עיצוב (הוספתי cursor: pointer לכרטיס)
const cardStyle: React.CSSProperties = {
    backgroundColor: '#181818',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '160px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer', 
    transition: 'transform 0.2s'
};

const songImageStyle: React.CSSProperties = {
    width: '130px',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '4px'
};

const artistImageStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #333'
};

export default HomePage;