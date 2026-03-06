import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Fibracom — Projeto Wefronti</title>
        <meta name="description" content="Case Fibracom: provedor de internet fibra. Projeto de portfólio Wefronti." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2rem 2rem 2rem clamp(2rem, 6vw, 4rem)',
          fontFamily: 'system-ui, sans-serif',
          backgroundImage: 'url(/images/hero/background-hero-fibracom.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#e4e4e7',
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, margin: 0, marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Fibracom
          </h1>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 400, opacity: 0.9, margin: 0, marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Provedor de internet fibra — caso de sucesso
          </h2>
          <a
            href="https://wefronti.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#a78bfa',
              color: '#0a0a0f',
              textDecoration: 'none',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Conheça a Wefronti
          </a>
        </div>
      </main>
    </>
  );
}
