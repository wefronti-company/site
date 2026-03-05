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
  background: ${colors.background.general};
  background-attachment: fixed;
  color: ${colors.text.primary};
  font-family: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body:not(.admin-route)::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'%3E%3Canimate attributeName='baseFrequency' values='0.82;0.9;0.82' dur='4s' repeatCount='indefinite'/%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  animation: noise-chuvisco 3s ease-in-out infinite;
  opacity: 0.04;
}
@keyframes noise-chuvisco {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
}
button, input, select, textarea {
  font-family: inherit;
}
#__next {
  min-height: 100%;
  overflow-x: hidden;
  background: transparent;
  padding-bottom: 80px;
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

section:not(#section-0) {
  position: relative;
  z-index: 20;
  background: transparent;
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
@keyframes testimonials-scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@keyframes testimonials-scroll-reverse {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(50%, 0, 0); }
}
@keyframes cta-gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
.cta-gradient-animated {
  background: linear-gradient(90deg, #1d4ed8, #2563eb, #3b82f6, #60a5fa, #93c5fd, #3b82f6, #2563eb, #1d4ed8) !important;
  background-size: 300% 100% !important;
  animation: cta-gradient-flow 6s ease-in-out infinite;
  border: none !important;
  color: #fff !important;
}
@media (prefers-reduced-motion: reduce) {
  .cta-gradient-animated { animation: none; background-position: 50% 50% !important; }
}
.shake { animation: shake 0.4s ease-in-out; }
.testimonials-track { animation: testimonials-scroll 80s linear infinite; backface-visibility: hidden; }
.testimonials-track-reverse { animation: testimonials-scroll-reverse 80s linear infinite; backface-visibility: hidden; }
.pricing-feature-item:hover { transform: translateX(6px); }
.admin-nav-item:hover { opacity: 1; }
.header-nav-link { text-shadow: none !important; box-shadow: none !important; }
.header-nav-link:focus { outline: none; }
.header-cta-btn:focus { outline: none; }
button:focus-visible, a:focus-visible, [role="button"]:focus-visible, summary:focus-visible { outline: 2px solid rgba(53, 152, 255, 0.8); outline-offset: 2px; }
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
  border-color: #3b82f6 !important;
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
  body:not(.admin-route)::before { animation: none !important; }
  .cta-gradient-animated { animation: none !important; }
  .animate-float { animation: none !important; }
  .hero-chip-float { animation: none !important; }
  .hero-sparkle { animation: none !important; }
  .testimonials-track { animation: none !important; }
  .testimonials-track-reverse { animation: none !important; }
  .pricing-feature-item:hover { transform: none !important; }
}
`,
    }}
  />
);

export default GlobalStyles;
