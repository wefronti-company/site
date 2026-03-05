/** Paleta preto e laranja: fundo preto, texto claro, destaque laranja (cor quente = movimento, sensação de que as coisas acontecem) */
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
    secondary: '#d4693e',
  },

  /** Destaque estático (palavras, ícones): mix de laranjas — sem animação. Animação só no botão CTA. */
  blue: {
    primary: '#d4693e',
    secondary: '#b85c38',
    tertiary: '#e07c4a',
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
