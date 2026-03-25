import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import styles from './AnalyzingPage.module.css';

const STEPS = [
  { label: 'Parsing document structure',    pct: 10 },
  { label: 'Extracting contact info',        pct: 25 },
  { label: 'Identifying skills & tools',    pct: 42 },
  { label: 'Analysing work experience',      pct: 58 },
  { label: 'Evaluating education history',  pct: 70 },
  { label: 'Scoring ATS compatibility',     pct: 80 },
  { label: 'Generating improvement plan',   pct: 90 },
  { label: 'Finalising results',            pct: 96 },
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { status, progress, uploadedFile } = useAnalysis();

  useEffect(() => {
    if (status === 'done')  navigate('/results',  { replace: true });
    if (status === 'error') navigate('/upload',   { replace: true });
  }, [status, navigate]);

  const activeStep = STEPS.find(s => progress < s.pct);

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        {/* Animated ring */}
        <div className={styles.ringWrap}>
          <svg width="120" height="120" viewBox="0 0 120 120" className={styles.svg}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)"  strokeWidth="3" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)"  strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 339.3} 339.3`}
              strokeDashoffset="84.75"
              style={{ transition: 'stroke-dasharray 0.4s ease', filter: 'drop-shadow(0 0 6px var(--accent))' }}
            />
          </svg>
          <div className={styles.ringInner}>RA</div>
        </div>

        <h1 className={styles.title}>Analyzing Resume</h1>
        <p className={styles.file}>{uploadedFile?.name}</p>

        {/* Bar */}
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.pctRow}>
          <span className={styles.pct}>{Math.round(progress)}%</span>
          {activeStep && <span className={styles.stepText}>{activeStep.label}…</span>}
        </div>

        {/* Step list */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => {
            const done   = progress >= s.pct;
            const active = !done && s === activeStep;
            return (
              <div key={i} className={`${styles.step} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
                <div className={styles.indicator}>
                  {done && '✓'}
                  {active && <span className={styles.pulse} />}
                </div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}