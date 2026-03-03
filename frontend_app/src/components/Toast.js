import React, { useEffect } from 'react';
import { useStore } from '../state/store';

// PUBLIC_INTERFACE
export function Toast() {
  /** This is a public function. */
  const { state, actions } = useStore();
  const toast = state.ui.toast;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => actions.clearToast(), 2200);
    return () => clearTimeout(t);
  }, [toast, actions]);

  if (!toast) return null;

  const bg = toast.kind === 'success'
    ? 'rgba(245, 158, 11, 0.20)'
    : 'rgba(239, 68, 68, 0.18)';

  const border = toast.kind === 'success'
    ? 'rgba(245, 158, 11, 0.35)'
    : 'rgba(239, 68, 68, 0.28)';

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60
    }}>
      <div className="kv-card" style={{
        padding: '10px 12px',
        borderRadius: 14,
        background: bg,
        borderColor: border,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ fontWeight: 800 }}>{toast.message}</div>
      </div>
    </div>
  );
}
