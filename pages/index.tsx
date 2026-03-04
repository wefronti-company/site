import React from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import ValoresCarousel from '../sections/ValoresCarousel';
import Testimonials from '../sections/Testimonials';
import Timeline from '../sections/Timeline';
import Tecnologias from '../sections/Tecnologias';
import Pricing from '../sections/Pricing';
import Comparison from '../sections/Comparison';
import Faq from '../sections/Faq';
import Cta from '../sections/Cta';
import Footer from '../sections/Footer';

const Home: React.FC = () => (
  <>
    <SEO />
    <Hero />
    <Timeline />
    <ValoresCarousel />
    <Testimonials />
    <Tecnologias />
    <Pricing />
    <Comparison />
    <Faq />
    <Cta />
    <Footer />
  </>
);

export default Home;
