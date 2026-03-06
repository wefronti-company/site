import type { AppProps } from 'next/app';
import Head from 'next/head';

const globalStyles = `
  html {
    scroll-behavior: smooth;
  }
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #__next {
    min-height: 100vh;
  }
  *:focus,
  *:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
  button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"]) {
    -webkit-tap-highlight-color: transparent;
  }
  @media (max-width: 900px) {
    .hero-badges-mobile-hide {
      display: none !important;
    }
  }
  .header-btn-label-mobile {
    display: none;
  }
  @media (max-width: 768px) {
    .site-header,
    .hero-content,
    .cliente-inner,
    .planos-inner {
      padding-left: 1.25rem !important;
      padding-right: 1.25rem !important;
    }
    .hero-cta {
      display: block !important;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }
    .header-nav-links {
      display: none !important;
    }
    .header-btn-label-desktop {
      display: none !important;
    }
    .header-btn-label-mobile {
      display: inline !important;
    }
    .cobertura-grid {
      grid-template-columns: 1fr !important;
      grid-template-areas: 'texts' 'map';
    }
    .cobertura-grid .cobertura-texts {
      grid-area: texts;
      min-width: 0;
    }
    .cobertura-grid .cobertura-map-wrap {
      grid-area: map;
      min-height: 360px;
      min-width: 0;
      justify-self: center;
      width: 100%;
      max-width: min(520px, 100%);
    }
    .cobertura-section {
      padding-left: 1.25rem !important;
      padding-right: 1.25rem !important;
    }
    .cobertura-grain {
      opacity: 0.2 !important;
      background-size: 32px 32px !important;
    }
    .cobertura-p {
      font-size: 1.05rem !important;
    }
    .cobertura-chip {
      font-size: 1rem !important;
      padding: 0.8rem 1rem !important;
    }
    .cobertura-grid {
      padding-left: 0 !important;
      padding-right: 0 !important;
      max-width: 100%;
    }
    .login-layout {
      grid-template-columns: 1fr;
    }
    .login-layout > div:first-child {
      min-height: 40vh;
    }
    .header-nav {
      gap: 0.75rem;
    }
    .modal-content-wrap {
      max-height: calc(100vh - 2rem);
      overflow-y: auto;
    }
    .cta-benefits-grid {
      grid-template-columns: 1fr;
    }
    .section-title {
      font-size: 1.95rem !important;
      font-weight: 500 !important;
    }
    .planos-grain {
      opacity: 0.2 !important;
      background-size: 32px 32px !important;
    }
    .planos-desktop {
      display: none !important;
    }
    .planos-mobile {
      display: block !important;
    }
    .planos-cards-track {
      width: 300%;
    }
    .planos-slide {
      width: 33.333%;
    }
    .cliente-box {
      flex-direction: row !important;
      align-items: center !important;
      aspect-ratio: auto !important;
      min-height: auto !important;
      gap: 1rem !important;
      padding: 1.25rem 1.25rem !important;
    }
    .cliente-box span:first-child svg {
      width: 28px;
      height: 28px;
    }
    .cliente-box span:last-child {
      text-align: left !important;
    }
    .cliente-boxes-grid {
      grid-template-columns: repeat(2, 1fr);
      max-width: 100%;
    }
    .footer-grid {
      grid-template-columns: 1fr !important;
    }
    .footer-right {
      align-items: flex-start !important;
    }
    .footer-right > div:last-child {
      text-align: left !important;
    }
  }
  @media (min-width: 769px) {
    .planos-desktop {
      display: grid !important;
    }
    .planos-mobile {
      display: none !important;
    }
    .cobertura-grid {
      grid-template-areas: unset;
    }
    .cobertura-grid .cobertura-texts {
      grid-column: 1;
      grid-row: 1;
      grid-area: unset;
    }
    .cobertura-grid .cobertura-map-wrap {
      grid-column: 2;
      grid-row: 1;
      grid-area: unset;
      min-height: 560px;
    }
  }
  @media (max-width: 480px) {
    .cliente-boxes-grid {
      grid-template-columns: 1fr;
    }
    .planos-toggle-wrap {
      width: 100%;
      max-width: 200px;
    }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .cta-benefits-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Component {...pageProps} />
    </>
  );
}
