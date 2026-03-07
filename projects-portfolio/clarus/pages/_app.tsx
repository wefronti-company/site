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
  .header-btn-label-mobile {
    display: none;
  }
  @media (max-width: 768px) {
    .site-header,
    .hero-content {
      padding-left: 1.25rem !important;
      padding-right: 1.25rem !important;
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
  .clarus-title {
    font-family: 'IBM Plex Serif', Georgia, serif;
  }
  @media (max-width: 768px) {
    .clarus-timeline-connector {
      display: none !important;
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/brand/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Component {...pageProps} />
    </>
  );
}
