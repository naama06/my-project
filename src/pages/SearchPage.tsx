import React, { useState, useEffect } from 'react';
import { searchAll } from '../services/search.service';
import { Search as SearchIcon, X, Music, Users } from 'lucide-react';
import '../style/SearchPage.css';

const genres = [
    { name: 'Pop', color: 'genre-pink', image: 'https://images.unsplash.com/photo-1725101593263-293522ee89c3?q=80&w=400' },
    { name: 'Rock', color: 'genre-red', image: 'https://images.unsplash.com/photo-1555165498-52fb517c055b?q=80&w=400' },
    { name: 'Hip Hop', color: 'genre-orange', image: 'https://images.unsplash.com/photo-1770320606224-f2e907b65468?q=80&w=400' },
    { name: 'Electronic', color: 'genre-blue', image: 'https://images.unsplash.com/photo-1739315012244-cfb2d4050de7?q=80&w=400' }
];

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'songs' | 'artists'>('all');

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (val.trim().length > 1) {
            try {
                const data = await searchAll(val);
                setResults(data);
            } catch (err) {
                console.error("שגיאה בחיפוש:", err);
            }
        } else {
            setResults(null);
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
                    {query && (
                        <button className="clear-search" onClick={() => {setQuery(''); setResults(null);}}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                {query && (
                    <div className="filter-tabs">
                        <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>הכל</button>
                        <button className={activeFilter === 'songs' ? 'active' : ''} onClick={() => setActiveFilter('songs')}>שירים</button>
                        <button className={activeFilter === 'artists' ? 'active' : ''} onClick={() => setActiveFilter('artists')}>אמנים</button>
                    </div>
                )}
            </header>

            <main className="search-content">
                {results ? (
                    <div className="results-wrapper">
                        {/* Songs Results */}
                        {(activeFilter === 'all' || activeFilter === 'songs') && results.songs?.length > 0 && (
                            <section className="results-section">
                                <div className="section-title"><Music size={18}/> <h2>שירים</h2></div>
                                <div className="songs-list">
                                    {results.songs.map((song: any) => (
                                        <div key={song.id} className="song-result-item">
                                            <img src={`data:image/jpeg;base64,${song.arrImage}`} alt={song.title} />
                                            <div className="song-info">
                                                <div className="title">{song.title}</div>
                                                <div className="artist">{song.artistName}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Artists Results */}
                        {(activeFilter === 'all' || activeFilter === 'artists') && results.artists?.length > 0 && (
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
                    </div>
                ) : (
                    /* Default View: Genres & Browse All */
                    <div className="browse-all-section">
                        <h2>דפדוף בכל הג'אנרים</h2>
                        <div className="genres-grid">
                            {genres.map((genre) => (
                                <div key={genre.name} className={`genre-card ${genre.color}`}>
                                    <img src={genre.image} alt={genre.name} />
                                    <h3>{genre.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchPage;