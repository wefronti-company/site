import React from 'react';

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
  --scrollbar-thumb: rgba(255,255,255,0.03);
  --scrollbar-thumb-hover: rgba(255,255,255,0.08);
  --scrollbar-width: 3px;
}

*, *::before, *::after { box-sizing: border-box; }
html {
  height: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  max-width: 100vw;
  background-color: #040404;
  color: #ffffff;
  font-family: "Funnel Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
button, input, select, textarea {
  font-family: inherit;
}
#__next {
  min-height: 100%;
  overflow-x: hidden;
  background-color: #040404;
}

@media (min-width: 768px) {
  body { overflow: auto; height: auto; }
}

section:not(#section-0) {
  position: relative;
  z-index: 20;
  background: transparent;
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
@keyframes header-letter-mix-in {
  0% { opacity: 0; transform: translateY(4px) scale(0.92); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes badge-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(53, 152, 255, 0.5); }
  50% { opacity: 0.9; box-shadow: 0 0 10px 3px rgba(53, 152, 255, 0.7); }
}
.shake { animation: shake 0.4s ease-in-out; }
.badge-dot-pulse { animation: badge-dot-pulse 2s ease-in-out infinite; }
.header-nav-link { text-shadow: none !important; box-shadow: none !important; }
.header-nav-link:focus { outline: 2px solid rgba(255,255,255,0.4); outline-offset: 2px; }
.header-nav-link-char { display: inline-block; }
.header-nav-link-char.mix-in { animation: header-letter-mix-in 0.22s ease-out forwards; }
@media (prefers-reduced-motion: reduce) {
  .header-nav-link-char.mix-in { animation: none; }
}
.animate-slide-down { animation: slide-down 0.3s ease-out; }
.animate-slide-up { animation: slide-up 0.4s ease-out; }
.animate-fade-in { animation: fade-in 0.3s ease-out; }
.animate-scale-in { animation: scale-in 0.3s ease-out; }
.animate-float { animation: float 3s ease-in-out infinite; }
.hero-sparkle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 0 6px rgba(255,255,255,0.8);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none !important; }
  .hero-sparkle { animation: none !important; }
  .badge-dot-pulse { animation: none !important; }
}
`,
    }}
  />
);

export default GlobalStyles;
