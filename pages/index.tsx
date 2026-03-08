import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';

/* Code-split: carrega seções abaixo da dobra sob demanda para mobile mais rápido */
const IntroSection = dynamic(() => import('../sections/IntroSection'), { ssr: true });
const Timeline = dynamic(() => import('../sections/Timeline'), { ssr: true });
const Comparison = dynamic(() => import('../sections/Comparison'), { ssr: true });
const Testimonials = dynamic(() => import('../sections/Testimonials'), { ssr: true });
const Faq = dynamic(() => import('../sections/Faq'), { ssr: true });
const Cta = dynamic(() => import('../sections/Cta'), { ssr: true });

const Home: React.FC = () => (
  <>
    <SEO />
    <Hero />
    <IntroSection />
    <Timeline />
    <Comparison />
    <Testimonials />
    <Faq />
    <Cta />
  </>
);

export default Home;
