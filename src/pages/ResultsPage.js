import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import ScoreRing   from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import { Badge, Card, SectionTitle, SkillTag, StatCard, EmptyState } from '../components/ui/Common';
import styles from './ResultsPage.module.css';

const LEVEL_COLOR = { ENTRY:'var(--text-dim)', JUNIOR:'var(--amber)', MID:'var(--emerald)', SENIOR:'var(--accent)', EXPERT:'var(--pink)' };
const PRIORITY_COLOR = { HIGH:'var(--rose)', MEDIUM:'var(--amber)', LOW:'var(--emerald)' };
const SCORE_ITEMS = [
  { key:'skills',          label:'Skills',        color:'var(--accent)'  },
  { key:'experience',      label:'Experience',    color:'var(--emerald)' },
  { key:'education',       label:'Education',     color:'var(--amber)'   },
  { key:'formatting',      label:'Formatting',    color:'var(--sky)'     },
  { key:'keywords',        label:'Keywords',      color:'var(--violet)'  },
  { key:'atsCompatibility',label:'ATS Score',     color:'var(--pink)'    },
];
const TABS = ['Overview','Skills','Experience','Education','Improvements'];

export default function ResultsPage() {
  const navigate = useNavigate();
  const { analysis, uploadedFile, reset } = useAnalysis();
  const [tab, setTab] = useState('Overview');

  if (!analysis) return (
    <div className={styles.page}>
      <EmptyState icon="📊" title="No analysis yet" description="Upload a resume first to see results."
        action={<button className={styles.btnPrimary} onClick={() => navigate('/upload')}>Upload Resume</button>} />
    </div>
  );

 const s = analysis.scores || {
  overall: analysis.overallScore,
  skills: analysis.skillsScore,
  experience: analysis.experienceScore,
  education: analysis.educationScore,
  formatting: analysis.formattingScore,
  keywords: analysis.keywordsScore,
  atsCompatibility: analysis.atsCompatibilityScore,
};
  const level = analysis.readinessLevel || 'ENTRY';
  const lc    = LEVEL_COLOR[level] || 'var(--accent)';

  const sorted = [...(analysis.improvements || [])].sort((a,b) => {
    const o = { HIGH:0, MEDIUM:1, LOW:2 };
    return (o[a.priority]??3) - (o[b.priority]??3);
  });

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.topIcon}>📄</span>
          <div>
            <div className={styles.topName}>{uploadedFile?.name || 'Resume'}</div>
            <div className={styles.topSub}>Analysis complete · {new Date().toLocaleDateString()}</div>
          </div>
        </div>
        <div className={styles.topRight}>
          <Badge label={level} color={lc} size="lg" />
          <span className={styles.topScore} style={{ color: lc }}>{s.overall}/100</span>
          <button className={styles.btnOutline} onClick={() => navigate('/job-match')}>🎯 Job Match</button>
          <button className={styles.btnOutline} onClick={() => { reset(); navigate('/upload'); }}>↩ New</button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Hero row */}
        <div className={styles.heroRow}>
          <Card glow className={styles.mainScore}>
            <ScoreRing score={s.overall||0} size={160} label="OVERALL" color={lc} thickness={11} />
            <div className={styles.levelPill} style={{ color: lc, background:`${lc}18`, borderColor:`${lc}33` }}>{level} LEVEL</div>
            <div className={styles.industry}>{analysis.primaryIndustry}</div>
          </Card>

          <Card className={styles.summaryCard}>
            <SectionTitle icon="👤" title={analysis.candidateName || 'Candidate'} />
            <p className={styles.summaryText}>{analysis.summaryText}</p>
            <div className={styles.contactGrid}>
              {analysis.candidateEmail    && <div className={styles.ci}><span>✉</span>{analysis.candidateEmail}</div>}
              {analysis.candidatePhone    && <div className={styles.ci}><span>📞</span>{analysis.candidatePhone}</div>}
              {analysis.candidateLocation && <div className={styles.ci}><span>📍</span>{analysis.candidateLocation}</div>}
              <div className={styles.ci}><span>⏱</span>{analysis.yearsOfExperience} yrs experience</div>
              <div className={styles.ci}><span>🎓</span>{analysis.educationLevel}</div>
              {analysis.jobMatchScore && <div className={styles.ci} style={{color:'var(--emerald)'}}><span>🎯</span>{analysis.jobMatchScore}% job match</div>}
            </div>
          </Card>

          <div className={styles.statCol}>
            <StatCard icon="⚡" label="Skills"       value={analysis.skills?.length||0}       color="var(--accent)" />
            <StatCard icon="💼" label="Experiences"  value={analysis.experience?.length||0}   color="var(--emerald)" />
            <StatCard icon="🎓" label="Education"    value={analysis.education?.length||0}    color="var(--amber)" />
            <StatCard icon="💡" label="Action Items" value={sorted.length}                    color="var(--rose)" />
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button key={t} className={`${styles.tab} ${tab===t ? styles.tabActive:''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div className={styles.twoCol}>
            <Card>
              <SectionTitle icon="📊" title="Score Breakdown" />
              <div className={styles.scoreList}>
                {SCORE_ITEMS.map(({key,label,color},i) => (
                  <ProgressBar key={key} label={label} value={s[key]||0} color={color} delay={i*80} />
                ))}
              </div>
            </Card>
            <div className={styles.rightCol}>
              <Card>
                <SectionTitle icon="⬡" title="Dimension Scores" />
                <div className={styles.miniGrid}>
                  {SCORE_ITEMS.map(({key,label,color}) => (
                    <div key={key} className={styles.miniItem}>
                      <ScoreRing score={s[key]||0} size={76} label={label.slice(0,4).toUpperCase()} color={color} thickness={6} />
                    </div>
                  ))}
                </div>
              </Card>
              {analysis.strengths?.length > 0 && (
                <Card>
                  <SectionTitle icon="✨" title="Key Strengths" />
                  {analysis.strengths.map((str,i) => (
                    <div key={i} className={styles.strength}><span className={styles.chk}>✓</span>{str}</div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === 'Skills' && (
          <div className={styles.twoCol}>
            <Card>
              <SectionTitle icon="🛠" title="All Skills" subtitle={`${analysis.skills?.length||0} detected`} />
              <div className={styles.skillCloud}>
                {(analysis.skills||[]).map((sk,i) => <SkillTag key={i} skill={sk} />)}
              </div>
            </Card>
            <Card>
              <SectionTitle icon="📈" title="By Category" />
              {Object.entries((analysis.skills||[]).reduce((acc,sk) => { acc[sk.category]=(acc[sk.category]||0)+1; return acc; }, {})).map(([cat,count]) => {
                const cols = { LANGUAGE:'var(--accent)',FRAMEWORK:'var(--emerald)',TOOL:'var(--amber)',DATABASE:'var(--pink)',CLOUD:'var(--sky)',SOFT:'var(--violet)',OTHER:'var(--text-dim)' };
                return <div key={cat} style={{marginBottom:12}}><ProgressBar label={cat} value={Math.round((count/(analysis.skills?.length||1))*100)} color={cols[cat]||'var(--text-dim)'} /></div>;
              })}
              {analysis.certifications?.length > 0 && (
                <>
                  <div className={styles.divider}/>
                  <div className={styles.certTitle}>Certifications</div>
                  {analysis.certifications.map((c,i) => <div key={i} className={styles.certItem}>🏅 {c}</div>)}
                </>
              )}
            </Card>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {tab === 'Experience' && (
          <div className={styles.listCol}>
            {!(analysis.experience?.length) ? (
              <EmptyState icon="💼" title="No experience detected" description="Make sure your resume has a clear Work Experience section." />
            ) : (analysis.experience||[]).map((exp,i) => (
              <Card key={i}>
                <div className={styles.expHeader}>
                  <div>
                    <div className={styles.expTitle}>{exp.title}</div>
                    <div className={styles.expCompany}>{exp.company}{exp.location && <span className={styles.expLoc}> · {exp.location}</span>}</div>
                  </div>
                  <div className={styles.expMeta}>
                    <div className={styles.expDates}>{exp.startDate} – {exp.endDate}</div>
                    <div className={styles.expDur}>{exp.durationMonths} months</div>
                    {exp.isCurrent && <Badge label="Current" color="var(--emerald)" />}
                  </div>
                </div>
                {exp.highlights?.length > 0 && (
                  <ul className={styles.highlights}>
                    {exp.highlights.map((h,j) => <li key={j}>{h}</li>)}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* ── EDUCATION ── */}
        {tab === 'Education' && (
          <div className={styles.listCol}>
            {!(analysis.education?.length) ? (
              <EmptyState icon="🎓" title="No education detected" description="Make sure your resume has a clear Education section." />
            ) : (analysis.education||[]).map((edu,i) => (
              <Card key={i}>
                <div className={styles.expHeader}>
                  <div>
                    <div className={styles.expTitle}>{edu.degree} — {edu.fieldOfStudy}</div>
                    <div className={styles.expCompany}>{edu.institution}</div>
                  </div>
                  <div className={styles.expMeta}>
                    {edu.startYear && edu.endYear && <div className={styles.expDates}>{edu.startYear} – {edu.endYear}</div>}
                    {edu.gpa && <div className={styles.expDur}>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── IMPROVEMENTS ── */}
        {tab === 'Improvements' && (
          <div className={styles.twoCol}>
            <div>
              <SectionTitle icon="💡" title="Action Items" subtitle="Fix high-priority items first" />
              {sorted.map((item,i) => {
                const color = PRIORITY_COLOR[item.priority]||'var(--text-mid)';
                return (
                  <div key={i} className={styles.improvCard} style={{ borderLeftColor: color }}>
                    <div className={styles.improvTop}>
                      <Badge label={item.priority} color={color} />
                      <Badge label={item.category} color="var(--text-dim)" />
                      <span className={styles.impact} style={{color}}>+{item.impactScore} pts</span>
                    </div>
                    <p className={styles.improvText}>{item.suggestion}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.rightCol}>
              <Card>
                <SectionTitle icon="📊" title="Priority Split" />
                {['HIGH','MEDIUM','LOW'].map(p => {
                  const count = sorted.filter(i => i.priority===p).length;
                  const color = PRIORITY_COLOR[p];
                  return (
                    <div key={p} className={styles.priStat}>
                      <Badge label={p} color={color} />
                      <span className={styles.priCount} style={{color}}>{count}</span>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <SectionTitle icon="🚀" title="Score Potential" />
                <div className={styles.potScore} style={{color:'var(--emerald)'}}>
                  +{Math.round(sorted.reduce((a,i) => a+(i.impactScore||0), 0)*1.2)}
                </div>
                <div className={styles.potLabel}>points if all addressed</div>
                <ProgressBar value={Math.min(100, (s.overall||0)+sorted.reduce((a,i)=>a+(i.impactScore||0),0)*0.6)} label="Projected score" color="var(--emerald)" />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
