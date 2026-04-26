import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const [job, setJob] = useState(null); // current job
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [transcriptId, setTranscriptId] = useState(null);
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [captionStyle, setCaptionStyle] = useState('viral');
  const [currentVideo, setCurrentVideo] = useState(null);

  const api = axios.create({ baseURL: API_BASE });

  const uploadVideo = useCallback(async (file) => {
    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const { data } = await api.post('/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100))
      });

      setJob(data);
      setCurrentVideo(data.file.url);
      setProgress(100);
      toast.success('Video uploaded successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startTranscription = useCallback(async (filePath, language = 'en') => {
    if (!job?.jobId) return;
    setLoading(true);
    try {
      const { data } = await api.post('/transcription/start', {
        jobId: job.jobId,
        filePath,
        language
      });
      setTranscriptId(data.transcriptId);
      toast.info('Transcription started...');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Transcription failed to start');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job]);

  const pollTranscription = useCallback(async (transcriptId) => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const { data } = await api.get(`/transcription/status/${transcriptId}`);
          if (data.status === 'completed') {
            setCaptions(data.captions || []);
            resolve(data);
          } else if (data.status === 'error') {
            reject(new Error(data.error));
          } else {
            setTimeout(poll, 3000);
          }
        } catch (err) {
          reject(err);
        }
      };
      poll();
    });
  }, []);

  const generateClips = useCallback(async (chapters, highlights) => {
    if (!job?.jobId || !currentVideo) return;
    setLoading(true);
    try {
      const { data } = await api.post('/clips/generate', {
        jobId: job.jobId,
        inputFile: currentVideo,
        chapters,
        maxClips: 10
      });

      // Score clips
      const { data: scored } = await api.post('/clips/score', {
        clips: data.clips,
        highlights
      });

      setClips(scored.clips);
      toast.success(`Generated ${scored.clips.length} clips!`);
      return scored.clips;
    } catch (err) {
      toast.error('Clip generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, currentVideo]);

  const burnCaptions = useCallback(async (inputFile, style) => {
    if (!job?.jobId) return;
    setLoading(true);
    try {
      const { data } = await api.post('/captions/burn', {
        jobId: job.jobId,
        inputFile,
        captions,
        style: style || captionStyle
      });
      setCurrentVideo(data.outputUrl);
      toast.success('Captions burned successfully!');
      return data;
    } catch (err) {
      toast.error('Failed to burn captions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, captions, captionStyle]);

  const exportVideo = useCallback(async (settings) => {
    if (!job?.jobId || !currentVideo) return;
    setLoading(true);
    try {
      const { data } = await api.post('/export/video', {
        jobId: job.jobId,
        inputFile: currentVideo,
        captions,
        ...settings
      });
      toast.success('Export complete! Downloading...');
      // Trigger download
      const link = document.createElement('a');
      link.href = `${API_BASE.replace('/api', '')}${data.outputUrl}`;
      link.download = data.filename;
      link.click();
      return data;
    } catch (err) {
      toast.error('Export failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, currentVideo, captions]);

  const translateCaptions = useCallback(async (toLang) => {
    if (!captions.length) return;
    setLoading(true);
    try {
      const { data } = await api.post('/translate/captions', {
        captions,
        fromLang: 'en',
        toLang
      });
      setCaptions(data.captions);
      toast.success(`Captions translated!`);
      return data.captions;
    } catch (err) {
      toast.error('Translation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [captions]);

  const trimVideo = useCallback(async (startTime, endTime) => {
    if (!job?.jobId || !currentVideo) return;
    setLoading(true);
    try {
      const { data } = await api.post('/video/trim', {
        jobId: job.jobId,
        inputFile: currentVideo,
        startTime,
        endTime
      });
      setCurrentVideo(data.outputUrl);
      toast.success('Video trimmed!');
      return data;
    } catch (err) {
      toast.error('Trim failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, currentVideo]);

  const removeSilence = useCallback(async () => {
    if (!job?.jobId || !currentVideo) return;
    setLoading(true);
    try {
      const { data } = await api.post('/video/remove-silence', {
        jobId: job.jobId,
        inputFile: currentVideo
      });
      setCurrentVideo(data.outputUrl);
      toast.success(`Removed ${data.silencesRemoved} silent segments!`);
      return data;
    } catch (err) {
      toast.error('Failed to remove silence');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, currentVideo]);

  const addMusic = useCallback(async (musicUrl, volume = 0.3) => {
    if (!job?.jobId || !currentVideo) return;
    setLoading(true);
    try {
      const { data } = await api.post('/music/add', {
        jobId: job.jobId,
        inputFile: currentVideo,
        musicUrl,
        volume
      });
      setCurrentVideo(data.outputUrl);
      toast.success('Background music added!');
      return data;
    } catch (err) {
      toast.error('Failed to add music');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [job, currentVideo]);

  return (
    <AppContext.Provider value={{
      job, setJob,
      loading, setLoading,
      progress, setProgress,
      captions, setCaptions,
      transcriptId, setTranscriptId,
      clips, setClips,
      selectedClip, setSelectedClip,
      captionStyle, setCaptionStyle,
      currentVideo, setCurrentVideo,
      api,
      uploadVideo,
      startTranscription,
      pollTranscription,
      generateClips,
      burnCaptions,
      exportVideo,
      translateCaptions,
      trimVideo,
      removeSilence,
      addMusic
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
