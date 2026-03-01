import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../components/Skeleton';

const colorMap = {
  'web-development': { text: 'text-blue-400', border: 'hover:border-blue-500/50', glow: 'group-hover:bg-blue-500/5' },
  'data-science': { text: 'text-emerald-400', border: 'hover:border-emerald-500/50', glow: 'group-hover:bg-emerald-500/5' },
  'cloud-computing': { text: 'text-violet-400', border: 'hover:border-violet-500/50', glow: 'group-hover:bg-violet-500/5' },
  'artificial-intelligence': { text: 'text-amber-400', border: 'hover:border-amber-500/50', glow: 'group-hover:bg-amber-500/5' },
  'cybersecurity': { text: 'text-red-400', border: 'hover:border-red-500/50', glow: 'group-hover:bg-red-500/5' },
};

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/roadmaps').then(r => { setRoadmaps(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="mb-10">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-8 w-56 mb-3" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-5 w-36" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            // roadmaps
          </p>
          <h1 className="text-3xl font-bold text-foreground">Programming Roadmaps</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Choose a domain and follow a structured, stage-by-stage learning path with curated resources and certifications.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map(rm => {
            const c = colorMap[rm.id] || { text: 'text-primary', border: 'hover:border-primary/50', glow: '' };
            return (
              <Link key={rm.id} to={`/roadmaps/${rm.id}`}>
                <div className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 ${c.border}`}>
                  <div className={`absolute inset-0 transition-colors duration-300 ${c.glow}`} />
                  <div className="relative">
                    <span className="text-3xl mb-4 block">{rm.icon}</span>
                    <h3 className={`text-base font-bold mb-2 ${c.text}`}>{rm.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                      {rm.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono px-2">
                        {rm.level}
                      </Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono px-2">
                        {rm.duration}
                      </Badge>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                      View roadmap →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
