import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Toast from '../components/Toast';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  documentation: '📄', course: '🎓', tutorial: '🛠️',
  video: '🎬', book: '📖', tool: '🔧',
};

// Parse "6-12 months" or "3 months" → average weeks
function parseDurationWeeks(duration) {
  if (!duration) return null;
  const nums = duration.match(/\d+/g);
  if (!nums) return null;
  const months = nums.length === 1 ? +nums[0] : (+nums[0] + +nums[1]) / 2;
  return Math.round(months * 4.33);
}

export default function RoadmapDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [notes, setNotes] = useState({});       // { stageId: noteText }
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const noteTimerRef = useRef(null);

  useEffect(() => {
    const progressReq = user
      ? api.get(`/progress/${id}`)
      : Promise.resolve({ data: { completedStages: [] } });
    const notesReq = user
      ? api.get(`/notes/${id}`)
      : Promise.resolve({ data: {} });

    Promise.all([api.get(`/roadmaps/${id}`), progressReq, notesReq])
      .then(([rm, prog, notesRes]) => {
        setRoadmap(rm.data);
        setCompleted(prog.data.completedStages || []);
        setNotes(notesRes.data || {});
        setSelected(rm.data.stages[0]);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [id, user]);

  const toggleComplete = useCallback(async (stage) => {
    if (!user) { navigate('/login'); return; }
    const isDone = completed.includes(stage.id);
    try {
      const res = isDone
        ? await api.delete(`/progress/${id}/${stage.id}`)
        : await api.post(`/progress/${id}/${stage.id}`);
      setCompleted(res.data.completedStages);
      setToast({ message: isDone ? 'Marked incomplete' : 'Stage complete! ✓', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update progress', type: 'error' });
    }
  }, [completed, id, user, navigate]);

  // Debounce-save note — fires 1 s after last keystroke
  const handleNoteChange = useCallback((stageId, value) => {
    setNotes(prev => ({ ...prev, [stageId]: value }));
    clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(async () => {
      setSavingNote(true);
      try {
        await api.put(`/notes/${id}/${stageId}`, { note: value });
      } catch {
        setToast({ message: 'Failed to save note', type: 'error' });
      } finally {
        setSavingNote(false);
      }
    }, 1000);
  }, [id]);

  // Compute estimated weeks remaining
  const weeksLeft = (() => {
    if (!roadmap || !user || completed.length === roadmap.stages.length) return null;
    const totalWeeks = parseDurationWeeks(roadmap.duration);
    if (!totalWeeks) return null;
    const stagesLeft = roadmap.stages.length - completed.length;
    return Math.max(1, Math.round((stagesLeft / roadmap.stages.length) * totalWeeks));
  })();

  if (loading) {
    return (
      <div className=" flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }
  if (!roadmap) {
    return (
      <div className=" mx-auto max-w-screen-xl px-6 py-12">
        <p className="text-muted-foreground">Roadmap not found.</p>
      </div>
    );
  }

  const pct = Math.round((completed.length / roadmap.stages.length) * 100);

  return (
    <div className="">
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        {/* Back */}
        <Link to="/roadmaps" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          ← Roadmaps
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl">{roadmap.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">{roadmap.title}</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">{roadmap.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              {roadmap.level}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              {roadmap.duration}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              {roadmap.stages.length} stages
            </Badge>
            {weeksLeft !== null && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 font-mono text-[10px]">
                ~{weeksLeft}w left
              </Badge>
            )}
            {user && (
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {completed.length}/{roadmap.stages.length} · {pct}%
              </span>
            )}
          </div>
          {user && (
            <Progress value={pct} className="h-1 bg-border" />
          )}
        </div>

        <Separator className="mb-8" />

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Stages */}
          <div className="space-y-2">
            {roadmap.stages.map((stage, i) => {
              const isDone = completed.includes(stage.id);
              const isSelected = selected?.id === stage.id;
              const isLast = i === roadmap.stages.length - 1;

              return (
                <div key={stage.id} className="flex gap-4">
                  {/* Connector */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setSelected(stage)}
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-200',
                        isDone && 'border-primary bg-primary text-primary-foreground',
                        isSelected && !isDone && 'border-primary text-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]',
                        !isSelected && !isDone && 'border-border bg-card text-muted-foreground hover:border-primary/50',
                      )}
                    >
                      {isDone ? '✓' : stage.order}
                    </button>
                    {!isLast && (
                      <div className={cn('mt-1 w-px flex-1 min-h-4', isDone ? 'bg-primary/40' : 'bg-border')} />
                    )}
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-3">
                    <button
                      onClick={() => setSelected(stage)}
                      className={cn(
                        'w-full text-left rounded-lg border bg-card p-4 transition-all duration-200 hover:border-primary/40',
                        isSelected && 'border-primary/50 bg-primary/5',
                        isDone && !isSelected && 'border-primary/20',
                        !isSelected && !isDone && 'border-border',
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-sm font-semibold text-foreground">{stage.title}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {stage.estimatedHours && (
                            <span className="text-[10px] font-mono text-muted-foreground/60">⏱ {stage.estimatedHours}h</span>
                          )}
                          {isDone && <span className="text-primary text-sm">✓</span>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resource panel */}
          <div className="lg:sticky lg:top-20">
            {!selected ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
                <span className="mb-3 text-3xl opacity-30">◈</span>
                <p className="text-xs text-muted-foreground">Select a stage to view resources</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Panel header */}
                <div className="border-b border-border bg-muted/20 px-5 py-4">
                  <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    stage {selected.order}/{roadmap.stages.length}
                  </div>
                  <div className="text-sm font-bold text-foreground">{selected.title}</div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Complete button */}
                  <Button
                    variant={completed.includes(selected.id) ? 'outline' : 'default'}
                    className={cn(
                      'w-full text-xs font-semibold h-9',
                      completed.includes(selected.id) && 'border-primary/30 text-primary hover:bg-primary/5'
                    )}
                    onClick={() => toggleComplete(selected)}
                  >
                    {completed.includes(selected.id) ? '✓ Completed — Click to undo' : '○ Mark as Complete'}
                  </Button>

                  {/* Estimated hours */}
                  {selected.estimatedHours && (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                      <span className="text-primary text-xs font-mono">⏱</span>
                      <span className="text-xs text-muted-foreground">
                        Estimated{' '}
                        <span className="text-foreground font-semibold">{selected.estimatedHours}h</span>{' '}
                        to complete this stage
                      </span>
                    </div>
                  )}

                  {/* Topics */}
                  {selected.topics?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        What you'll learn
                      </p>
                      <ul className="space-y-1.5">
                        {selected.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                            <span className="mt-0.5 flex-shrink-0 text-primary font-mono leading-none">▸</span>
                            <span className="leading-relaxed">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Practice Projects */}
                  {selected.projects?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Practice Projects
                      </p>
                      <div className="space-y-2">
                        {selected.projects.map((p, i) => (
                          <div key={i} className="rounded-md border border-border bg-background px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] text-primary font-mono font-bold">#{i + 1}</span>
                              <span className="text-xs font-semibold text-foreground">{p.title}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stage Notes */}
                  {user && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Notes
                        </p>
                        {savingNote && (
                          <span className="text-[9px] text-muted-foreground animate-pulse">saving…</span>
                        )}
                      </div>
                      <textarea
                        value={notes[selected.id] || ''}
                        onChange={e => handleNoteChange(selected.id, e.target.value)}
                        placeholder="Your notes for this stage…"
                        rows={4}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  )}

                  {/* Resources */}
                  {selected.resources?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Resources
                      </p>
                      <div className="space-y-1.5">
                        {selected.resources.map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
                          >
                            <span className="flex-shrink-0">{TYPE_ICONS[r.type] || '🔗'}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{r.title}</div>
                              <div className="text-muted-foreground text-[10px] capitalize">{r.type}</div>
                            </div>
                            <span className="text-muted-foreground/40 flex-shrink-0">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {selected.certifications?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Certifications
                      </p>
                      <div className="space-y-2">
                        {selected.certifications.map((c, i) => (
                          <div key={i} className="rounded-md border border-border bg-background p-3">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="text-xs font-semibold text-foreground leading-snug">{c.title}</div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'flex-shrink-0 text-[9px] font-bold tracking-wider px-1.5',
                                  c.free
                                    ? 'border-emerald-500/30 text-emerald-400'
                                    : 'border-primary/30 text-primary'
                                )}
                              >
                                {c.free ? 'FREE' : 'PAID'}
                              </Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground mb-2">{c.provider}</div>
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline underline-offset-2"
                            >
                              View certification →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!user && (
                    <p className="text-center text-[10px] text-muted-foreground pt-1">
                      <Link to="/login" className="text-primary hover:underline underline-offset-2">Sign in</Link>
                      {' '}to track your progress
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
