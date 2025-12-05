import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';
import AppBar from '../components/layout/AppBar';
import Hero from '../sections/Hero';

// Lazy load below-the-fold sections
const ServicesCarousel = dynamic(() => import('../sections/ServicesCarousel'), { ssr: false });
const Clients = dynamic(() => import('../sections/Clients'), { ssr: false });
const ScrollDivider = dynamic(() => import('../components/ui/ScrollDivider'), { ssr: false });
const Services = dynamic(() => import('../sections/Services'), { ssr: false });
const FAQ = dynamic(() => import('../sections/FAQ'), { ssr: false });
const CTA = dynamic(() => import('../sections/CTA'), { ssr: false });
const Footer = dynamic(() => import('../sections/Footer'), { ssr: false });

const Home: React.FC = () => (
  <>
    <SEO />
    <AppBar />
    <Hero />
    <ServicesCarousel />
    <Clients />
    <ScrollDivider />
    <Services />
    <FAQ />
    <CTA />
    <Footer />
  </>
);

export default Home;