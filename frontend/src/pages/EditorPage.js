import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/editor/VideoPlayer';
import CaptionEditor from '../components/editor/CaptionEditor';
import ClipsPanel from '../components/editor/ClipsPanel';
import BRollPanel from '../components/editor/BRollPanel';
import MusicPanel from '../components/editor/MusicPanel';
import ExportPanel from '../components/editor/ExportPanel';
import TranslatePanel from '../components/editor/TranslatePanel';
import './EditorPage.css';

const TABS = [
  { id: 'captions', label: 'Captions', icon: '💬' },
  { id: 'clips', label: 'Clips', icon: '✂️' },
  { id: 'broll', label: 'B-Roll', icon: '🎬' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'translate', label: 'Translate', icon: '🌍' },
  { id: 'export', label: 'Export', icon: '📤' },
];

export default function EditorPage() {
  const {
    job, uploadVideo, startTranscription, pollTranscription,
    captions, currentVideo, loading, progress
  } = useApp();

  const [activeTab, setActiveTab] = useState('captions');
  const [transcribing, setTranscribing] = useState(false);
  const [transcribingStatus, setTranscribingStatus] = useState('');
  const [uploadStep, setUploadStep] = useState('idle'); // idle | uploading | transcribing | ready

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploadStep('uploading');
      const jobData = await uploadVideo(file);

      setUploadStep('transcribing');
      setTranscribing(true);
      setTranscribingStatus('Uploading audio to transcription service...');

      const txData = await startTranscription(jobData.file.url, 'en');

      if (!txData?.transcriptId) {
        toast.warning('Transcription service not configured. Add AssemblyAI key to backend .env. Captions skipped.');
        setUploadStep('ready');
        setTranscribing(false);
        return;
      }

      setTranscribingStatus('AI is transcribing your video...');

      // Poll for results
      await pollTranscription(txData.transcriptId);

      setTranscribingStatus('');
      setTranscribing(false);
      setUploadStep('ready');
      toast.success('Transcription complete! Captions are ready.');
    } catch (err) {
      console.error(err);
      setTranscribing(false);
      setUploadStep(job ? 'ready' : 'idle');
      toast.error(err.message || 'Something went wrong');
    }
  }, [uploadVideo, startTranscription, pollTranscription, job]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'] },
    maxFiles: 1,
    disabled: uploadStep === 'uploading' || uploadStep === 'transcribing'
  });

  return (
    <div className="editor-page">
      {/* Top bar */}
      <div className="editor-topbar">
        <a href="/" className="editor-logo">
          <span>✦</span>
          <span>Huli<span>magic</span></span>
        </a>
        <div className="editor-project-name">
          {job ? (job.file?.originalName || 'Untitled Project') : 'New Project'}
        </div>
        <div className="editor-topbar-actions">
          <a href="/dashboard" className="btn btn-ghost btn-sm">← Dashboard</a>
        </div>
      </div>

      <div className="editor-body">
        {/* LEFT: Video + Upload */}
        <div className="editor-left">
          {!job ? (
            <div
              {...getRootProps()}
              className={`upload-zone ${isDragActive ? 'dragover' : ''} ${uploadStep === 'uploading' ? 'uploading' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="upload-zone-content">
                {uploadStep === 'idle' ? (
                  <>
                    <div className="upload-icon">📹</div>
                    <h2 className="upload-title">Drop your video here</h2>
                    <p className="upload-subtitle">MP4, MOV, AVI, MKV, WebM • Up to 500MB</p>
                    <button className="btn btn-primary btn-lg" type="button">
                      Browse Files
                    </button>
                    <p className="upload-hint">AI will auto-transcribe and generate captions</p>
                  </>
                ) : uploadStep === 'uploading' ? (
                  <>
                    <div className="upload-progress-ring">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="var(--accent-green)" strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 0.3s' }}
                        />
                      </svg>
                      <span>{progress}%</span>
                    </div>
                    <p className="upload-status">Uploading video...</p>
                  </>
                ) : (
                  <>
                    <div className="transcribe-spinner">
                      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
                    </div>
                    <p className="upload-status">{transcribingStatus}</p>
                    <p className="upload-hint">This usually takes 1-3 minutes</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="editor-video-section">
              <VideoPlayer />
              {/* Quick action strip */}
              <div className="quick-actions">
                <QuickActionBtn icon="✂️" label="Trim" onClick={() => setActiveTab('clips')} />
                <QuickActionBtn icon="🔇" label="Remove Silence" onClick={() => setActiveTab('clips')} />
                <QuickActionBtn icon="📐" label="Reframe" onClick={() => setActiveTab('export')} />
                <QuickActionBtn icon="📤" label="Export" onClick={() => setActiveTab('export')} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Tools Panel */}
        <div className={`editor-right ${!job ? 'editor-right-disabled' : ''}`}>
          {/* Tabs */}
          <div className="editor-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`editor-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
                disabled={!job}
              >
                <span className="tab-icon">{t.icon}</span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="editor-panel">
            {!job ? (
              <div className="panel-empty">
                <div className="panel-empty-icon">⬅️</div>
                <p>Upload a video to get started</p>
              </div>
            ) : (
              <>
                {activeTab === 'captions' && <CaptionEditor />}
                {activeTab === 'clips' && <ClipsPanel />}
                {activeTab === 'broll' && <BRollPanel />}
                {activeTab === 'music' && <MusicPanel />}
                {activeTab === 'translate' && <TranslatePanel />}
                {activeTab === 'export' && <ExportPanel />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionBtn({ icon, label, onClick }) {
  return (
    <button className="quick-action-btn" onClick={onClick}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
