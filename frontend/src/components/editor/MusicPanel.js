import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './MusicPanel.css';

export default function MusicPanel() {
  const { job, currentVideo, addMusic, api, loading } = useApp();
  const [tracks, setTracks] = useState([]);
  const [selectedMood, setSelectedMood] = useState('all');
  const [playingId, setPlayingId] = useState(null);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  const MOODS = ['all', 'energetic', 'chill', 'motivational', 'happy', 'dramatic', 'corporate'];

  useEffect(() => {
    fetchTracks();
  }, [selectedMood]);

  const fetchTracks = async () => {
    try {
      const { data } = await api.get(`/music/tracks?mood=${selectedMood}`);
      setTracks(data.tracks || []);
    } catch {
      // Use fallback tracks
      setTracks(getFallbackTracks(selectedMood));
    }
  };

  const togglePlay = (track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      }
      setPlayingId(track.id);
    }
  };

  const handleAddMusic = async (track) => {
    if (!job?.jobId || !currentVideo) return toast.error('No video loaded');
    try {
      await addMusic(track.url, volume);
    } catch (e) {}
  };

  return (
    <div className="music-panel">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <p className="panel-desc">Add royalty-free background music to your video.</p>

      <div className="volume-row">
        <span className="vol-label">🎚️ Music Volume</span>
        <input
          type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="vol-slider"
        />
        <span className="vol-val">{Math.round(volume * 100)}%</span>
      </div>

      <div className="mood-tabs">
        {MOODS.map(m => (
          <button
            key={m}
            className={`mood-tab ${selectedMood === m ? 'active' : ''}`}
            onClick={() => setSelectedMood(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="tracks-list">
        {tracks.map(track => (
          <div key={track.id} className="track-item">
            <button
              className={`track-play ${playingId === track.id ? 'playing' : ''}`}
              onClick={() => togglePlay(track)}
            >
              {playingId === track.id ? '⏸' : '▶'}
            </button>
            <div className="track-info">
              <div className="track-name">{track.title}</div>
              <div className="track-meta">{track.artist} • {fmtDur(track.duration)} • {track.mood}</div>
              {track.waveform && (
                <div className="track-waveform">{track.waveform}</div>
              )}
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleAddMusic(track)}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : '+ Add'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmtDur(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function getFallbackTracks(mood) {
  const all = [
    { id: 1, title: 'Energy Boost', artist: 'HuliMagic Beats', mood: 'energetic', duration: 120, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', waveform: '▁▂▄▇█▇▄▂▁' },
    { id: 2, title: 'Chill Vibes', artist: 'HuliMagic Beats', mood: 'chill', duration: 180, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', waveform: '▁▁▂▃▄▃▂▁▁' },
    { id: 3, title: 'Motivational Rise', artist: 'HuliMagic Beats', mood: 'motivational', duration: 150, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', waveform: '▂▃▅▇█▇▅▃▂' },
    { id: 4, title: 'Happy Days', artist: 'HuliMagic Beats', mood: 'happy', duration: 130, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', waveform: '▃▄▆█▆▄▃▂▁' },
    { id: 5, title: 'Dark Cinematic', artist: 'HuliMagic Beats', mood: 'dramatic', duration: 200, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', waveform: '▁▁▂▄▇█▇▄▂' },
  ];
  return mood === 'all' ? all : all.filter(t => t.mood === mood);
}
