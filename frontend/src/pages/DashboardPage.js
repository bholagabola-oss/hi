import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const MOCK_PROJECTS = [
  { id: '1', name: 'Podcast Episode 42', thumbnail: null, duration: '45:20', clips: 8, status: 'done', date: '2 days ago' },
  { id: '2', name: 'Product Launch Video', thumbnail: null, duration: '12:05', clips: 4, status: 'done', date: '5 days ago' },
  { id: '3', name: 'Webinar Recording', thumbnail: null, duration: '1:02:10', clips: 12, status: 'processing', date: 'Just now' },
  { id: '4', name: 'Interview - Sarah K', thumbnail: null, duration: '28:33', clips: 6, status: 'done', date: '1 week ago' },
];

const STATS = [
  { label: 'Videos Processed', value: '24', icon: '🎬' },
  { label: 'Clips Generated', value: '142', icon: '✂️' },
  { label: 'Hours Saved', value: '18h', icon: '⏱️' },
  { label: 'Views Gained', value: '2.4M', icon: '👁️' },
];

export default function DashboardPage() {
  const [view, setView] = useState('grid');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Projects</h1>
          <p className="dashboard-subtitle">Manage your videos and clips</p>
        </div>
        <Link to="/editor" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <span className="projects-count">{MOCK_PROJECTS.length} projects</span>
        <div className="view-toggle">
          <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
          <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰</button>
        </div>
      </div>

      {/* Projects */}
      <div className={`projects-${view}`}>
        {MOCK_PROJECTS.map((p) => (
          <Link to={`/editor/${p.id}`} key={p.id} className="project-card">
            <div className="project-thumb">
              <div className="thumb-placeholder">🎬</div>
              {p.status === 'processing' && (
                <div className="thumb-processing">
                  <div className="spinner" />
                </div>
              )}
              <div className="project-duration">{p.duration}</div>
            </div>
            <div className="project-info">
              <div className="project-name">{p.name}</div>
              <div className="project-meta">
                <span>{p.clips} clips</span>
                <span>•</span>
                <span>{p.date}</span>
              </div>
              <div className={`project-status status-${p.status}`}>
                {p.status === 'processing' ? '⚡ Processing' : '✓ Done'}
              </div>
            </div>
          </Link>
        ))}

        {/* New project card */}
        <Link to="/editor" className="project-card project-new">
          <div className="project-new-inner">
            <div className="new-icon">+</div>
            <div className="new-label">New Project</div>
            <div className="new-sub">Upload a video to start</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
