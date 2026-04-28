import { useEffect, useState } from "react";
import { useAuthContext } from "../../auth/useAuthContext";
import { getAllPlaylists, getPlaylistById, deletePlaylist } from "../../services/playlist.service";
import type { Playlist, PlaylistDetails } from "../../types/playlist.types";
import { Trash2, ChevronDown, ChevronUp, Music, User, Clock } from "lucide-react";
import "../../style/HomePage.css"; 

const ManagePlaylistsPage = () => {
    const { user, isInitialized } = useAuthContext();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [details, setDetails] = useState<PlaylistDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (isInitialized && user?.role === "Admin") {
            loadPlaylists();
        }
    }, [isInitialized, user]);

    const loadPlaylists = async () => {
        try {
            setLoading(true);
            const data = await getAllPlaylists();
            setPlaylists(data || []);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setDetails(null);
            return;
        }

        setExpandedId(id);
        setLoadingDetails(true);
        try {
            const fullData = await getPlaylistById(id);
            setDetails(fullData);
        } catch (error) {
            console.error("שגיאה בטעינת שירים", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const getImageSrc = (img: string | null) => img ? `data:image/jpeg;base64,${img}` : 'https://via.placeholder.com/50';

    if (!isInitialized || loading) return <div className="loading-state">טוען ניהול...</div>;

    return (
        <div id="home-page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header className="home-header">
                <h1 className="greeting-text">ניהול פלייליסטים</h1>
                <p className="subtitle-text">לחצי על פלייליסט כדי לראות את השירים ופרטי היוצר</p>
            </header>

            <div className="admin-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {playlists.map(p => (
                    <div key={p.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                        {/* שורת הפלייליסט הראשית */}
                        <div 
                            onClick={() => toggleExpand(p.id)}
                            style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={getImageSrc(p.arrCover)} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.playlistName}</h3>
                                    <small style={{ color: '#888' }}>{p.songsCount} שירים</small>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {expandedId === p.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); /* מחיקה */ }}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* החלק הנסתר שנפתח (Accordion) */}
                        {expandedId === p.id && (
                            <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
                                {loadingDetails ? (
                                    <p>טוען פרטים...</p>
                                ) : details && (
                                    <>
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
                                                <User size={18} />
                                                <strong>יוצר:</strong> {details.userName}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444' }}>
                                                <Clock size={18} />
                                                <strong>נוצר בתאריך:</strong> {new Date().toLocaleDateString() /* או שדה מה-DB */}
                                            </div>
                                        </div>

                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'right', borderBottom: '2px solid #eee', color: '#888' }}>
                                                    <th style={{ padding: '10px' }}>כותרת</th>
                                                    <th>אמן</th>
                                                    <th>ז'אנר</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.songs?.map(song => (
                                                    <tr key={song.id} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Music size={14} /> {song.songName}
                                                        </td>
                                                        <td>{song.artistName}</td>
                                                        <td>{song.genere}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePlaylistsPage;