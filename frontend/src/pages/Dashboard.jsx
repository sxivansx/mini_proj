import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/Skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const colorClasses = {
  '#3B82F6': { text: 'text-blue-400', border: 'hover:border-blue-500/40', progress: '[&>div]:bg-blue-400' },
  '#10B981': { text: 'text-emerald-400', border: 'hover:border-emerald-500/40', progress: '[&>div]:bg-emerald-400' },
  '#8B5CF6': { text: 'text-violet-400', border: 'hover:border-violet-500/40', progress: '[&>div]:bg-violet-400' },
  '#F59E0B': { text: 'text-amber-400', border: 'hover:border-amber-500/40', progress: '[&>div]:bg-amber-400' },
  '#EF4444': { text: 'text-red-400', border: 'hover:border-red-500/40', progress: '[&>div]:bg-red-400' },
};

// Parse "6-12 months" → average weeks
function parseDurationWeeks(duration) {
  if (!duration) return null;
  const nums = duration.match(/\d+/g);
  if (!nums) return null;
  const months = nums.length === 1 ? +nums[0] : (+nums[0] + +nums[1]) / 2;
  return Math.round(months * 4.33);
}

// Build a 52-week grid of dates (364 days back from today)
function buildWeekGrid() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Start from Sunday of the week 52 weeks ago
  const start = new Date(today);
  start.setDate(start.getDate() - 363);
  // Shift to the nearest preceding Sunday
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let d = new Date(start);
  while (d <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// Map count to Tailwind bg class
function activityColor(count) {
  if (!count) return 'bg-border/50';
  if (count === 1) return 'bg-primary/30';
  if (count === 2) return 'bg-primary/55';
  if (count === 3) return 'bg-primary/75';
  return 'bg-primary';
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([
      api.get('/progress'),
      api.get('/progress/activity'),
    ]).then(([prog, act]) => {
      setProgress(prog.data);
      setActivity(act.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, navigate]);

  const weekGrid = useMemo(() => buildWeekGrid(), []);

  // Month label positions: find first week of each month
  const monthLabels = useMemo(() => {
    const labels = [];
    weekGrid.forEach((week, wi) => {
      const firstDay = week[0];
      if (wi === 0 || firstDay.getDate() <= 7) {
        // Only show if this week contains the 1st of a month
        const hasFirst = week.some(d => d.getDate() === 1);
        if (hasFirst || wi === 0) {
          const d = week.find(d => d.getDate() === 1) || week[0];
          labels.push({ wi, label: MONTH_ABBR[d.getMonth()] });
        }
      }
    });
    return labels;
  }, [weekGrid]);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <div className="mb-8">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-8 w-40 mb-3" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full mb-8" />
        <Skeleton className="h-28 w-full rounded-xl mb-8" />
        <Skeleton className="h-px w-full mb-8" />
        <div className="mb-6">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-44" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-1 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalStages = progress.reduce((s, r) => s + r.totalStages, 0);
  const totalCompleted = progress.reduce((s, r) => s + r.completedStages, 0);
  const overallPct = totalStages > 0 ? Math.round((totalCompleted / totalStages) * 100) : 0;
  const activeRoadmaps = progress.filter(r => r.completedStages > 0).length;
  const totalActivityDays = Object.keys(activity).length;

  const stats = [
    { label: 'Overall Progress', value: `${overallPct}%` },
    { label: 'Stages Completed', value: totalCompleted },
    { label: 'Active Roadmaps', value: activeRoadmaps },
    { label: 'Active Days', value: totalActivityDays },
  ];

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">// dashboard</p>
          <h1 className="text-2xl font-bold text-foreground">
            {user?.name?.split(' ')[0]}
          </h1>
          {user?.goal && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              <span className="opacity-60">goal:</span> {user.goal}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className="text-2xl font-bold text-foreground font-mono">{s.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Activity Heatmap */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">// activity</p>
          <h2 className="text-lg font-bold text-foreground mb-4">Last 52 weeks</h2>

          <div className="rounded-xl border border-border bg-card p-5 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[3px] mr-1 pt-5">
                {DAY_LABELS.map((d, i) => (
                  <div key={i} className="h-[11px] text-[9px] text-muted-foreground/60 leading-none w-3 text-right">
                    {i % 2 === 1 ? d : ''}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              <div className="flex flex-col">
                {/* Month labels row */}
                <div className="flex gap-[3px] mb-1 h-4 relative">
                  {weekGrid.map((week, wi) => {
                    const label = monthLabels.find(m => m.wi === wi);
                    return (
                      <div key={wi} className="w-[11px] relative">
                        {label && (
                          <span className="absolute text-[9px] text-muted-foreground/70 whitespace-nowrap">
                            {label.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Grid rows by day-of-week */}
                <div className="flex gap-[3px]">
                  {weekGrid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => {
                        const key = day.toISOString().slice(0, 10);
                        const count = activity[key] || 0;
                        const isFuture = day > new Date();
                        return (
                          <div
                            key={di}
                            title={count ? `${key}: ${count} stage${count > 1 ? 's' : ''} completed` : key}
                            className={cn(
                              'h-[11px] w-[11px] rounded-[2px] transition-colors',
                              isFuture ? 'opacity-0 pointer-events-none' : activityColor(count)
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[9px] text-muted-foreground/60">Less</span>
              {[0, 1, 2, 3, 4].map(n => (
                <div key={n} className={cn('h-[11px] w-[11px] rounded-[2px]', activityColor(n))} />
              ))}
              <span className="text-[9px] text-muted-foreground/60">More</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Progress breakdown */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">// progress</p>
          <h2 className="text-lg font-bold text-foreground">Roadmap breakdown</h2>
        </div>

        {totalCompleted === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="text-4xl mb-4">⟳</div>
            <h3 className="text-base font-semibold text-foreground mb-2">Nothing tracked yet</h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">
              Pick a roadmap and mark stages complete — your progress will appear here.
            </p>
            <Link to="/roadmaps">
              <Button size="sm" className="text-xs">Browse Roadmaps →</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {progress.map(rm => {
              const c = colorClasses[rm.color] || { text: 'text-primary', border: 'hover:border-primary/40', progress: '[&>div]:bg-primary' };
              const totalWeeks = parseDurationWeeks(rm.duration);
              const stagesLeft = rm.totalStages - rm.completedStages;
              const weeksLeft = (totalWeeks && stagesLeft > 0)
                ? Math.max(1, Math.round((stagesLeft / rm.totalStages) * totalWeeks))
                : null;

              return (
                <Link key={rm.roadmapId} to={`/roadmaps/${rm.roadmapId}`}>
                  <div className={cn(
                    'group rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5',
                    c.border
                  )}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{rm.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-sm font-semibold truncate', c.text)}>{rm.title}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {rm.completedStages}/{rm.totalStages} stages
                          {weeksLeft !== null && (
                            <span className="ml-2 text-amber-400/80">· ~{weeksLeft}w left</span>
                          )}
                        </div>
                      </div>
                      <span className={cn('text-xl font-bold font-mono', c.text)}>{rm.percentage}%</span>
                    </div>
                    <Progress
                      value={rm.percentage}
                      className={cn('h-1 bg-border', c.progress)}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
