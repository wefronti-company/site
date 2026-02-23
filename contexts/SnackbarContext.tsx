import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export type SnackbarVariant = 'success' | 'error';

export interface SnackbarItem {
  id: string;
  variant: SnackbarVariant;
  title: string;
  message: string;
}

interface SnackbarContextValue {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

let idCounter = 0;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SnackbarItem[]>([]);

  const add = useCallback((variant: SnackbarVariant, message: string, title?: string) => {
    const id = String(++idCounter);
    const titleDefault = variant === 'success' ? 'Sucesso' : 'Erro';
    setItems((prev) => [...prev, { id, variant, title: title ?? titleDefault, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4000);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => add('success', message, title), [add]);
  const showError = useCallback((message: string, title?: string) => add('error', message, title), [add]);

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError }}>
      {children}
      <SnackbarStack items={items} onDismiss={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  return ctx ?? { showSuccess: () => {}, showError: () => {} };
}

function SnackbarStack({
  items,
  onDismiss,
}: {
  items: SnackbarItem[];
  onDismiss: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 380,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'auto' }}>
        {items.map((item) => (
          <SnackbarItem key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
        ))}
      </div>
    </div>
  );
}

function SnackbarItem({
  item,
  onDismiss,
}: {
  item: SnackbarItem;
  onDismiss: () => void;
}) {
  const isSuccess = item.variant === 'success';
  const bg = isSuccess ? 'rgba(34, 197, 94, 0.12)' : 'rgba(248, 113, 113, 0.12)';
  const border = isSuccess ? 'rgba(34, 197, 94, 0.4)' : 'rgba(248, 113, 113, 0.4)';
  const iconColor = isSuccess ? '#22c55e' : '#f87171';

  return (
    <div
      role="alert"
      onClick={onDismiss}
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 18px',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {isSuccess ? (
          <CheckCircle size={22} color={iconColor} strokeWidth={2.5} />
        ) : (
          <AlertCircle size={22} color={iconColor} strokeWidth={2.5} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
          {item.message}
        </p>
      </div>
    </div>
  );
}
