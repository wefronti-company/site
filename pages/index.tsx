import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AppBar from '../components/layout/AppBar';
import Hero from '../sections/Hero';
import SplashScreen from '../components/effects/SplashScreen';
import SEO from '../components/SEO';

// Lazy load de componentes pesados (carrega apenas quando visível)
const Services = dynamic(() => import('../sections/Services'), {
  loading: () => <div className="h-screen" />,
});
const Clients = dynamic(() => import('../sections/Clients'), {
  loading: () => <div className="h-screen" />,
});
const Projects = dynamic(() => import('../sections/Projects'), {
  loading: () => <div className="h-screen" />,
});
const FAQ = dynamic(() => import('../sections/FAQ'), {
  loading: () => <div className="h-screen" />,
});
const Footer = dynamic(() => import('../sections/Footer'), {
  loading: () => <div className="h-24" />,
});

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Remove splash após 2 segundos (reduzido para melhor UX)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

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