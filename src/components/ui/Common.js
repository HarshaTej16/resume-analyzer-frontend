import React from 'react';
import styles from './Common.module.css';

/* ── Badge ─────────────────────────────────────────────── */
export function Badge({ label, color = 'var(--accent)', size = 'md' }) {
  return (
    <span
      className={`${styles.badge} ${styles['badge_' + size]}`}
      style={{ color, background: `${color}1A`, border: `1px solid ${color}33` }}
    >
      {label}
    </span>
  );
}

/* ── Card ──────────────────────────────────────────────── */
export function Card({ children, className = '', glow = false, style = {}, onClick }) {
  return (
    <div
      className={`${styles.card} ${glow ? styles.cardGlow : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── SectionTitle ──────────────────────────────────────── */
export function SectionTitle({ icon, title, subtitle, action }) {
  return (
    <div className={styles.secTitle}>
      <div className={styles.secLeft}>
        {icon && <span className={styles.secIcon}>{icon}</span>}
        <div>
          <h2 className={styles.secH2}>{title}</h2>
          {subtitle && <p className={styles.secSub}>{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ── StatCard ──────────────────────────────────────────── */
export function StatCard({ icon, label, value, color = 'var(--accent)', sub }) {
  return (
    <div className={styles.statCard} style={{ borderColor: `${color}22` }}>
      <div className={styles.statIcon} style={{ background: `${color}15`, color }}>{icon}</div>
      <div className={styles.statBody}>
        <div className={styles.statValue} style={{ color }}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {sub && <div className={styles.statSub}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── SkillTag ──────────────────────────────────────────── */
const CAT_COLORS = {
  LANGUAGE:  'var(--accent)',
  FRAMEWORK: 'var(--emerald)',
  TOOL:      'var(--amber)',
  DATABASE:  '#EC4899',
  CLOUD:     'var(--sky)',
  SOFT:      'var(--violet)',
  OTHER:     'var(--text-dim)',
};

export function SkillTag({ skill }) {
  const color = CAT_COLORS[skill.category] || CAT_COLORS.OTHER;
  return (
    <span
      className={styles.skillTag}
      style={{ color, background: `${color}15`, border: `1px solid ${color}2A` }}
    >
      <span className={styles.skillDot} style={{ background: color }} />
      {skill.name}
    </span>
  );
}

/* ── EmptyState ────────────────────────────────────────── */
export function EmptyState({ icon = '📄', title, description, action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      {description && <p className={styles.emptyDesc}>{description}</p>}
      {action}
    </div>
  );
}

/* ── Spinner ───────────────────────────────────────────── */
export function Spinner({ size = 24, color = 'var(--accent)' }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        animation: 'spin-slow 0.7s linear infinite',
      }}
    />
  );
}