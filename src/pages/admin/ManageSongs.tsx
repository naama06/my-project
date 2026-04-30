import React, { useState } from 'react';
import '../../style/ManageSongs.css'; 

const AdminMusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(80);

    return (
        <div className="now-playing-page-layout" dir="rtl">
            {/* רקע זוהר סטייל פיגמה */}
            <div className="figma-bg-glow" />

            {/* כפתור סגירה/חזרה */}
            <button className="figma-close-btn">
                <span className="material-icons">expand_more</span>
            </button>

            {/* פאנל פרטי השיר - צד ימין (בגלל ה-RTL) */}
            <aside className="song-details-sidebar">
                <div className="artist-hero-img">
                    <img src="https://via.placeholder.com/400" alt="Artist" />
                </div>

                <div className="title-and-actions">
                    <h1>שם השיר שלך</h1>
                    <h3>שם האמן</h3>
                </div>

                <div className="meta-icons">
                    <span className="material-icons">add_circle_outline</span>
                    <span className="material-icons">share</span>
                    <span className="material-icons">more_horiz</span>
                </div>

                <div className="player-tabs">
                    <span className="active-tab">מילים</span>
                    <span>הבא בתור</span>
                </div>

                <div className="lyrics-scroller">
                    <p className="lyrics-line">זה המשפט הראשון של השיר</p>
                    <p className="lyrics-line active-line">וזה המשפט שמתנגן עכשיו בול</p>
                    <p className="lyrics-line">כאן מגיעה השורה הבאה...</p>
                    <p className="lyrics-line">וככה זה ממשיך עד הסוף</p>
                </div>

                {/* פוטר שליטה בשיר */}
                <div className="playback-footer">
                    <input 
                        type="range" 
                        className="progress-slider-fix" 
                        min="0" 
                        max="100" 
                        defaultValue="30"
                    />
                    <div className="time-labels">
                        <span>1:15</span>
                        <span>3:45</span>
                    </div>

                    <div className="controls-group">
                        <div className="sub-btns">
                            <span className="material-icons">shuffle</span>
                        </div>

                        <div className="main-btns">
                            <span className="material-icons">skip_next</span>
                            <button className="play-circle" onClick={() => setIsPlaying(!isPlaying)}>
                                <span className="material-icons">
                                    {isPlaying ? 'pause' : 'play_arrow'}
                                </span>
                            </button>
                            <span className="material-icons">skip_previous</span>
                        </div>

                        <div className="vol-btns">
                            <span className="material-icons">volume_up</span>
                            <input 
                                type="range" 
                                className="vol-slider" 
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* אזור התקליט המרכזי */}
            <main className="now-playing-main-content">
                <div className="vinyl-display-area">
                    <div className={`vinyl-record ${isPlaying ? '' : 'paused-animation'}`}>
                        {/* חריצים על התקליט */}
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className="record-groove" 
                                style={{ inset: `${i * 20}px` }} 
                            />
                        ))}
                        <img 
                            src="https://via.placeholder.com/180" 
                            alt="Album Art" 
                            className="record-center-art" 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminMusicPlayer;