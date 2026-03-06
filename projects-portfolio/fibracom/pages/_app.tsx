import type { AppProps } from 'next/app';

const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  #__next {
    min-height: 100vh;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Component {...pageProps} />
    </>
  );
}
