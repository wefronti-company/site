/** Paleta preto e laranja: fundo preto, texto claro, destaque laranja (cor quente = movimento, sensação de que as coisas acontecem) */
export const BACKGROUND_GRADIENT = '#010101';

export const colors = {
  background: {
    general: '#010101',
    light: '#0a0a0a',
    muted: '#171717',
    gradient: '#010101',
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
    /** Brilho fixo: laranja visível (entre primary e o brilho do botão), sem animação */
    brillho: '#e07c4a',
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
