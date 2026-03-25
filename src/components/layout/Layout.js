import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '⬡', label: 'Dashboard'  },
  { path: '/upload',    icon: '⬆', label: 'Upload'     },
  { path: '/results',   icon: '◈', label: 'Results'    },
  { path: '/job-match', icon: '◎', label: 'Job Match'  },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      <aside className={styles.sidebar}>

        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.logoMark}>RA</div>
          {!collapsed && <span className={styles.logoText}>ResumeAI</span>}
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed ? '›' : '‹'}
        </button>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              {!collapsed && <span className={styles.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userFooter}>
          <div className={styles.avatar}>{initials}</div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user?.fullName || 'User'}
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}