import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AppBar from '../components/layout/AppBar';
import Hero from '../sections/Hero';
import SplashScreen from '../components/effects/SplashScreen';
import SEO from '../components/SEO';

// Lazy load AGRESSIVO com ssr:false para máxima performance
const Clients = dynamic(() => import('../sections/Clients'), {
  ssr: false,
  loading: () => null,
});
const Services = dynamic(() => import('../sections/Services'), {
  ssr: false,
  loading: () => null,
});
const Projects = dynamic(() => import('../sections/Projects'), {
  ssr: false,
  loading: () => null,
});
const FAQ = dynamic(() => import('../sections/FAQ'), {
  ssr: false,
  loading: () => null,
});
const Footer = dynamic(() => import('../sections/Footer'), {
  ssr: false,
  loading: () => null,
});

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Remove splash após completar 100% + animação de saída
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2700); // 2000ms (100%) + 200ms (espera) + 500ms (saída)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO />
      {showSplash && <SplashScreen />}
      <AppBar />
      <Hero />     
      <Clients />
      <Services />
      <Projects />
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;