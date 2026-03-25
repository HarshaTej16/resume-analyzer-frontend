import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { SectionTitle } from '../components/ui/Common';
import styles from './UploadPage.module.css';

const ACCEPTED = ['.pdf', '.doc', '.docx', '.txt'];

export default function UploadPage() {
  const navigate = useNavigate();
  const { setUploadedFile, jobDesc, setJobDesc, startAnalysis, status, errorMsg } = useAnalysis();

  const [drag,    setDrag]    = useState(false);
  const [fileObj, setFileObj] = useState(null);
  const [error,   setError]   = useState('');
  const inputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setError(`Unsupported type. Allowed: ${ACCEPTED.join(', ')}`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10 MB.');
      return;
    }
    setError('');
    setFileObj(file);
    setUploadedFile(file);
  }, [setUploadedFile]);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = () => {
    if (!fileObj) return;
    startAnalysis(fileObj);
    navigate('/analyzing');
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <SectionTitle
          icon="⬆"
          title="Upload Resume"
          subtitle="PDF, DOCX, DOC or TXT · max 10 MB"
        />

        {/* Drop zone */}
        <div
          className={`${styles.zone} ${drag ? styles.dragging : ''} ${fileObj ? styles.hasFile : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => !fileObj && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {fileObj ? (
            <div className={styles.fileRow}>
              <span className={styles.fileEmoji}>📄</span>
              <div className={styles.fileMeta}>
                <div className={styles.fileName}>{fileObj.name}</div>
                <div className={styles.fileSize}>
                  {(fileObj.size / 1024).toFixed(0)} KB · Ready to analyse
                </div>
              </div>
              <button
                className={styles.removeBtn}
                onClick={e => {
                  e.stopPropagation();
                  setFileObj(null);
                  setUploadedFile(null);
                }}
              >✕</button>
            </div>
          ) : (
            <div className={styles.dropContent}>
              <div className={styles.dropIcon}>📄</div>
              <div className={styles.dropTitle}>Drop your resume here</div>
              <div className={styles.dropSub}>
                or{' '}
                <span className={styles.browse}
                  onClick={() => inputRef.current?.click()}>
                  browse files
                </span>
              </div>
              <div className={styles.dropHint}>PDF · DOCX · DOC · TXT · Max 10 MB</div>
            </div>
          )}
        </div>

        {(error || errorMsg) && (
          <div className={styles.error}>⚠ {error || errorMsg}</div>
        )}

        {/* Optional job description */}
        <div className={styles.section}>
          <div className={styles.secHeader}>
            <span className={styles.secLabel}>
              🎯 Job Description
              <span className={styles.opt}>optional</span>
            </span>
            <span className={styles.secHint}>Paste to get a job-fit score</span>
          </div>
          <textarea
            className={styles.textarea}
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description here for a personalised match score…"
            rows={5}
          />
        </div>

        {/* Tips */}
        <div className={styles.tips}>
          <div className={styles.tipsTitle}>⚙ How it works</div>
          <ul className={styles.tipList}>
            <li>Your resume is uploaded securely to our Spring Boot server</li>
            <li>Text is extracted using PDFBox / Apache POI</li>
            <li>6 dimensions scored: Skills, Experience, Education, Formatting, Keywords, ATS</li>
            <li>Results saved to MySQL and displayed instantly</li>
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.btnAnalyze}
            onClick={handleAnalyze}
            disabled={!fileObj || status === 'uploading' || status === 'analyzing'}
          >
            {status === 'uploading' ? 'Uploading…'
              : status === 'analyzing' ? 'Analysing…'
              : 'Analyse Resume →'}
          </button>
          {fileObj && (
            <button className={styles.btnClear}
              onClick={() => { setFileObj(null); setUploadedFile(null); setJobDesc(''); setError(''); }}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}