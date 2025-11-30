import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '../sections/Hero';
import SEO from '../components/SEO';
import Logo from '../components/ui/Logo';
import { HorizontalScrollProvider, useHorizontalScroll } from '../contexts/HorizontalScrollContext';
import SideMenu from '../components/ui/SideMenu';

// Lazy load AGRESSIVO com ssr:false para máxima performance
const Clients = dynamic(() => import('../sections/Clients'), {
  ssr: false,
  loading: () => null,
});
const Services = dynamic(() => import('../sections/Services'), {
  ssr: false,
  loading: () => null,
});
const Projects = dynamic(() => import('../sections/Projects'), {
  ssr: false,
  loading: () => null,
});
const FAQ = dynamic(() => import('../sections/FAQ'), {
  ssr: false,
  loading: () => null,
});
const Footer = dynamic(() => import('../sections/Footer'), {
  ssr: false,
  loading: () => null,
});

// Importar página de formulário existente para usar na seção
const FormPage = dynamic(() => import('./form'), {
  ssr: false,
  loading: () => null,
});

const Home: React.FC = () => {
  return (
    <HorizontalScrollProvider totalSections={5}>
      <SEO />
      <SideMenu />

      {/* Page sections — vertically stacked and tracked by the provider */}
      <main className="w-full bg-transparent">
        <section id="section-0">
          <Hero />
        </section>

        <section id="section-1">
          {/* anchor for AppBar nav */}
          <div id="clients" />
          <Clients />
        </section>

        <section id="section-2">
          <div id="services" />
          <Services />
        </section>

        <section id="section-3">
          <div id="projects" />
          <Projects />
        </section>

        <section id="section-4">
          <div id="faq" />
          <FAQ />
        </section>
      </main>
    </HorizontalScrollProvider>
  );
};

// Componente que gerencia as seções horizontais
// (No more horizontal overlay wrappers — sections are standard vertical blocks)

export default Home;