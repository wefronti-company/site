import React from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import Comparative from '../sections/Comparative';
import Clients from '../sections/Clients';
import CTA from '../sections/CTA';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

const Home: React.FC = () => (
  <>
    <SEO />
    <Hero />
    <Services />
    <Comparative />
    <Clients />
    <CTA />
    <FAQ />
    <Footer />
  </>
);

export default Home;