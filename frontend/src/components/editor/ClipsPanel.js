import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './ClipsPanel.css';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ClipsPanel() {
  const { job, currentVideo, clips, generateClips, trimVideo, removeSilence, loading, api } = useApp();
  const [trimStart, setTrimStart] = useState('');
  const [trimEnd, setTrimEnd] = useState('');
  const [activeSection, setActiveSection] = useState('autoClips');

  const handleGenerateClips = async () => {
    try {
      await generateClips([], []);
      toast.success('Clips generated!');
    } catch (e) {}
  };

  const handleTrim = async () => {
    const start = parseFloat(trimStart);
    const end = parseFloat(trimEnd);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return toast.error('Invalid trim values');
    }
    try {
      await trimVideo(start, end);
    } catch (e) {}
  };

  const handleRemoveSilence = async () => {
    try {
      await removeSilence();
    } catch (e) {}
  };

  const handleReframe = async (ratio) => {
    if (!job?.jobId || !currentVideo) return;
    try {
      const { data } = await api.post('/clips/reframe', {
        jobId: job.jobId,
        inputFile: currentVideo,
        targetRatio: ratio
      });
      toast.success(`Reframed to ${ratio}`);
    } catch (e) {
      toast.error('Reframe failed');
    }
  };

  return (
    <div className="clips-panel">
      {/* Section toggle */}
      <div className="clips-sections">
        {[
          { id: 'autoClips', label: '✨ Auto Clips' },
          { id: 'trim', label: '✂️ Trim' },
          { id: 'silence', label: '🔇 Silence' },
          { id: 'reframe', label: '📐 Reframe' },
        ].map(s => (
          <button
            key={s.id}
            className={`section-tab ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Auto Clips */}
      {activeSection === 'autoClips' && (
        <div className="panel-section">
          <p className="panel-desc">
            AI analyzes your video and automatically extracts the best moments as viral-ready clips.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleGenerateClips}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
          >
            {loading ? <><span className="spinner" /> Generating...</> : '✨ Generate Clips'}
          </button>

          {clips.length > 0 && (
            <div className="clips-list">
              {clips.map((clip) => (
                <div key={clip.id} className="clip-card">
                  <div className="clip-thumb">
                    {clip.thumbnailUrl ? (
                      <img src={`${API_BASE}${clip.thumbnailUrl}`} alt={clip.title} />
                    ) : (
                      <div className="clip-thumb-placeholder">🎬</div>
                    )}
                    <div className="clip-duration">{fmtDur(clip.duration)}</div>
                    {clip.viralityLabel && (
                      <div className="clip-virality">{clip.viralityLabel}</div>
                    )}
                  </div>
                  <div className="clip-info">
                    <div className="clip-title">{clip.title}</div>
                    {clip.summary && <div className="clip-summary">{clip.summary}</div>}
                    <div className="clip-score-bar">
                      <div className="clip-score-fill" style={{ width: `${clip.viralityScore || 50}%` }} />
                    </div>
                    <div className="clip-actions">
                      <a
                        href={`${API_BASE}${clip.videoUrl}`}
                        download
                        className="btn btn-primary btn-sm"
                      >
                        ⬇ Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trim */}
      {activeSection === 'trim' && (
        <div className="panel-section">
          <p className="panel-desc">Trim your video to a specific time range.</p>
          <div className="trim-inputs">
            <div className="trim-field">
              <label>Start (seconds)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={trimStart}
                onChange={e => setTrimStart(e.target.value)}
              />
            </div>
            <div className="trim-field">
              <label>End (seconds)</label>
              <input
                type="number"
                min="0"
                placeholder="60"
                value={trimEnd}
                onChange={e => setTrimEnd(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleTrim}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><span className="spinner" /> Trimming...</> : '✂️ Trim Video'}
          </button>
        </div>
      )}

      {/* Remove Silence */}
      {activeSection === 'silence' && (
        <div className="panel-section">
          <p className="panel-desc">
            AI detects and removes silent gaps from your video. Great for podcast clips and interviews.
          </p>
          <div className="silence-info">
            <div className="info-row">
              <span>Silence threshold</span>
              <span className="info-val">-30 dB</span>
            </div>
            <div className="info-row">
              <span>Min silence duration</span>
              <span className="info-val">0.5 sec</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleRemoveSilence}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><span className="spinner" /> Removing Silence...</> : '🔇 Remove Silence'}
          </button>
        </div>
      )}

      {/* Reframe */}
      {activeSection === 'reframe' && (
        <div className="panel-section">
          <p className="panel-desc">Convert your video to different aspect ratios for various platforms.</p>
          <div className="reframe-grid">
            {[
              { ratio: '9:16', label: 'Vertical', sub: 'TikTok, Reels, Shorts', icon: '📱' },
              { ratio: '1:1', label: 'Square', sub: 'Instagram, Facebook', icon: '⬛' },
              { ratio: '4:5', label: '4:5', sub: 'Instagram Feed', icon: '🖼️' },
              { ratio: '16:9', label: 'Landscape', sub: 'YouTube, Twitter', icon: '🖥️' },
            ].map(r => (
              <button
                key={r.ratio}
                className="reframe-btn"
                onClick={() => handleReframe(r.ratio)}
                disabled={loading}
              >
                <span className="reframe-icon">{r.icon}</span>
                <span className="reframe-ratio">{r.label}</span>
                <span className="reframe-sub">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function fmtDur(s) {
  if (!s) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,'0')}`;
}
