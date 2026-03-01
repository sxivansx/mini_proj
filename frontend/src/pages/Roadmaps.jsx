import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const TYPE_ICONS = { documentation: '📄', course: '🎓', tutorial: '🛠️', video: '🎬', book: '📖', tool: '🔧' };

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/roadmaps').then(r => { setRoadmaps(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Programming Roadmaps</h1>
          <p>Choose a domain and follow a structured, stage-by-stage learning path.</p>
        </div>
        <div className="cards-grid">
          {roadmaps.map(rm => (
            <Link
              key={rm.id}
              to={`/roadmaps/${rm.id}`}
              className="roadmap-card"
              style={{ '--card-color': rm.color }}
            >
              <span className="roadmap-card-icon">{rm.icon}</span>
              <div className="roadmap-card-title">{rm.title}</div>
              <div className="roadmap-card-desc">{rm.description}</div>
              <div className="roadmap-card-meta">
                <span className="roadmap-card-tag">⏱ {rm.duration}</span>
                <span className="roadmap-card-tag">📊 {rm.level}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
