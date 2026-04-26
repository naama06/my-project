import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSongById } from "../services/song.service";

const NowPlaying = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [song, setSong] = useState<any>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchSongData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const data = await getSongById(Number(id));
                
                if (data && data.arrSong) {
                    // המרת ה-Base64 ל-Blob URL עבור הנגן
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
                console.error("שגיאה בטעינת השיר:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongData();

        // Cleanup: מחיקת ה-URL מהזיכרון כשהקומפוננטה נסגרת
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [id]);

    const getImageSrc = (base64: string | null) => {
        return base64 ? `data:image/jpeg;base64,${base64}` : 'https://via.placeholder.com/300';
    };

    if (loading) return <div style={containerStyle}>טוען את השיר...</div>;
    if (!song) return <div style={containerStyle}>השיר לא נמצא.</div>;

    return (
        <div style={containerStyle}>
            <button onClick={() => navigate(-1)} style={backButtonStyle}> חזרה</button>
            
            <div style={playerCardStyle}>
                <img 
                    src={getImageSrc(song.arrImage)} 
                    alt={song.songName} 
                    style={largeImageStyle} 
                />
                
                <h1 style={{ margin: '20px 0 10px' }}>{song.songName}</h1>
                <h3 style={{ color: '#b3b3b3', marginBottom: '30px' }}>{song.artistName}</h3>

                <div style={controlsContainerStyle}>
                    <audio 
                        ref={audioRef}
                        src={audioUrl || ""} 
                        controls 
                        autoPlay 
                        style={{ width: '100%' }}
                    />
                </div>
                
                <div style={detailsStyle}>
                    <p><strong>ז'אנר:</strong> {song.genere}</p>
                    <p><strong>מספר השמעות:</strong> {song.countStream}</p>
                </div>
            </div>
        </div>
    );
};

// עיצובים
const containerStyle: React.CSSProperties = {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#121212',
    color: 'white',
    minHeight: '100vh',
    direction: 'rtl'
};

const playerCardStyle: React.CSSProperties = {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#181818',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const largeImageStyle: React.CSSProperties = {
    width: '300px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
};

const controlsContainerStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#282828',
    borderRadius: '30px'
};

const backButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #555',
    padding: '8px 15px',
    borderRadius: '20px',
    cursor: 'pointer'
};

const detailsStyle: React.CSSProperties = {
    marginTop: '30px',
    textAlign: 'right',
    color: '#b3b3b3',
    fontSize: '0.9em'
};

export default NowPlaying;