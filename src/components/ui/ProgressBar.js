import React, { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({
  value   = 0,
  label   = '',
  color   = 'var(--accent)',
  delay   = 0,
  showPct = true,
  height  = 6,
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className={styles.wrap}>
      {(label || showPct) && (
        <div className={styles.header}>
          {label   && <span className={styles.label}>{label}</span>}
          {showPct && <span className={styles.pct} style={{ color }}>{value}%</span>}
        </div>
      )}
      <div className={styles.track} style={{ height }}>
        <div
          className={styles.bar}
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 8px ${color}80`,
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
}