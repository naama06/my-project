import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSongById } from "../services/song.service";
import { ChevronRight, Music } from "lucide-react"; // השתמשתי ב-ChevronRight כי האתר מימין לשמאל
import '../style/NowPlayingPage.css';

const NowPlaying = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [song, setSong] = useState<any>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // לוגיקה לטעינת השיר (נשארה זהה לזו שיצרת)
    useEffect(() => {
        const fetchSongData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getSongById(Number(id));
                if (data && data.arrSong) {
                    const binaryString = window.atob(data.arrSong);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: 'audio/mpeg' });
                    const url = URL.createObjectURL(blob);
                    setAudioUrl(url);
                    setSong(data);
                }
            } catch (error) {
                console.error("Error loading song:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongData();
    }, [id]);

    const getImageSrc = (base64: string | null) => base64 ? `data:image/jpeg;base64,${base64}` : 'https://via.placeholder.com/300';

    if (loading) return <div className="now-playing-page justify-center items-center">טוען...</div>;

    return (
        <div className="now-playing-page">
            {/* צד ימין - אמן וכפתור חזרה */}
            <aside className="artist-sidebar">
                <button onClick={() => navigate(-1)} className="back-btn-turquoise">
                    חזרה <ChevronRight size={18} />
                </button>

                <div className="artist-profile-container">
                    <img 
                        src={getImageSrc(song.arrImage)} 
                        className="artist-circle-img" 
                        alt={song.artistName} 
                    />
                    <h2 className="artist-name-label">{song.artistName}</h2>
                    <p style={{color: '#888', marginTop: '5px'}}>{song.genere}</p>
                </div>
            </aside>

            {/* צד שמאל - הנגן והתקליט */}
            <main className="player-main-area">
                <header style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h1 style={{fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem'}}>{song.songName}</h1>
                </header>

                {/* התקליט המסתובב */}
                <div className="vinyl-record">
                    <img src={getImageSrc(song.arrImage)} className="vinyl-center-art" alt="Cover" />
                    <div className="vinyl-hole"></div>
                </div>

                {/* רצועת השמע */}
                <div className="audio-controls-wrapper">
                    <audio 
                        ref={audioRef}
                        src={audioUrl || ""} 
                        controls 
                        autoPlay 
                    />
                </div>
            </main>
        </div>
    );
};

export default NowPlaying;