import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const TYPE_ICONS = {
  documentation: '📄', course: '🎓', tutorial: '🛠️',
  video: '🎬', book: '📖', tool: '🔧'
};

export default function RoadmapDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/roadmaps/${id}`),
      user ? api.get(`/progress/${id}`) : Promise.resolve({ data: { completedStages: [] } })
    ]).then(([rm, prog]) => {
      setRoadmap(rm.data);
      setCompleted(prog.data.completedStages || []);
      setSelected(rm.data.stages[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, user]);

  const toggleComplete = useCallback(async (stage) => {
    if (!user) { navigate('/login'); return; }
    const isDone = completed.includes(stage.id);
    try {
      let res;
      if (isDone) {
        res = await api.delete(`/progress/${id}/${stage.id}`);
        setToast({ message: `"${stage.title}" marked incomplete`, type: 'success' });
      } else {
        res = await api.post(`/progress/${id}/${stage.id}`);
        setToast({ message: `"${stage.title}" completed! 🎉`, type: 'success' });
      }
      setCompleted(res.data.completedStages);
    } catch {
      setToast({ message: 'Failed to update progress', type: 'error' });
    }
  }, [completed, id, user, navigate]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!roadmap) return <div className="page"><div className="container"><p>Roadmap not found.</p></div></div>;

  const pct = Math.round((completed.length / roadmap.stages.length) * 100);

  return (
    <div className="page">
      <div className="container">
        <Link to="/roadmaps" className="back-link">← Back to Roadmaps</Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 40 }}>{roadmap.icon}</span>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>{roadmap.title}</h1>
              <div style={{ color: 'var(--text2)', fontSize: 14, marginTop: 2 }}>{roadmap.description}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span className="roadmap-card-tag">⏱ {roadmap.duration}</span>
            <span className="roadmap-card-tag">📊 {roadmap.level}</span>
            <span className="roadmap-card-tag">📌 {roadmap.stages.length} stages</span>
            {user && (
              <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text2)' }}>
                {completed.length}/{roadmap.stages.length} completed ({pct}%)
              </span>
            )}
          </div>
          {user && (
            <div className="progress-bar" style={{ marginTop: 12 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: roadmap.color }} />
            </div>
          )}
        </div>

        <div className="roadmap-detail">
          {/* Stages */}
          <div>
            <div className="stages-list">
              {roadmap.stages.map((stage, i) => {
                const isDone = completed.includes(stage.id);
                const isSelected = selected?.id === stage.id;
                const isLast = i === roadmap.stages.length - 1;
                const prevDone = i === 0 || completed.includes(roadmap.stages[i - 1].id);

                return (
                  <div key={stage.id} className="stage-item">
                    <div className="stage-connector">
                      <div
                        className={`stage-dot ${isDone ? 'completed' : isSelected ? 'selected' : 'default'}`}
                        onClick={() => setSelected(stage)}
                      >
                        {isDone ? '✓' : stage.order}
                      </div>
                      {!isLast && (
                        <div className={`stage-line ${isDone ? 'done' : ''}`} />
                      )}
                    </div>
                    <div className="stage-content">
                      <div
                        className={`stage-card ${isSelected ? 'selected' : ''} ${isDone ? 'completed' : ''}`}
                        onClick={() => setSelected(stage)}
                      >
                        <div className="stage-card-top">
                          <span className="stage-card-title">{stage.title}</span>
                          {isDone && <span className="check-icon">✓</span>}
                        </div>
                        <div className="stage-card-desc">{stage.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resource Panel */}
          <div>
            {!selected ? (
              <div className="resource-panel">
                <div className="resource-panel-empty">
                  <div className="rpe-icon">👆</div>
                  <p>Select a stage to view resources and certifications</p>
                </div>
              </div>
            ) : (
              <div className="resource-panel">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{selected.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                  {selected.description}
                </p>

                {/* Complete button */}
                <button
                  className={`complete-btn ${completed.includes(selected.id) ? 'done' : 'todo'}`}
                  onClick={() => toggleComplete(selected)}
                >
                  {completed.includes(selected.id) ? '✓ Completed — Click to undo' : '○ Mark as Complete'}
                </button>

                {/* Resources */}
                {selected.resources?.length > 0 && (
                  <div className="panel-section">
                    <div className="panel-section-title">Learning Resources</div>
                    {selected.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-item">
                        <span className="resource-item-icon">{TYPE_ICONS[r.type] || '🔗'}</span>
                        <div className="resource-item-body">
                          <div className="resource-item-title">{r.title}</div>
                          <div className="resource-item-type">{r.type}</div>
                        </div>
                        <span className="resource-item-arrow">↗</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {selected.certifications?.length > 0 && (
                  <div className="panel-section">
                    <div className="panel-section-title">Certifications</div>
                    {selected.certifications.map((c, i) => (
                      <div key={i} className="cert-item">
                        <div className="cert-item-top">
                          <div>
                            <div className="cert-item-name">{c.title}</div>
                            <div className="cert-item-provider">{c.provider}</div>
                          </div>
                          <span className={`badge ${c.free ? 'badge-free' : 'badge-paid'}`}>
                            {c.free ? 'Free' : 'Paid'}
                          </span>
                        </div>
                        <a href={c.url} target="_blank" rel="noopener noreferrer">View Certification →</a>
                      </div>
                    ))}
                  </div>
                )}

                {!user && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text2)', fontSize: 13 }}>
                    <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link> to track your progress
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
