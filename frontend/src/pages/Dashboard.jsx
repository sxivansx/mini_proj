import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/progress')
      .then(r => { setProgress(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  const totalStages = progress.reduce((s, r) => s + r.totalStages, 0);
  const totalCompleted = progress.reduce((s, r) => s + r.completedStages, 0);
  const overallPct = totalStages > 0 ? Math.round((totalCompleted / totalStages) * 100) : 0;
  const activeRoadmaps = progress.filter(r => r.completedStages > 0).length;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>{user?.goal ? `Goal: ${user.goal}` : 'Track your learning progress across all roadmaps.'}</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{overallPct}%</div>
            <div className="stat-label">Overall Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Stages Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeRoadmaps}</div>
            <div className="stat-label">Active Roadmaps</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{progress.length}</div>
            <div className="stat-label">Total Roadmaps</div>
          </div>
        </div>

        {/* Progress breakdown */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Roadmap Progress</h2>
        <div className="progress-cards">
          {progress.map(rm => (
            <Link
              key={rm.roadmapId}
              to={`/roadmaps/${rm.roadmapId}`}
              className="progress-card"
              style={{ '--card-color': rm.color, borderTopColor: rm.color, borderTopWidth: 3, borderTopStyle: 'solid' }}
            >
              <div className="pc-header">
                <span className="pc-icon">{rm.icon}</span>
                <div>
                  <div className="pc-title">{rm.title}</div>
                  <div className="pc-count">{rm.completedStages}/{rm.totalStages} stages</div>
                </div>
              </div>
              <div className="pc-pct" style={{ color: rm.color }}>{rm.percentage}%</div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${rm.percentage}%`, background: rm.color }} />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        {totalCompleted === 0 && (
          <div style={{ textAlign: 'center', marginTop: 40, padding: 40, background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Start Your Journey</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
              Pick a roadmap and start marking stages as complete to track your progress here.
            </p>
            <Link to="/roadmaps" className="btn btn-primary">Browse Roadmaps</Link>
          </div>
        )}
      </div>
    </div>
  );
}
