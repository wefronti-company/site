import React from 'react';
import { colors } from '../styles/theme';

/**
 * Estilos globais injetados via React (sem arquivo CSS externo para o design).
 * Inclui reset, tipografia base, scrollbar e keyframes usados no app.
 */
const GlobalStyles: React.FC = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
:root {
  --scrollbar-track: transparent;
  --scrollbar-thumb: rgba(255,255,255,0.15);
  --scrollbar-thumb-hover: rgba(255,255,255,0.25);
  --scrollbar-width: 3px;
}

*, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html {
  height: 100%;
  overflow-x: hidden;
  scroll-padding-top: 100px;
  scroll-padding-bottom: 80px;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  max-width: 100vw;
  cursor: url('/images/icons/cursor.svg') 4 4, auto;
  background: ${colors.background.general};
  background-attachment: fixed;
  color: ${colors.text.primary};
  font-family: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
button, input, select, textarea {
  font-family: inherit;
}
#__next {
  min-height: 100%;
  overflow-x: hidden;
  background: transparent;
  padding-bottom: 0;
  position: relative;
  z-index: 3;
}

/* Scroll suave — respeita preferência de movimento reduzido */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

@media (min-width: 768px) {
  body { overflow: auto; height: auto; }
}

/* Mobile: desativa apenas animações pesadas (mantém vidro desfocado) */
@media (max-width: 767px) {
  .testimonials-track, .testimonials-track-reverse { animation: none !important; }
  .animate-float, .hero-chip-float, .hero-sparkle { animation: none !important; }
}

section:not(#section-0) {
  position: relative;
  z-index: 20;
  background: transparent;
}

/* Mobile: content-visibility em seções abaixo do Hero — reduz trabalho de render inicial */
@media (max-width: 767px) {
  section:not(#hero) {
    content-visibility: auto;
    contain-intrinsic-size: auto 300px;
  }
}
/* Hero em mobile: animação via CSS (evita Framer Motion / forced reflow) */
@media (max-width: 767px) {
  .hero-css-fade { opacity: 0; animation: hero-fade-up 0.5s ease-out forwards; }
  .hero-css-fade.d1 { animation-delay: 0.05s; }
  .hero-css-fade.d2 { animation-delay: 0.15s; }
  .hero-css-fade.d3 { animation-delay: 0.25s; }
  .hero-css-fade.d4 { animation-delay: 0.5s; }
}

/* Margem de scroll para seções com âncora: o badge fica visível abaixo do header fixo */
section[id] {
  scroll-margin-top: 5px;
}

/* Scrollbar - quase invisível, fina (Firefox + WebKit) */
* { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track); }
/* WebKit (Chrome, Safari, Edge, Opera) */
::-webkit-scrollbar { width: var(--scrollbar-width); height: var(--scrollbar-width); background: var(--scrollbar-track); }
::-webkit-scrollbar-track { background: var(--scrollbar-track) !important; }
::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb) !important; border-radius: 9999px !important; }
::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover) !important; }
::-webkit-scrollbar-thumb:active { background: var(--scrollbar-thumb-hover) !important; }
::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }
::-webkit-scrollbar-corner { background: var(--scrollbar-track) !important; }

