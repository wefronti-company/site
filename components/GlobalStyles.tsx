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
  --scrollbar-track: #0b0b0b;
  --scrollbar-thumb: #1f1f1f;
  --scrollbar-track-mobile: rgba(255,255,255,0.02);
  --scrollbar-thumb-mobile: rgba(255,255,255,0.06);
  --scrollbar-thumb-mobile-hover: rgba(255,255,255,0.10);
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

/* Scrollbar - Firefox */
* { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track); }
/* WebKit */
::-webkit-scrollbar { width: 10px; height: 10px; background: var(--scrollbar-track); }
::-webkit-scrollbar-track { background: var(--scrollbar-track) !important; border-radius: 0 !important; }
::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb) !important; border-radius: 0 !important; min-height: 28px; }
::-webkit-scrollbar-thumb:hover { filter: brightness(0.95); }
::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }
::-webkit-scrollbar-corner { background: var(--scrollbar-track) !important; }
@media (max-width: 640px) {
  * { scrollbar-color: var(--scrollbar-thumb-mobile) var(--scrollbar-track-mobile); }
  ::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
  ::-webkit-scrollbar-track { background: var(--scrollbar-track-mobile) !important; }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb-mobile) !important; border-radius: 9999px !important; }
  ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-mobile-hover) !important; }
}

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
.shake { animation: shake 0.4s ease-in-out; }
.animate-slide-down { animation: slide-down 0.3s ease-out; }
.animate-slide-up { animation: slide-up 0.4s ease-out; }
.animate-fade-in { animation: fade-in 0.3s ease-out; }
.animate-scale-in { animation: scale-in 0.3s ease-out; }
.animate-float { animation: float 3s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none !important; }
}
`,
    }}
  />
);

export default GlobalStyles;
