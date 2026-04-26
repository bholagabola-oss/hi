import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './VideoPlayer.css';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function VideoPlayer() {
  const { currentVideo, captions } = useApp();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(null);

  const videoUrl = currentVideo
    ? (currentVideo.startsWith('http') ? currentVideo : `${API_BASE}${currentVideo}`)
    : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Find current caption
      const cap = captions.find(c => video.currentTime >= c.start && video.currentTime <= c.end);
      setCurrentCaption(cap || null);
    };
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [captions]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    playing ? video.pause() : video.play();
  };

  const seek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * duration;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="video-player">
      <div className="video-wrapper">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="video-element"
              onClick={togglePlay}
              playsInline
            />
            {currentCaption && (
              <div className="caption-overlay">
                <span className="caption-text">{currentCaption.text}</span>
              </div>
            )}
            {!playing && (
              <button className="play-overlay" onClick={togglePlay}>▶</button>
            )}
          </>
        ) : (
          <div className="video-placeholder">No video loaded</div>
        )}
      </div>

      {/* Controls */}
      <div className="video-controls">
        {/* Progress bar */}
        <div className="progress-track" onClick={seek}>
          <div
            className="progress-fill"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
          {/* Caption markers */}
          {captions.map((c, i) => (
            <div
              key={i}
              className="caption-marker"
              style={{
                left: duration ? `${(c.start / duration) * 100}%` : '0%',
                width: duration ? `${((c.end - c.start) / duration) * 100}%` : '0%'
              }}
            />
          ))}
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="ctrl-btn" onClick={togglePlay}>
              {playing ? '⏸' : '▶'}
            </button>
            <button className="ctrl-btn" onClick={toggleMute}>
              {muted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="volume-slider"
            />
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="controls-right">
            <button className="ctrl-btn" onClick={() => {
              if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
            }}>⛶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
