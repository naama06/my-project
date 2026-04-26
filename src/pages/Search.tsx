import React, { useState } from 'react';
import { searchAll } from '../services/search.service';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (val.trim().length > 1) {
            try {
                const data = await searchAll(val);
                // בדיקה 1: פתחי את ה-Console (F12) ותראי אם כתוב כאן שהנתונים הגיעו
                console.log("נתונים מהשרת:", data); 
                setResults(data);
            } catch (err) {
                console.error("שגיאה בחיפוש:", err);
            }
        } else {
            setResults(null);
        }
    };

    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#121212', minHeight: '100vh', direction: 'rtl' }}>
            <h1>חיפוש</h1>
            
            <input 
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="חפש שיר או אמן..."
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#282828', color: 'white', marginBottom: '20px' }}
            />

            {results && (
                <div>
                    {/* שינוי 2: שימי לב לאותיות הקטנות results.songs */}
                    {results.songs?.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>שירים</h3>
                            {results.songs.map((song: any) => (
                                <div key={song.id} style={{ display: 'flex', alignItems: 'center', background: '#181818', padding: '10px', marginBottom: '5px' }}>
                                    <img src={`data:image/jpeg;base64,${song.arrImage}`} style={{ width: '50px', height: '50px', marginLeft: '15px' }} alt="" />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                                        <div style={{ fontSize: '0.8em', color: '#b3b3b3' }}>{song.artistName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* שינוי 3: שימי לב לאותיות הקטנות results.artists */}
                    {results.artists?.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>אמנים</h3>
                            {results.artists.map((artist: any) => (
                                <div key={artist.id} style={{ display: 'flex', alignItems: 'center', background: '#181818', padding: '10px', marginBottom: '5px' }}>
                                    <img src={`data:image/jpeg;base64,${artist.arrImage}`} style={{ width: '50px', height: '50px', marginLeft: '15px', borderRadius: '50%' }} alt="" />
                                    <span>{artist.artistName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;