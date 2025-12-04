import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';

// Core sections (lazy-loaded for perf)
const Hero = dynamic(() => import('../sections/Hero'));
const ServicesCarousel = dynamic(() => import('../sections/ServicesCarousel'));
const Clients = dynamic(() => import('../sections/Clients'));
const Services = dynamic(() => import('../sections/Services'));
const Projects = dynamic(() => import('../sections/Projects'));
const FAQ = dynamic(() => import('../sections/FAQ'));
const Footer = dynamic(() => import('../sections/Footer'));

const Home: React.FC = () => (
  <>
    <SEO />
    <Hero />
    <ServicesCarousel />
    <Clients />
    <Services />
    <Projects />
    <FAQ />
    <Footer />
  </>
);

export default Home;