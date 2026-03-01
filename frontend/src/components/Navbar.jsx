import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Sun, Moon, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Roadmaps', path: '/roadmaps' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={close}>
          <span className="text-foreground">dev</span>
          <span className="text-primary">path</span>
          <span className="ml-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            beta
          </span>
        </Link>

        <Separator orientation="vertical" className="h-5 hidden md:block" />

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground',
                  pathname.startsWith(l.path) && 'text-foreground'
                )}
              >
                {l.label}
              </Button>
            </Link>
          ))}
          {user && (
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground',
                  pathname === '/dashboard' && 'text-foreground'
                )}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle — always visible */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground">{user.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs border-border"
                  onClick={() => { logout(); navigate('/'); }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-8 px-3 text-xs">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-1">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} onClick={close}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground',
                  pathname.startsWith(l.path) && 'text-foreground'
                )}
              >
                {l.label}
              </Button>
            </Link>
          ))}
          {user && (
            <Link to="/dashboard" onClick={close}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground',
                  pathname === '/dashboard' && 'text-foreground'
                )}
              >
                Dashboard
              </Button>
            </Link>
          )}

          <Separator className="my-2" />

          {user ? (
            <>
              <p className="px-3 pb-1 text-xs text-muted-foreground">{user.name}</p>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full text-xs border-border"
                onClick={() => { logout(); navigate('/'); close(); }}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="flex-1" onClick={close}>
                <Button variant="ghost" size="sm" className="w-full h-9 text-xs text-muted-foreground hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={close}>
                <Button size="sm" className="w-full h-9 text-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