.contact-field:focus { outline: none; border-color: rgba(53, 152, 255, 0.6) !important; box-shadow: 0 0 0 2px rgba(53, 152, 255, 0.2); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1); }
}
@keyframes sparkle-float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(3px, -4px); }
  50% { transform: translate(-2px, 2px); }
  75% { transform: translate(2px, 3px); }
}
@keyframes sparkle-fairy {
  0%, 100% { transform: translate(0, 0); opacity: 0.85; }
  25% { transform: translate(6px, -8px); opacity: 1; }
  50% { transform: translate(-4px, 5px); opacity: 0.75; }
  75% { transform: translate(5px, 4px); opacity: 0.95; }
}
@keyframes testimonials-scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@keyframes testimonials-scroll-reverse {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(50%, 0, 0); }
}
@keyframes cta-btn-shine {
  0% { transform: skewX(28deg) translateX(-100%); }
  100% { transform: skewX(28deg) translateX(200%); }
}
@keyframes sparkle-float-back {
  0%, 100% { transform: translate3d(0, 0, -50px) scale(1) rotateY(0deg); opacity: 0.6; }
  25% { transform: translate3d(8px, -12px, 20px) scale(1.15) rotateY(90deg); opacity: 0.9; }
  50% { transform: translate3d(-6px, 8px, 10px) scale(0.95) rotateY(180deg); opacity: 0.7; }
  75% { transform: translate3d(10px, 5px, -20px) scale(1.05) rotateY(270deg); opacity: 0.85; }
}
@keyframes sparkle-float-front {
  0%, 100% { transform: translate3d(0, 0, 30px) scale(1) rotateY(0deg); opacity: 0.7; }
  33% { transform: translate3d(-10px, 8px, 60px) scale(1.1) rotateY(120deg); opacity: 0.95; }
  66% { transform: translate3d(6px, -6px, 40px) scale(0.9) rotateY(240deg); opacity: 0.75; }
}
span[data-cta-gradient-wrap] {
  position: relative !important;
  display: inline-block !important;
  border-radius: 9999px !important;
  padding: 0 !important;
  overflow: hidden !important;
  box-shadow: 0 2px 12px rgba(212, 105, 62, 0.35) !important;
}
/* Base do botão: gradiente estático (terracota) */
span[data-cta-gradient-wrap]::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  border-radius: inherit !important;
  background: linear-gradient(90deg, #b85c38, #d4693e, #b85c38, #e07c4a, #b85c38) !important;
}
/* Brilho: faixa de laranja mais claro que atravessa em diagonal (esquerda → direita) */
span[data-cta-gradient-wrap]::after {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 70% !important;
  z-index: 0 !important;
  border-radius: inherit !important;
  background: linear-gradient(90deg, transparent 0%, transparent 5%, rgba(232, 155, 111, 0.12) 20%, rgba(232, 155, 111, 0.45) 35%, rgba(255, 210, 180, 0.7) 50%, rgba(232, 155, 111, 0.45) 65%, rgba(232, 155, 111, 0.12) 80%, transparent 95%, transparent 100%) !important;
  -webkit-animation: cta-btn-shine 2.2s linear infinite !important;
  animation: cta-btn-shine 2.2s linear infinite !important;
}
span[data-cta-gradient-wrap]:hover { box-shadow: 0 4px 20px rgba(212, 105, 62, 0.45) !important; }
span[data-cta-gradient-wrap] > a,
span[data-cta-gradient-wrap] > button {
  position: relative !important;
  z-index: 1 !important;
}
@media (prefers-reduced-motion: reduce) {
  span[data-cta-gradient-wrap]::after { -webkit-animation: none !important; animation: none !important; opacity: 0 !important; }
}
.glass-transparent {
  background-color: rgba(24, 24, 27, 0.7) !important;
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  backdrop-filter: saturate(180%) blur(24px);
}
.glass-transparent-sm {
  background-color: rgba(24, 24, 27, 0.6) !important;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.shake { animation: shake 0.4s ease-in-out; }
.testimonials-track { animation: testimonials-scroll 80s linear infinite; backface-visibility: hidden; }
.testimonials-track-reverse { animation: testimonials-scroll-reverse 80s linear infinite; backface-visibility: hidden; }
.pricing-feature-item:hover { transform: translateX(6px); }
.admin-nav-item:hover { opacity: 1; }
.header-nav-link { text-shadow: none !important; box-shadow: none !important; }
.header-nav-link:focus { outline: none; }
.header-cta-btn:focus { outline: none; }
button:focus-visible, a:focus-visible, [role="button"]:focus-visible, summary:focus-visible { outline: 2px solid rgba(212, 105, 62, 0.8); outline-offset: 2px; }
.pricing-modal-input,
.pricing-modal-select,
.pricing-modal-textarea {
  background: #18181b !important;
  color: #fafafa !important;
}
.pricing-modal-input:focus,
.pricing-modal-select:focus,
.pricing-modal-textarea:focus,
.pricing-modal-input:focus-visible,
.pricing-modal-select:focus-visible,
.pricing-modal-textarea:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border-color: #d4693e !important;
}
.pricing-modal-input:-webkit-autofill,
.pricing-modal-input:-webkit-autofill:hover,
.pricing-modal-input:-webkit-autofill:focus,
.pricing-modal-input:-webkit-autofill:active {
  -webkit-text-fill-color: #fafafa !important;
  -webkit-box-shadow: 0 0 0 1000px #18181b inset !important;
  box-shadow: 0 0 0 1000px #18181b inset !important;
  caret-color: #fafafa !important;
  transition: background-color 9999s ease-out 0s;
}
.animate-slide-down { animation: slide-down 0.3s ease-out; }
.animate-slide-up { animation: slide-up 0.4s ease-out; }
.animate-fade-in { animation: fade-in 0.3s ease-out; }
.animate-scale-in { animation: scale-in 0.3s ease-out; }
.animate-float { animation: float 3s ease-in-out infinite; }
.hero-chip-float { animation: float 3.5s ease-in-out infinite; }
.hero-sparkle {
  position: absolute;
  border-radius: 50%;
  background: rgba(53, 152, 255, 0.35);
  box-shadow: 0 0 6px rgba(53, 152, 255, 0.4);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  span[data-cta-gradient-wrap]::after { animation: none !important; opacity: 0 !important; }
  .animate-float { animation: none !important; }
  .hero-chip-float { animation: none !important; }
  .hero-sparkle { animation: none !important; }
  .testimonials-track { animation: none !important; }
  .testimonials-track-reverse { animation: none !important; }
  .pricing-feature-item:hover { transform: none !important; }
  [data-sparkle-dot] { animation: none !important; opacity: 0.5 !important; }
}
`,
    }}
  />
);

export default GlobalStyles;
