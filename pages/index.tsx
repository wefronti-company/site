import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import Technology from '../sections/Technology';
import Contact from '../sections/Contact';
import Testimonials from '../sections/Testimonials';
import Faq from '../sections/Faq';
import Cta from '../sections/Cta';
import Footer from '../sections/Footer';
import SplashScreen from '../components/SplashScreen';

const SPLASH_STORAGE_KEY = 'wefronti_splash_seen_v2';

const Home: React.FC = () => {
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
    }
  }, [mounted]);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
    }
    setShowSplash(false);
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
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <Hero />
          <Technology />
          <Testimonials />
          <Contact />
          
          <Faq />
          <Cta />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
