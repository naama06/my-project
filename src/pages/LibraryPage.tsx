import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { getPlaylistsByUserId } from '../services/playlist.service';
import type { Playlist } from '../types/playlist.types';
import '../style/LibraryPage.css';

const LibraryPage = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = auth?.user;
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                
                if (user) {
                    const myId = Number(user.userId || (user as any).id);
                    const data = await getPlaylistsByUserId(myId);
                    setPlaylists(data);
                }
            } catch (err) {
                console.error("שגיאה בטעינת פלייליסטים:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [user]);

    if (loading) return <div className="loading-state">טוען ספריה...</div>;
    if (error) return <div className="error-state">שגיאה בטעינת הנתונים מהשרת.</div>;

    return (
        <div className="library-page">
            <header className="library-header">
                <h1>הספרייה שלי</h1>
                {/* הכפתור עבר לכאן כדי שתמיד יהיה זמין */}
                <button 
                    className="create-playlist-btn" 
                    onClick={() => navigate('/create-playlist')}
                >
                    + צור פלייליסט חדש
                </button>
            </header>

            <div className="library-content">
                {playlists.length > 0 ? (
                    <div className="playlists-grid">
                        {playlists.map((playlist) => (
                            <div 
                                key={playlist.id} 
                                className="playlist-card" 
                                onClick={() => navigate(`/playlist/${playlist.id}`)}
                            >
                                <div className="card-image">
                                    {playlist.arrCover ? (
                                        <img src={`data:image/jpeg;base64,${playlist.arrCover}`} alt={playlist.playlistName} />
                                    ) : (
                                        <div className="placeholder-icon">🎵</div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <h3>{playlist.playlistName}</h3>
                                    <p>{playlist.songsCount || 0} שירים</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-library-message">
                        <p>עדיין אין לך פלייליסטים משלך.</p>
                        <p className="hint">לחצי על הכפתור למעלה כדי להתחיל!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;