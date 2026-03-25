import React from 'react';
import styles from './LandingPage.module.css';

const FEATURES = [
  { icon: '◈', title: '6-Dimension Scoring',  desc: 'Skills, Experience, Education, Formatting, Keywords & ATS scored individually.' },
  { icon: '⬡', title: 'Smart Parsing',        desc: 'Our engine extracts work history, education and skills automatically.' },
  { icon: '◎', title: 'Job Match Analysis',   desc: 'Paste any job description and instantly see your fit percentage.' },
  { icon: '⬆', title: 'Smart Suggestions',    desc: 'Prioritized action items ranked by score impact.' },
  { icon: '▣', title: 'ATS Compatibility',    desc: 'Check if your resume passes automated tracking systems.' },
  { icon: '◉', title: 'History Tracking',     desc: 'All your past analyses saved to your account.' },
];

const LEVELS = [
  { level: 'ENTRY',  range: '0-49',   color: 'var(--text-dim)' },
  { level: 'JUNIOR', range: '50-64',  color: 'var(--amber)'    },
  { level: 'MID',    range: '65-74',  color: 'var(--emerald)'  },
  { level: 'SENIOR', range: '75-84',  color: 'var(--accent)'   },
  { level: 'EXPERT', range: '85-100', color: 'var(--pink)'     },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />

      {/* Navbar */}
      <header className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoMark}>RA</div>
          <span>ResumeAI</span>
        </div>
        <div className={styles.navLinks}>
          <a href="/login" className={styles.btnGhost}>Sign In</a>
          <a href="/login" className={styles.btnAccent}>Get Started →</a>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.dot} />
          Spring Boot + React + MySQL
        </div>

        <h1 className={styles.heroTitle}>
          Know Your Resume<br />
          <span className={styles.heroGrad}>Score Before They Do</span>
        </h1>

        <p className={styles.heroSub}>
          Upload your resume and get an instant readiness score, actionable
          improvements, and a job-fit analysis — all processed on our server
          with no external APIs.
        </p>

        <div className={styles.heroCtas}>
          <a href="/login" className={styles.btnAccent}>Analyse My Resume →</a>
          <a href="/login" className={styles.btnGhost}>Sign In</a>
        </div>

        <div className={styles.levelBadges}>
          {LEVELS.map(({ level, range, color }) => (
            <div
              key={level}
              className={styles.levelBadge}
              style={{ borderColor: `${color}44` }}
            >
              <span style={{ color, fontFamily: 'monospace', fontWeight: 700, fontSize: 11 }}>
                {level}
              </span>
              <span style={{ color: 'var(--text-mid)', fontSize: 11 }}>
                {range}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{icon}</div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaTitle}>Ready to land your next role?</h2>
        <p className={styles.ctaSub}>Create a free account to get started.</p>
        <a href="/login" className={styles.btnAccent}>Get Started Now →</a>
      </section>
    </div>
  );
}