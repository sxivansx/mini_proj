import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const goals = [
  'Get a job in tech',
  'Switch careers',
  'Freelancing / side projects',
  'Personal interest / learning',
  'Improve current skills',
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', goal: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = f => e => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-[calc(100dvh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">// auth</p>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start your guided learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Full Name</Label>
            <Input placeholder="Ishaan Saxena" required value={form.name} onChange={set('name')}
              className="bg-background border-border text-sm font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')}
              className="bg-background border-border text-sm font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Password</Label>
            <Input type="password" placeholder="Min. 6 characters" required value={form.password} onChange={set('password')}
              className="bg-background border-border text-sm font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Learning Goal (optional)</Label>
            <select
              value={form.goal}
              onChange={set('goal')}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select a goal…</option>
              {goals.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full text-sm" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
