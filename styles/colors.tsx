/** Paleta azul e preto: fundo preto, texto claro, destaque azul */
export const BACKGROUND_GRADIENT = 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)';

export const colors = {
  background: {
    general: '#0a0a0a',
    light: '#111111',
    muted: '#171717',
    gradient: BACKGROUND_GRADIENT,
    dark: '#050505',
    darkBlue: '#0f172a',
  },

  text: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    onPrimary: '#ffffff',
    light: '#fafafa',
  },

  icons: {
    primary: '#e4e4e7',
    secondary: '#60a5fa',
  },

  blue: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    tertiary: '#60a5fa',
  },

  neutral: {
    gray: '#71717a',
    border: '#27272a',
    borderDark: '#3f3f46',
    borderLight: '#18181b',
    accordeon: '#18181b',
  },

  admin: {
    background: 'transparent',
    sidebar: 'rgba(255, 255, 255, 0.55)',
    active: '#2563eb',
    inactive: '#eff6ff',
  },
} as const;
