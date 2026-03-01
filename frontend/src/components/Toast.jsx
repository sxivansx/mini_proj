import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icon = type === 'success' ? '✓' : '✕';
  return (
    <div className={`toast ${type}`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
