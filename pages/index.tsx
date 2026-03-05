import React from 'react';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';
import IntroSection from '../sections/IntroSection';
import Testimonials from '../sections/Testimonials';
import Timeline from '../sections/Timeline';
import Comparison from '../sections/Comparison';
import Faq from '../sections/Faq';
import Cta from '../sections/Cta';
import Footer from '../sections/Footer';

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
    <Footer />
  </>
);

export default Home;
