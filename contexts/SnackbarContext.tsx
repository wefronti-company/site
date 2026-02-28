import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export type SnackbarVariant = 'success' | 'error';

export interface SnackbarItem {
  id: string;
  variant: SnackbarVariant;
  message: string;
}

interface SnackbarContextValue {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

let idCounter = 0;

const SNACKBAR_DURATION_SUCCESS_MS = 4500;
const SNACKBAR_DURATION_ERROR_MS = 6000;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const [closingIds, setClosingIds] = useState<Set<string>>(new Set());

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setClosingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const startClosing = useCallback((id: string) => {
    setClosingIds((prev) => new Set(prev).add(id));
  }, []);

  const add = useCallback((variant: SnackbarVariant, message: string, title?: string) => {
    const id = String(++idCounter);
    void title; // mantemos assinatura para compatibilidade
    setItems((prev) => [...prev, { id, variant, message }]);
    const duration = variant === 'error' ? SNACKBAR_DURATION_ERROR_MS : SNACKBAR_DURATION_SUCCESS_MS;
    setTimeout(() => startClosing(id), duration);
  }, [startClosing]);

  const showSuccess = useCallback((message: string, title?: string) => add('success', message, title), [add]);
  const showError = useCallback((message: string, title?: string) => add('error', message, title), [add]);

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError }}>
      {children}
      <SnackbarStack
        items={items}
        closingIds={closingIds}
        onDismiss={startClosing}
        onExitEnd={removeItem}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  return ctx ?? { showSuccess: () => {}, showError: () => {} };
}

function SnackbarStack({
  items,
  closingIds,
  onDismiss,
  onExitEnd,
}: {
  items: SnackbarItem[];
  closingIds: Set<string>;
  onDismiss: (id: string) => void;
  onExitEnd: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <>
      <style>{`
        @keyframes snackbar-slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes snackbar-slide-up {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
        .snackbar-item-enter {
          animation: snackbar-slide-down 0.3s ease-out forwards;
        }
        .snackbar-item-exit {
          animation: snackbar-slide-up 0.25s ease-in forwards;
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          left: 'auto',
          transform: 'none',
          zIndex: 2147483647,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: 'auto',
          maxWidth: 'calc(100vw - 40px)',
          pointerEvents: 'none',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'auto', alignItems: 'flex-end' }}>
          {items.map((item) => (
            <SnackbarItem
              key={item.id}
              item={item}
              isClosing={closingIds.has(item.id)}
              onDismiss={() => onDismiss(item.id)}
              onExitEnd={() => onExitEnd(item.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SnackbarItem({
  item,
  isClosing,
  onDismiss,
  onExitEnd,
}: {
  item: SnackbarItem;
  isClosing: boolean;
  onDismiss: () => void;
  onExitEnd: () => void;
}) {
  const isSuccess = item.variant === 'success';
  const border = isSuccess ? 'rgba(102, 191, 130, 0.45)' : 'rgba(248, 113, 113, 0.4)';
  const iconColor = isSuccess ? '#66BF82' : '#f87171';

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'snackbar-slide-up') onExitEnd();
  };

  return (
    <div
      role="alert"
      onClick={onDismiss}
      onAnimationEnd={handleAnimationEnd}
      className={isClosing ? 'snackbar-item-exit' : 'snackbar-item-enter'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        width: 'fit-content',
        maxWidth: 'min(560px, calc(100vw - 48px))',
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'saturate(150%) blur(14px)',
        WebkitBackdropFilter: 'saturate(150%) blur(14px)',
        border: `1px solid ${border}`,
        borderRadius: 9999,
        boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isSuccess ? (
          <CheckCircle2 size={22} color={iconColor} strokeWidth={2.5} />
        ) : (
          <AlertCircle size={22} color={iconColor} strokeWidth={2.5} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#111827', lineHeight: 1.25 }}>
          {item.message}
        </p>
      </div>
    </div>
  );
}
