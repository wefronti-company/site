import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import Footer from '../sections/Footer';
import SplashScreen from '../components/SplashScreen';

const SPLASH_STORAGE_KEY = 'wefronti_splash_seen_v2';

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Só pular a splash se já tiver sido vista nesta sessão (sessionStorage)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (seen === '1') {
      setShowSplash(false);
    }
  }, [mounted]);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
    }
    setShowSplash(false);
  };

  // Durante SSR/hidratação: evitar flash do conteúdo antes da splash
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
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <Hero />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
