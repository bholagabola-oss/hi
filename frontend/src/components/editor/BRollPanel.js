import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './BRollPanel.css';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function BRollPanel() {
  const { job, currentVideo, api, loading } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [overlaying, setOverlaying] = useState(null);
  const [insertTime, setInsertTime] = useState(5);

  const search = async () => {
    if (!query.trim()) return toast.error('Enter a search term');
    setSearching(true);
    try {
      const { data } = await api.get(`/broll/search?query=${encodeURIComponent(query)}&perPage=9`);
      setResults(data.videos || []);
      if (!data.videos?.length) toast.info('No videos found. Try different keywords.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Search failed. Check Pexels API key.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const overlayBRoll = async (video) => {
    if (!job?.jobId || !currentVideo) return toast.error('No video loaded');
    const videoFile = video.videoFiles?.[0];
    if (!videoFile?.link) return toast.error('No video file available');

    setOverlaying(video.id);
    try {
      const { data } = await api.post('/broll/overlay', {
        jobId: job.jobId,
        inputFile: currentVideo,
        brollUrl: videoFile.link,
        startTime: insertTime,
        duration: Math.min(video.duration, 10)
      });
      toast.success('B-Roll added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'B-Roll overlay failed');
    } finally {
      setOverlaying(null);
    }
  };

  return (
    <div className="broll-panel">
      <p className="panel-desc">
        Search millions of free stock videos and insert them as B-roll into your video.
      </p>

      <div className="broll-search">
        <input
          type="text"
          placeholder="Search B-roll (e.g. coffee, city, nature)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button className="btn btn-primary btn-sm" onClick={search} disabled={searching}>
          {searching ? <span className="spinner" /> : '🔍'}
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="broll-insert-time">
            <label>Insert at (seconds)</label>
            <input
              type="number"
              min="0"
              value={insertTime}
              onChange={e => setInsertTime(parseFloat(e.target.value))}
              style={{ width: 80 }}
            />
          </div>

          <div className="broll-grid">
            {results.map(video => (
              <div key={video.id} className="broll-item">
                <div className="broll-thumb">
                  <img src={video.image} alt="B-roll" />
                  <div className="broll-duration">{video.duration}s</div>
                </div>
                <button
                  className="broll-add-btn"
                  onClick={() => overlayBRoll(video)}
                  disabled={overlaying === video.id}
                >
                  {overlaying === video.id ? <span className="spinner" /> : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {results.length === 0 && !searching && (
        <div className="broll-empty">
          <div style={{ fontSize: 32 }}>🎬</div>
          <p>Search for B-roll footage above</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Pexels — 100% free</p>
        </div>
      )}
    </div>
  );
}
