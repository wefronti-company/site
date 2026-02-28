/** Gradiente verde baseado na paleta da imagem: off-white verde → amarelo-esverdeado → amarelo pastel */
export const BACKGROUND_GRADIENT = 'linear-gradient(135deg,rgb(210, 247, 198) 0%,rgba(249, 255, 246, 0.81) 25%,rgb(249, 255, 246, 0.81) 50%,rgb(249, 255, 246, 0.81) 75%,rgb(210, 247, 198) 100%)';

export const colors = {
  background: {
    /** Cor base do gradiente (para fallback ou blocos sólidos) */
    general: '#F8FFF8', // Tom verde off-white (início do gradiente)
    light: '#EEFFE5',   // Amarelo-esverdeado claro (meio do gradiente)
    muted: '#F2FFEB',   // Verde pálido (transição do gradiente)
    /** Gradiente completo para uso em background */
    gradient: BACKGROUND_GRADIENT,
  },

  text: {
    primary: '#111827',   // Texto principal em fundos claros (site público)
    secondary: '#6B7280', // Texto secundário/muted
    onPrimary: '#FFFFFF', // Texto em botões de destaque (azul)
    light: '#FFFFFF',     // Texto em fundos escuros (admin, botões)
  },

  icons: {
    primary: '#374151',   // Ícones em fundos claros
    secondary: '#7ad49dAF', // Ícones muted
  },

  blue: {
    primary: '#66BF82',   // Cor de destaque (botões, links)
    secondary: '#66BF82',
    tertiary: '#66BF82',  // Hover/fundo leve
  },

  neutral: {
    gray: '#6B7280',
    border: '#D4E8D0',       // Bordas em tema claro (verde suave)
    borderDark: '#363636',   // Bordas em tema escuro (admin)
    borderLight: '#EEF8EA',
    accordeon: '#F5FFF0',    // Cards, accordeons (tom verde pálido)
  },

  admin: {
    background: '#0A0C12',
    sidebar: '#141414',
    active: '#3598FF',
    inactive: '#171717',
  },
} as const;
