import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './ExportPanel.css';

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', icon: '🎵', resolution: '1080x1920', fps: 30 },
  { id: 'reels', label: 'Reels', icon: '📸', resolution: '1080x1920', fps: 30 },
  { id: 'shorts', label: 'Shorts', icon: '▶️', resolution: '1080x1920', fps: 60 },
  { id: 'landscape', label: 'YouTube', icon: '🖥️', resolution: '1920x1080', fps: 30 },
  { id: 'square', label: 'Square', icon: '⬛', resolution: '1080x1080', fps: 30 },
];

const QUALITIES = [
  { id: 'high', label: 'High (Best)', desc: '4K quality, larger file' },
  { id: 'medium', label: 'Medium', desc: '1080p, balanced' },
  { id: 'low', label: 'Low (Fast)', desc: '720p, smallest file' },
];

export default function ExportPanel() {
  const { job, currentVideo, captions, captionStyle, exportVideo, api, loading } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [selectedQuality, setSelectedQuality] = useState('medium');
  const [burnCaptionsOnExport, setBurnCaptionsOnExport] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [multiExport, setMultiExport] = useState(false);

  const platform = PLATFORMS.find(p => p.id === selectedPlatform);

  const handleExport = async () => {
    if (!job?.jobId || !currentVideo) return toast.error('No video loaded');
    setExporting(true);
    try {
      await exportVideo({
        platform: selectedPlatform,
        resolution: platform.resolution,
        fps: platform.fps,
        quality: selectedQuality,
        captionStyle: burnCaptionsOnExport ? captionStyle : null,
        captions: burnCaptionsOnExport ? captions : [],
        addWatermark,
        watermarkText: 'HuliMagic'
      });
    } catch (e) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleMultiExport = async () => {
    if (!job?.jobId || !currentVideo) return toast.error('No video loaded');
    setExporting(true);
    try {
      const { data } = await api.post('/export/multi-platform', {
        jobId: job.jobId,
        inputFile: currentVideo,
        captions: burnCaptionsOnExport ? captions : [],
        captionStyle,
        platforms: ['tiktok', 'reels', 'shorts']
      });
      toast.success(`Exported for ${data.exports.length} platforms!`);
      // Download each
      const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      data.exports.forEach(exp => {
        const a = document.createElement('a');
        a.href = `${apiBase}${exp.outputUrl}`;
        a.download = `${exp.platform}_${job.jobId}.mp4`;
        a.click();
      });
    } catch (e) {
      toast.error('Multi-export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-panel">
      {/* Platform selector */}
      <div className="panel-section">
        <div className="panel-section-title">Platform</div>
        <div className="platform-grid">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`platform-btn ${selectedPlatform === p.id ? 'active' : ''}`}
              onClick={() => setSelectedPlatform(p.id)}
            >
              <span className="platform-icon">{p.icon}</span>
              <span className="platform-label">{p.label}</span>
              <span className="platform-res">{p.resolution}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="panel-section">
        <div className="panel-section-title">Quality</div>
        <div className="quality-list">
          {QUALITIES.map(q => (
            <button
              key={q.id}
              className={`quality-btn ${selectedQuality === q.id ? 'active' : ''}`}
              onClick={() => setSelectedQuality(q.id)}
            >
              <div className="quality-radio">
                {selectedQuality === q.id && <div className="quality-radio-fill" />}
              </div>
              <div>
                <div className="quality-label">{q.label}</div>
                <div className="quality-desc">{q.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="panel-section">
        <div className="panel-section-title">Options</div>
        <div className="export-options">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={burnCaptionsOnExport}
              onChange={e => setBurnCaptionsOnExport(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-knob2" />
            </span>
            <span>Burn captions into video</span>
          </label>
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={addWatermark}
              onChange={e => setAddWatermark(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-knob2" />
            </span>
            <span>Add HuliMagic watermark</span>
          </label>
        </div>
      </div>

      {/* Export summary */}
      <div className="export-summary">
        <div className="summary-row"><span>Platform</span><span>{platform?.label}</span></div>
        <div className="summary-row"><span>Resolution</span><span>{platform?.resolution}</span></div>
        <div className="summary-row"><span>FPS</span><span>{platform?.fps}</span></div>
        <div className="summary-row"><span>Quality</span><span>{selectedQuality}</span></div>
        <div className="summary-row"><span>Captions</span><span>{burnCaptionsOnExport ? `${captions.length} captions` : 'None'}</span></div>
      </div>

      {/* Export buttons */}
      <button
        className="btn btn-primary"
        onClick={handleExport}
        disabled={exporting || loading}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
      >
        {exporting ? <><span className="spinner" /> Exporting...</> : `📤 Export for ${platform?.label}`}
      </button>

      <button
        className="btn btn-secondary"
        onClick={handleMultiExport}
        disabled={exporting || loading}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        ⚡ Export for TikTok + Reels + Shorts
      </button>

      <p className="export-note">
        Files download automatically when ready. Large videos may take a few minutes.
      </p>
    </div>
  );
}
