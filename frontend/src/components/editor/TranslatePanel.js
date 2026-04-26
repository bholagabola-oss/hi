import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import './TranslatePanel.css';

export default function TranslatePanel() {
  const { captions, translateCaptions, api, loading } = useApp();
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/translate/languages').then(({ data }) => {
      setLanguages(data.languages || []);
    }).catch(() => {});
  }, []);

  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleTranslate = async () => {
    if (!selectedLang) return toast.error('Select a target language');
    if (!captions.length) return toast.error('No captions to translate');
    try {
      await translateCaptions(selectedLang);
    } catch (e) {}
  };

  return (
    <div className="translate-panel">
      <p className="panel-desc">
        Translate your captions into 30+ languages to reach a global audience. Powered by MyMemory (free).
      </p>

      {!captions.length && (
        <div className="translate-warning">
          ⚠️ Generate captions first before translating.
        </div>
      )}

      <input
        type="text"
        placeholder="Search language..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="lang-grid">
        {filtered.map(lang => (
          <button
            key={lang.code}
            className={`lang-btn ${selectedLang === lang.code ? 'active' : ''}`}
            onClick={() => setSelectedLang(lang.code)}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
          </button>
        ))}
      </div>

      {selectedLang && (
        <div className="translate-action">
          <div className="translate-info">
            Translating {captions.length} captions to{' '}
            <strong>{languages.find(l => l.code === selectedLang)?.name}</strong>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleTranslate}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <><span className="spinner" /> Translating...</> : '🌍 Translate Captions'}
          </button>
        </div>
      )}
    </div>
  );
}
