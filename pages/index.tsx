import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import Technology from '../sections/Technology';
import Testimonials from '../sections/Testimonials';
import Timeline from '../sections/Timeline';
import Portfolio from '../sections/Portfolio';
import About from '../sections/About';
import Pricing from '../sections/Pricing';
import Comparison from '../sections/Comparison';
import Faq from '../sections/Faq';
import Cta from '../sections/Cta';
import Footer from '../sections/Footer';
import SplashScreen from '../components/SplashScreen';
import { useSplash } from '../contexts/SplashContext';
import { getAllConteudo } from '../lib/siteConteudoDb';

const SPLASH_STORAGE_KEY = 'wefronti_splash_seen_v2';

export const getServerSideProps: GetServerSideProps<{ siteConteudo: Record<string, unknown> }> = async () => {
  try {
    const siteConteudo = await getAllConteudo();
    return { props: { siteConteudo } };
  } catch {
    return { props: { siteConteudo: {} } };
  }
};

interface HomeProps {
  siteConteudo: Record<string, unknown>;
}

const Home: React.FC<HomeProps> = ({ siteConteudo }) => {
  const { setSplashActive } = useSplash() ?? {};
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (seen === '1') {
      setShowSplash(false);
      setSplashActive?.(false);
    }
  }, [mounted, setSplashActive]);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
    }
    setShowSplash(false);
    setSplashActive?.(false);
  };

  if (!mounted) {
    return (
      <>
        <SEO />
        <div style={{ minHeight: '100vh', background: '#040404' }} aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <SEO />
      <Head>
        <link rel="preload" href="/images/brand/background.webp" as="image" />
      </Head>
      <Hero conteudo={siteConteudo.hero as Record<string, unknown> | undefined} />
      <Technology conteudo={siteConteudo.technology as Record<string, unknown> | undefined} />
      <Testimonials conteudo={siteConteudo.testimonials as Record<string, unknown> | undefined} />
      <Timeline conteudo={siteConteudo.timeline as Record<string, unknown> | undefined} />
      <Portfolio conteudo={siteConteudo.portfolio as Record<string, unknown> | undefined} />
      <About conteudo={siteConteudo.about as Record<string, unknown> | undefined} />
      <Pricing conteudo={siteConteudo.pricing as Record<string, unknown> | undefined} />
      <Comparison conteudo={siteConteudo.comparison as Record<string, unknown> | undefined} />
      <Faq conteudo={siteConteudo.faq as Record<string, unknown> | undefined} />
      <Cta conteudo={siteConteudo.cta as Record<string, unknown> | undefined} />
      <Footer conteudo={siteConteudo.footer as Record<string, unknown> | undefined} />
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
    </>
  );
};

export default Home;
