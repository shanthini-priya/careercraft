import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

const TOAST_STYLES = {
  success: { bg: '#0A2B1D', border: '#10B981', text: '#6EE7B7', icon: '✓' },
  error: { bg: '#2B0A0A', border: '#EF4444', text: '#FCA5A5', icon: '✕' },
  info: { bg: '#0B1F3A', border: '#3B82F6', text: '#93C5FD', icon: 'ℹ' },
  warning: { bg: '#2B200A', border: '#F59E0B', text: '#FCD34D', icon: '⚠' },
};

const STYLE_ID = 'portfolioai-toast-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes portfolioai-toast-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes portfolioai-toast-out {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function ToastItem({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  const handleClick = useCallback(() => {
    onRemove(toast.id);
  }, [toast.id, onRemove]);

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        minWidth: 280,
        maxWidth: 400,
        animation: 'portfolioai-toast-in 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>{s.icon}</span>
      <span style={{ flex: 1, fontSize: 14, color: s.text, lineHeight: 1.5 }}>
        {toast.message}
      </span>
      <button
        onClick={handleClick}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 16,
          color: s.text,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    injectKeyframes();
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type, duration) => addToast(message, type, duration),
    [addToast]
  );

  toast.success = (msg, dur) => addToast(msg, 'success', dur);
  toast.error = (msg, dur) => addToast(msg, 'error', dur);
  toast.info = (msg, dur) => addToast(msg, 'info', dur);
  toast.warning = (msg, dur) => addToast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
