import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Fibracom | Internet fibra para gamers e streamers</title>
        <meta name="description" content="Planos de internet fibra para gamers e streamers. Baixa latência, upload de sobra para live e estabilidade para não cair no meio do game." />
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
          backgroundImage: 'url(/images/hero/background-hero-fibracom.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#e4e4e7',
        }}
      >
        <div style={{ maxWidth: '520px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Fibracom
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 7.5vw, 5rem)', fontWeight: 400, margin: 0, marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Internet fibra para gamers e streamers
          </h1>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 400, opacity: 0.9, margin: 0, marginBottom: '1.5rem', lineHeight: 1.4, textAlign: 'left' }}>
            Baixa latência, upload de sobra para live e estabilidade para não cair no meio do game.
          </h2>
          <a
            href="#planos"
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
            Ver planos
          </a>
        </div>
      </main>
    </>
  );
}
