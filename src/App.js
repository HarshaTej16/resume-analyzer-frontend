import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Layout from './components/layout/Layout';

import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import UploadPage    from './pages/UploadPage';
import AnalyzingPage from './pages/AnalyzingPage';
import ResultsPage   from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import JobMatchPage  from './pages/JobMatchPage';

import './index.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-mid)',
        fontFamily: 'var(--font-body)'
      }}>
        Loading…
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnalysisProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/"      element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes inside sidebar layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/upload"    element={<UploadPage />} />
              <Route path="/analyzing" element={<AnalyzingPage />} />
              <Route path="/results"   element={<ResultsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/job-match" element={<JobMatchPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnalysisProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}