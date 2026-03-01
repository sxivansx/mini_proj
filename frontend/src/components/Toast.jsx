import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={cn(
      'fixed bottom-5 right-5 z-[9999] flex items-center gap-3',
      'rounded-lg border bg-card px-4 py-3 text-sm shadow-xl',
      'animate-in slide-in-from-right-full duration-300',
      type === 'success' ? 'border-primary/40 text-foreground' : 'border-destructive/40 text-foreground'
    )}>
      <span className={type === 'success' ? 'text-primary' : 'text-destructive'}>
        {type === 'success' ? '●' : '✕'}
      </span>
      {message}
    </div>
  );
}
