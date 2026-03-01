import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🗺️', title: 'Structured Roadmaps', desc: 'Visual, step-by-step learning paths for 5 major tech domains.' },
  { icon: '📚', title: 'Curated Resources', desc: 'Verified tutorials, docs, and courses linked at each stage.' },
  { icon: '🏆', title: 'Certification Guidance', desc: 'Direct links to globally recognised certification programs.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Mark stages complete and visualise your learning journey.' },
  { icon: '🎯', title: 'Personalised Dashboard', desc: 'See your progress across all domains at a glance.' },
  { icon: '📱', title: 'Responsive Design', desc: 'Learn on any device — desktop, tablet, or mobile.' },
];

const domains = [
  { icon: '🌐', title: 'Web Development', color: '#3B82F6', path: '/roadmaps/web-development' },
  { icon: '📊', title: 'Data Science', color: '#10B981', path: '/roadmaps/data-science' },
  { icon: '☁️', title: 'Cloud Computing', color: '#8B5CF6', path: '/roadmaps/cloud-computing' },
  { icon: '🤖', title: 'Artificial Intelligence', color: '#F59E0B', path: '/roadmaps/artificial-intelligence' },
  { icon: '🔐', title: 'Cybersecurity', color: '#EF4444', path: '/roadmaps/cybersecurity' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Your Guided Path to<br />Tech Mastery</h1>
          <p>
            DevPath provides structured programming roadmaps, curated learning resources,
            and certification guidance — all in one platform.
          </p>
          <div className="hero-btns">
            <Link to="/roadmaps" className="btn btn-primary btn-lg">Explore Roadmaps</Link>
            {!user && <Link to="/register" className="btn btn-outline btn-lg">Sign Up Free</Link>}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="page" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Learning Domains</h2>
          <p className="section-subtitle">Choose your path and start learning today</p>
          <div className="cards-grid">
            {domains.map(d => (
              <Link
                key={d.title}
                to={d.path}
                className="roadmap-card"
                style={{ '--card-color': d.color }}
              >
                <span className="roadmap-card-icon">{d.icon}</span>
                <div className="roadmap-card-title">{d.title}</div>
              </Link>
            ))}
          </div>

          {/* Features */}
          <h2 className="section-title" style={{ marginTop: 60 }}>Why DevPath?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} className="roadmap-card" style={{ cursor: 'default' }}>
                <span style={{ fontSize: 28, marginBottom: 12, display: 'block' }}>{f.icon}</span>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 14 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
