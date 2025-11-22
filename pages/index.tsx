import React, { useState, useEffect } from 'react';
import AppBar from '../components/layout/AppBar';
import Hero from '../sections/Hero';
import SplashScreen from '../components/effects/SplashScreen';

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
    </>
  );
};

export default Home;