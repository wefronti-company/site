import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';
import AppBar from '../components/layout/AppBar';

// Core sections (lazy-loaded for perf)
const Hero = dynamic(() => import('../sections/Hero'));
const ServicesCarousel = dynamic(() => import('../sections/ServicesCarousel'));
const Clients = dynamic(() => import('../sections/Clients'));
const ScrollDivider = dynamic(() => import('../components/ui/ScrollDivider'));
const Services = dynamic(() => import('../sections/Services'));
const FAQ = dynamic(() => import('../sections/FAQ'));
const CTA = dynamic(() => import('../sections/CTA'));
const Footer = dynamic(() => import('../sections/Footer'));

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