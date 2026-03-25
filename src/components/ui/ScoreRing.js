import React, { useEffect, useState } from 'react';
import styles from './ScoreRing.module.css';

export default function ScoreRing({
  score     = 0,
  size      = 130,
  label     = '',
  color     = 'var(--accent)',
  thickness = 9,
}) {
  const [animScore, setAnimScore] = useState(0);
  const r    = (size - thickness * 2) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    let raf;
    let start   = null;
    const dur   = 1100;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setAnimScore(easeOut(p) * score);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const dash = (animScore / 100) * circ;
  const gap  = circ - dash;
  const cx   = size / 2;
  const cy   = size / 2;

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.value} style={{ color }}>
          {Math.round(animScore)}
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}