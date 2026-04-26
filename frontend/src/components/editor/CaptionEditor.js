import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './CaptionEditor.css';

const STYLES = [
  { id: 'viral', label: 'Viral', preview: '#FFFF00', bg: 'none' },
  { id: 'tiktok', label: 'TikTok', preview: '#FFFFFF', bg: '#FF0050' },
  { id: 'bold', label: 'Bold', preview: '#FFFFFF', bg: 'none' },
  { id: 'minimal', label: 'Minimal', preview: '#FFFFFF', bg: 'rgba(0,0,0,0.6)' },
  { id: 'fire', label: '🔥 Fire', preview: '#FF6B00', bg: 'none' },
  { id: 'neon', label: '🟢 Neon', preview: '#00FF87', bg: 'none' },
  { id: 'classic', label: 'Classic', preview: '#FFFFFF', bg: 'rgba(0,0,0,0.4)' },
];

const WORDS_OPTIONS = [3, 4, 5, 6, 8];

export default function CaptionEditor() {
  const { captions, setCaptions, captionStyle, setCaptionStyle, job, currentVideo, burnCaptions, loading } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [wordsPerLine, setWordsPerLine] = useState(5);
  const [position, setPosition] = useState('bottom');

  const startEdit = (cap) => {
    setEditingId(cap.id);
    setEditText(cap.text);
  };

  const saveEdit = (id) => {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, text: editText } : c));
    setEditingId(null);
  };

  const deleteCaption = (id) => {
    setCaptions(prev => prev.filter(c => c.id !== id));
  };

  const handleBurnCaptions = async () => {
    if (!currentVideo) return toast.error('No video loaded');
    if (!captions.length) return toast.error('No captions to burn');
    try {
      await burnCaptions(currentVideo, captionStyle);
    } catch (e) {}
  };

  const downloadSRT = () => {
    const srt = captions.map((c, i) => {
      const fmt = (s) => {
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60), ms = Math.round((s % 1) * 1000);
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
      };
      return `${i+1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`;
    }).join('\n');
    const blob = new Blob([srt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'captions.srt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="caption-editor">
      {/* Style selector */}
      <div className="panel-section">
        <div className="panel-section-title">Caption Style</div>
        <div className="style-grid">
          {STYLES.map(s => (
            <button
              key={s.id}
              className={`style-btn ${captionStyle === s.id ? 'active' : ''}`}
              onClick={() => setCaptionStyle(s.id)}
            >
              <div
                className="style-preview"
                style={{ background: s.bg !== 'none' ? s.bg : 'rgba(0,0,0,0.5)' }}
              >
                <span style={{ color: s.preview, fontWeight: 800, fontSize: 12, fontFamily: 'sans-serif' }}>
                  Caption
                </span>
              </div>
              <span className="style-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Position */}
      <div className="panel-section">
        <div className="panel-section-title">Position</div>
        <div className="position-btns">
          {['top', 'center', 'bottom'].map(p => (
            <button
              key={p}
              className={`pos-btn ${position === p ? 'active' : ''}`}
              onClick={() => setPosition(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="panel-section caption-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleBurnCaptions}
          disabled={loading || !captions.length}
        >
          {loading ? <><span className="spinner" /> Burning...</> : '🔥 Burn Captions'}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={downloadSRT}
          disabled={!captions.length}
        >
          ⬇ SRT
        </button>
      </div>

      {/* Caption list */}
      <div className="panel-section">
        <div className="panel-section-title">
          Captions ({captions.length})
          {captions.length === 0 && <span className="caption-hint"> — transcription required</span>}
        </div>
        <div className="caption-list">
          {captions.length === 0 ? (
            <div className="caption-empty">
              <p>No captions yet. Upload a video and they'll appear here after transcription.</p>
            </div>
          ) : (
            captions.map((cap) => (
              <div key={cap.id} className="caption-item">
                <div className="caption-time">
                  {fmtTime(cap.start)} — {fmtTime(cap.end)}
                </div>
                {editingId === cap.id ? (
                  <div className="caption-edit">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={2}
                      autoFocus
                    />
                    <div className="caption-edit-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => saveEdit(cap.id)}>Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="caption-text-row">
                    <span className="caption-text-display">{cap.text}</span>
                    <div className="caption-item-actions">
                      <button className="icon-btn" onClick={() => startEdit(cap)} title="Edit">✏️</button>
                      <button className="icon-btn" onClick={() => deleteCaption(cap.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function fmtTime(s) {
  if (!s && s !== 0) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,'0')}`;
}
