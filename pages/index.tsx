import React from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import Clients from '../sections/Clients';
import CTA from '../sections/CTA';
import Sobre from '../sections/Sobre/Sobre';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

const Home: React.FC = () => (
  <>
    <SEO />
    <Hero />
    <Clients />
    <CTA />
    <Sobre />
    <FAQ />
    <Footer />
  </>
);

export default Home;