import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import ValoresCarousel from '../sections/ValoresCarousel';
import Solucoes from '../sections/Solucoes';
import Testimonials from '../sections/Testimonials';
import Timeline from '../sections/Timeline';
import Pricing from '../sections/Pricing';
import Comparison from '../sections/Comparison';
import Faq from '../sections/Faq';
import Cta from '../sections/Cta';
import Footer from '../sections/Footer';
import SplashScreen from '../components/SplashScreen';
import { useSplash } from '../contexts/SplashContext';
import { colors } from '../styles/theme';

const SPLASH_STORAGE_KEY = 'wefronti_splash_seen_v2';
const Home: React.FC = () => {
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
        <div style={{ minHeight: '100vh', background: colors.background.gradient }} aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <SEO />
      <Hero />
      <ValoresCarousel />
      <Solucoes />
      <Testimonials />
      <Timeline />
      <Pricing />
      <Comparison />
      <Faq />
      <Cta />
      <Footer />
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
    </>
  );
};

export default Home;
