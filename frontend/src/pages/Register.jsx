import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/register-form';

export default function Register() {
  return (
    <div className="grid min-h-[calc(100svh-56px)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" aria-label="home" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-foreground">dev</span>
            <span className="text-primary">path</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-background relative hidden lg:block">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)), linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)), linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)), linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)), linear-gradient(60deg, color-mix(in srgb, var(--primary) 77%, transparent) 25%, transparent 25.5%, transparent 75%, color-mix(in srgb, var(--primary) 77%, transparent) 75%, color-mix(in srgb, var(--primary) 77%, transparent)), linear-gradient(60deg, color-mix(in srgb, var(--primary) 77%, transparent) 25%, transparent 25.5%, transparent 75%, color-mix(in srgb, var(--primary) 77%, transparent) 75%, color-mix(in srgb, var(--primary) 77%, transparent))',
            backgroundPosition: '0 0, 0 0, 30px 53px, 30px 53px, 0 0, 30px 53px',
            backgroundSize: '60px 106px',
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}
