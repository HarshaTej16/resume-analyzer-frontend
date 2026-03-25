import React, { useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { resumeAPI } from '../services/apiService';
import ScoreRing   from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import { Badge, Card, SectionTitle, EmptyState, Spinner } from '../components/ui/Common';
import styles from './JobMatchPage.module.css';

const FIT_COLOR = {
  POOR:      'var(--rose)',
  FAIR:      'var(--amber)',
  GOOD:      'var(--accent)',
  EXCELLENT: 'var(--emerald)',
};

export default function JobMatchPage() {
  const { analysis, resumeId } = useAnalysis();

  const [jd,      setJd]      = useState('');
  const [title,   setTitle]   = useState('');
  const [company, setCompany] = useState('');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (!analysis || !resumeId) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="🎯"
          title="No resume analysed yet"
          description="Upload and analyse a resume first before running a job match."
        />
      </div>
    );
  }

  const handleMatch = async () => {
    if (!jd.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // Calls POST /api/v1/resumes/{id}/job-match on Spring Boot
      const res = await resumeAPI.jobMatch(resumeId, jd, title, company);
      // apiService interceptor returns res.data already
      setResult(res.data || res);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Match failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fitColor = result ? (FIT_COLOR[result.fitLevel] || 'var(--accent)') : 'var(--accent)';

  return (
    <div className={styles.page}>
      <SectionTitle
        icon="◎"
        title="Job Match Analyser"
        subtitle="Compares your resume against a job description using our scoring engine"
      />

      <div className={styles.grid}>
        {/* ── Left: Input ── */}
        <div className={styles.left}>
          <Card>
            <SectionTitle icon="📋" title="Job Details" />

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Job Title <span className={styles.opt}>optional</span>
                </label>
                <input
                  className={styles.input}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Senior Java Developer"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Company <span className={styles.opt}>optional</span>
                </label>
                <input
                  className={styles.input}
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div className={styles.field} style={{ marginTop: 14 }}>
              <label className={styles.label}>
                Job Description <span className={styles.req}>* required</span>
              </label>
              <textarea
                className={styles.ta}
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Paste the full job description here — requirements, responsibilities, qualifications…"
                rows={12}
              />
            </div>

            {error && <div className={styles.err}>⚠ {error}</div>}

            <button
              className={styles.btnMatch}
              onClick={handleMatch}
              disabled={!jd.trim() || loading}
            >
              {loading
                ? <><Spinner size={18} color="#fff" /> Analysing Match…</>
                : '🎯 Run Match Analysis'}
            </button>
          </Card>

          {/* Resume summary */}
          <Card>
            <SectionTitle icon="📄" title="Your Resume" subtitle="Currently loaded" />
            {[
              ['Candidate',   analysis.candidateName   || '—'],
              ['Industry',    analysis.primaryIndustry || '—'],
              ['Experience',  `${analysis.yearsOfExperience || 0} years`],
              ['Level',       analysis.readinessLevel  || '—'],
              ['Score',       `${analysis.overallScore || 0}/100`],
              ['Skills',      `${analysis.skills?.length || 0} detected`],
            ].map(([l, v]) => (
              <div key={l} className={styles.rsRow}>
                <span className={styles.rsLabel}>{l}</span>
                <span className={styles.rsVal}>{v}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* ── Right: Results ── */}
        <div className={styles.right}>
          {!result && !loading && (
            <div className={styles.placeholder}>
              <div className={styles.phIcon}>◎</div>
              <div className={styles.phTitle}>Results appear here</div>
              <div className={styles.phSub}>
                Paste a job description and click Run Match Analysis
              </div>
            </div>
          )}

          {loading && (
            <div className={styles.loading}>
              <Spinner size={40} />
              <div className={styles.loadText}>
                Comparing your profile against the role…
              </div>
            </div>
          )}

          {result && (
            <div className={styles.results}>
              {/* Match hero */}
              <Card glow className={styles.matchHero}>
                <ScoreRing
                  score={result.matchScore || 0}
                  size={150}
                  label="MATCH"
                  color={fitColor}
                  thickness={11}
                />
                <div>
                  <div className={styles.fitLevel} style={{ color: fitColor }}>
                    {result.fitLevel} FIT
                  </div>
                  {(result.jobTitle || result.company) && (
                    <div className={styles.jobInfo}>
                      {result.jobTitle}
                      {result.company ? ` · ${result.company}` : ''}
                    </div>
                  )}
                  <p className={styles.rec}>{result.recommendation}</p>
                  <Badge label={result.fitLevel} color={fitColor} size="lg" />
                </div>
              </Card>

              {/* Sub scores */}
              <Card>
                <SectionTitle icon="📊" title="Match Breakdown" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <ProgressBar
                    label="Skills Match"
                    value={Math.round(result.skillsMatch || 0)}
                    color="var(--accent)"
                  />
                  <ProgressBar
                    label="Experience Match"
                    value={Math.round(result.experienceMatch || 0)}
                    color="var(--emerald)"
                  />
                  <ProgressBar
                    label="Education Match"
                    value={Math.round(result.educationMatch || 0)}
                    color="var(--amber)"
                  />
                </div>
              </Card>

              {/* Skills grid */}
              <div className={styles.skillsGrid}>
                <Card>
                  <SectionTitle
                    icon="✓"
                    title="Matching Skills"
                    subtitle={`${result.matchingSkills?.length || 0} found`}
                  />
                  {(result.matchingSkills || []).map((sk, i) => (
                    <div key={i} className={styles.matchSk}>
                      <span className={styles.yes}>✓</span>{sk}
                    </div>
                  ))}
                  {!result.matchingSkills?.length && (
                    <div className={styles.none}>None detected</div>
                  )}
                </Card>
                <Card>
                  <SectionTitle
                    icon="✕"
                    title="Missing Skills"
                    subtitle={`${result.missingSkills?.length || 0} gaps`}
                  />
                  {(result.missingSkills || []).map((sk, i) => (
                    <div key={i} className={styles.missSk}>
                      <span className={styles.no}>✕</span>{sk}
                    </div>
                  ))}
                  {!result.missingSkills?.length && (
                    <div className={styles.none} style={{ color: 'var(--emerald)' }}>
                      🎉 No skill gaps detected!
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}