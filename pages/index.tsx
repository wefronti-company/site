import React, { useState, useEffect } from 'react';
import AppBar from '../components/layout/AppBar';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import Clients from '../sections/Clients';
import Projects from '../sections/Projects';
import SplashScreen from '../components/effects/SplashScreen';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Remove splash após 4 segundos
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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