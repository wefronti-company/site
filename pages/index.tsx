import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';
import Hero from '../sections/Hero';

// Lazy load below-the-fold sections
const Solutions = dynamic(() => import('../sections/Solutions'), { ssr: false });
const Clients = dynamic(() => import('../sections/Clients'), { ssr: false });
const ScrollDivider = dynamic(() => import('../components/ui/ScrollDivider'), { ssr: false });
const Services = dynamic(() => import('../sections/Services'), { ssr: false });
const FAQ = dynamic(() => import('../sections/FAQ'), { ssr: false });
const CTA = dynamic(() => import('../sections/CTA'), { ssr: false });
const Footer = dynamic(() => import('../sections/Footer'), { ssr: false });

const Home: React.FC = () => (
  <>
    <SEO />
    {/* Hero is fixed and should be visually below the header; other sections are wrapped so they start after the hero (100vh) and will scroll over it */}
    <Hero />

    {/* spacer preserves exact hero height so below sections start after it */}
    <div aria-hidden style={{height: '100vh'}} />

    <div className="relative z-[20]">
      <Solutions />
      <Clients />
      <Services />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  </>
);

export default Home;