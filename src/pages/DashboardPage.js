// ─────────────────────────────────────────────────────────────
// DashboardPage.js
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import ScoreRing   from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import { Badge, Card, SectionTitle, StatCard, EmptyState } from '../components/ui/Common';
import styles from './DashboardPage.module.css';

const LEVEL_COLOR = { ENTRY:'var(--text-dim)', JUNIOR:'var(--amber)', MID:'var(--emerald)', SENIOR:'var(--accent)', EXPERT:'var(--pink)' };
const SCORE_KEYS  = [
  { key:'skills',          label:'Skills',     color:'var(--accent)'  },
  { key:'experience',      label:'Experience', color:'var(--emerald)' },
  { key:'education',       label:'Education',  color:'var(--amber)'   },
  { key:'atsCompatibility',label:'ATS',        color:'var(--pink)'    },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { analysis, history, uploadedFile } = useAnalysis();

  if (!analysis) return (
    <div className={styles.page}>
      <div className={styles.header}><SectionTitle icon="⬡" title="Dashboard" subtitle="Your resume analysis overview" action={<button className={styles.btnPrimary} onClick={() => navigate('/upload')}>+ Analyze Resume</button>} /></div>
      <EmptyState icon="📊" title="No analyses yet" description="Upload your first resume to get started." action={<button className={styles.btnPrimary} onClick={() => navigate('/upload')}>Upload Resume</button>} />
    </div>
  );

  const lc = LEVEL_COLOR[analysis.readinessLevel] || 'var(--accent)';
  const s = analysis.scores || {
  overall: analysis.overallScore,
  skills: analysis.skillsScore,
  experience: analysis.experienceScore,
  education: analysis.educationScore,
  atsCompatibility: analysis.atsCompatibilityScore,
};
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <SectionTitle icon="⬡" title="Dashboard" subtitle="Your resume analysis overview"
          action={<button className={styles.btnPrimary} onClick={() => navigate('/upload')}>+ Analyze New</button>} />
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <Card glow>
            <div className={styles.curHeader}>
              <div>
                <div className={styles.curName}>{analysis.candidateName || 'Resume'}</div>
                <div className={styles.curFile}>{uploadedFile?.name}</div>
              </div>
              <button className={styles.btnView} onClick={() => navigate('/results')}>View Full Report →</button>
            </div>
            <div className={styles.curBody}>
              <ScoreRing score={s.overall||0} size={140} label="OVERALL" color={lc} thickness={10} />
              <div className={styles.curScores}>
                {SCORE_KEYS.map(({key,label,color},i) => <div key={key} style={{marginBottom:12}}><ProgressBar label={label} value={s[key]||0} color={color} delay={i*80} /></div>)}
              </div>
            </div>
            <div className={styles.badges}>
              <Badge label={analysis.readinessLevel||'ENTRY'} color={lc} size="lg" />
              <Badge label={analysis.primaryIndustry||'General'} color="var(--text-dim)" />
              <Badge label={`${analysis.yearsOfExperience} yrs exp`} color="var(--accent)" />
            </div>
          </Card>

          <div className={styles.actions}>
            {[
              { icon:'🎯', title:'Job Match',    desc:'Compare against a posting',      path:'/job-match' },
              { icon:'💡', title:'Improvements', desc:`${analysis.improvements?.length||0} suggestions`, path:'/results' },
              { icon:'🛠', title:'Skills',        desc:`${analysis.skills?.length||0} detected`,         path:'/results' },
            ].map(a => (
              <button key={a.title} className={styles.actionCard} onClick={() => navigate(a.path)}>
                <div className={styles.actionIcon}>{a.icon}</div>
                <div><div className={styles.actionTitle}>{a.title}</div><div className={styles.actionDesc}>{a.desc}</div></div>
                <span className={styles.arrow}>→</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.statsGrid}>
            <StatCard icon="⚡" label="Skills"      value={analysis.skills?.length||0}      color="var(--accent)" />
            <StatCard icon="💼" label="Roles"        value={analysis.experience?.length||0}  color="var(--emerald)" />
            <StatCard icon="🎓" label="Degrees"      value={analysis.education?.length||0}   color="var(--amber)" />
            <StatCard icon="💡" label="Action Items" value={analysis.improvements?.length||0} color="var(--rose)" />
          </div>

          <Card>
            <SectionTitle icon="🔥" title="Top Priorities" subtitle="HIGH priority items" />
            {(analysis.improvements||[]).filter(i => i.priority==='HIGH').slice(0,4).map((item,i) => (
              <div key={i} className={styles.priItem}><div className={styles.priDot}/><span>{item.suggestion}</span></div>
            ))}
            {!(analysis.improvements||[]).some(i => i.priority==='HIGH') && <div className={styles.noPri}>🎉 No high-priority issues!</div>}
          </Card>

          {history.length > 1 && (
            <Card>
              <SectionTitle icon="🕓" title="History" subtitle={`${history.length} analyses`} />
              {history.slice(0,5).map((h,i) => (
                <div key={i} className={styles.histItem}>
                  <div><div className={styles.histName}>{h.candidateName||'Resume'}</div><div className={styles.histDate}>{h.date?.toLocaleDateString()}</div></div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color: LEVEL_COLOR[h.readinessLevel]||'var(--accent)' }}>{h.scores?.overall ?? h.overallScore}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
