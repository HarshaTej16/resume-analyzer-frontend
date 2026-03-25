import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { resumeAPI } from '../services/apiService';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeId,     setResumeId]     = useState(null);
  const [analysis,     setAnalysis]     = useState(null);
  const [jobDesc,      setJobDesc]      = useState('');
  const [status,       setStatus]       = useState('idle');
  const [progress,     setProgress]     = useState(0);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [history,      setHistory]      = useState([]);
  const pollRef = useRef(null);

  const startAnalysis = useCallback(async (file) => {
    if (!file) return;
    setStatus('uploading');
    setProgress(10);
    setErrorMsg('');
    setAnalysis(null);
    setResumeId(null);

    try {
      // 1. Upload file to Spring Boot
      const uploadRes = await resumeAPI.upload(file);
      const data      = uploadRes.data || uploadRes;

      // Handle both response shapes
      const id = data?.resumeId
               || data?.data?.resumeId
               || data?.id;

      if (!id) throw new Error('No resume ID returned from server');

      setResumeId(id);
      setStatus('analyzing');
      setProgress(30);

      // 2. Poll until ANALYZED
      await pollForResult(id);

    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(typeof err === 'string' ? err : 'Upload failed. Please try again.');
      setStatus('error');
      setProgress(0);
    }
  }, []);

  const pollForResult = useCallback((id) => {
    return new Promise((resolve, reject) => {
      let attempts      = 0;
      const maxAttempts = 30; // 60 seconds max

      const tick = async () => {
        attempts++;
        // Slowly advance progress bar toward 90%
        setProgress(p => Math.min(p + 4, 90));

        try {
          const res  = await resumeAPI.getAnalysis(id);
          const data = res.data || res;

          if (data.status === 'ANALYZED') {
            // ── Success ──────────────────────────────────────
            clearInterval(pollRef.current);
            setAnalysis(data);
            setProgress(100);
            setTimeout(() => {
              setStatus('done');
              setHistory(h => [
                { ...data, date: new Date() },
                ...h,
              ].slice(0, 10));
            }, 500);
            resolve(data);

          } else if (data.status === 'FAILED') {
            // ── Server-side failure ───────────────────────────
            clearInterval(pollRef.current);
            setErrorMsg('Analysis failed on the server. Please try again.');
            setStatus('error');
            reject('FAILED');

          } else if (attempts >= maxAttempts) {
            // ── Timeout ───────────────────────────────────────
            clearInterval(pollRef.current);
            setErrorMsg('Analysis is taking too long. Please try again.');
            setStatus('error');
            reject('TIMEOUT');
          }
          // else status is PENDING or PROCESSING — keep polling

        } catch (err) {
          // ── 404 or network error during polling ───────────
          // 404 means the analysis record doesn't exist YET
          // (backend is still processing) — treat it as PENDING
          const is404 = typeof err === 'string'
            ? err.includes('404') || err.includes('not found')
            : false;

          if (is404 && attempts < maxAttempts) {
            // Still processing — just keep polling
            console.log(`Poll attempt ${attempts}: still processing...`);
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollRef.current);
            setErrorMsg('Analysis is taking too long. Please try again.');
            setStatus('error');
            reject('TIMEOUT');
            return;
          }

          // Real unexpected error
          clearInterval(pollRef.current);
          setErrorMsg(typeof err === 'string' ? err : 'Error fetching results. Please try again.');
          setStatus('error');
          reject(err);
        }
      };

      // Poll every 2 seconds, run first tick immediately
      pollRef.current = setInterval(tick, 2000);
      tick();
    });
  }, []);

  const reset = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setUploadedFile(null);
    setResumeId(null);
    setAnalysis(null);
    setJobDesc('');
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
  }, []);

  return (
    <AnalysisContext.Provider value={{
      uploadedFile, setUploadedFile,
      resumeId,
      analysis,
      jobDesc,      setJobDesc,
      status,
      progress,
      errorMsg,
      history,
      startAnalysis,
      reset,
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be inside <AnalysisProvider>');
  return ctx;
}