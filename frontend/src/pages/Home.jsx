import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const domains = [
  { icon: '🌐', title: 'Web Development',      sub: '6 stages · 6–12 mo',  path: '/roadmaps/web-development',        color: 'text-blue-400',    border: 'hover:border-blue-500/50' },
  { icon: '📊', title: 'Data Science',          sub: '6 stages · 8–14 mo',  path: '/roadmaps/data-science',           color: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
  { icon: '☁️', title: 'Cloud Computing',       sub: '6 stages · 6–10 mo',  path: '/roadmaps/cloud-computing',        color: 'text-violet-400',  border: 'hover:border-violet-500/50' },
  { icon: '🤖', title: 'AI & Machine Learning', sub: '6 stages · 10–18 mo', path: '/roadmaps/artificial-intelligence', color: 'text-amber-400',  border: 'hover:border-amber-500/50' },
  { icon: '🔐', title: 'Cybersecurity',         sub: '6 stages · 8–16 mo',  path: '/roadmaps/cybersecurity',          color: 'text-red-400',     border: 'hover:border-red-500/50' },
];

const features = [
  { icon: '↳', title: 'Structured Paths',  desc: 'Stage-by-stage roadmaps with clear progression.' },
  { icon: '◈', title: 'Curated Resources', desc: 'Verified tutorials, docs, and courses per stage.' },
  { icon: '◉', title: 'Certifications',    desc: 'Direct links to industry-recognised programs.' },
  { icon: '▣', title: 'Progress Tracking', desc: 'Mark stages done and visualise completion rate.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden border-b border-border">

        {/* Dashed grid overlay (from shared component) */}
        <div
          className="absolute inset-0 z-0 opacity-15 dark:opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 0',
            maskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />

        {/* Radial glow at bottom (from shared component) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(125% 125% at 50% 10%, transparent 40%, var(--color-primary) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-24 text-center">
          {/* Live badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Interactive Programming Roadmaps
          </div>

          {/* Main headline */}
          <h1 className="mb-5 text-6xl font-extrabold leading-none tracking-tighter md:text-8xl lg:text-9xl">
            Learn without
            <br />
            <span className="text-primary">Limits.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-md text-sm text-muted-foreground leading-relaxed md:text-base">
            Structured roadmaps, curated resources, and certification guidance —
            consolidated in one developer platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/roadmaps">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold tracking-wide">
                Explore Roadmaps
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-sm font-medium">
                  Get Started Free
                </Button>
              </Link>
            )}
          </div>

          {/* Stat strip */}
          <div className="mt-16 inline-flex items-center gap-5 rounded-lg border border-border bg-card/60 px-6 py-3 text-xs text-muted-foreground backdrop-blur-sm font-mono">
            <span><span className="text-primary font-bold">5</span> domains</span>
            <span className="text-border">│</span>
            <span><span className="text-primary font-bold">30</span> stages</span>
            <span className="text-border">│</span>
            <span><span className="text-primary font-bold">100+</span> resources</span>
            <span className="text-border">│</span>
            <span><span className="text-primary font-bold">free</span></span>
          </div>
        </div>
      </section>

      {/* ── Domains ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">// learning domains</p>
            <h2 className="text-2xl font-bold">Choose your path</h2>
          </div>
          <Link to="/roadmaps">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map(d => (
            <Link key={d.title} to={d.path}>
              <div className={`group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 ${d.border}`}>
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${d.color}`}>{d.title}</div>
                  <div className="text-xs text-muted-foreground">{d.sub}</div>
                </div>
                <span className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors text-xs">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-screen-xl px-6 py-16">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">// why devpath</p>
          <h2 className="mb-8 text-2xl font-bold">Everything in one place</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {features.map(f => (
              <div key={f.title} className="rounded-lg border border-border bg-card/50 p-5">
                <div className="mb-3 font-mono text-lg text-primary">{f.icon}</div>
                <div className="mb-1 text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
