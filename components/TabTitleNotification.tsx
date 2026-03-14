'use client';

import React, { useEffect, useRef } from 'react';

const HIDDEN_TITLE = '! Nova mensagem';

/**
 * Quando o usuário muda de aba, altera o título da aba para "❗ Nova mensagem".
 * Ao voltar, restaura o título original.
 */
const TabTitleNotification: React.FC = () => {
  const originalTitleRef = useRef<string>('');

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        originalTitleRef.current = document.title;
        document.title = HIDDEN_TITLE;
      } else {
        document.title = originalTitleRef.current || 'Wefronti | Sites e landing pages que convertem';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return null;
};

export default TabTitleNotification;
