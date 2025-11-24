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
    <HorizontalScrollProvider totalSections={7}>
      <SEO />
      <SideMenu />
      
      {/* Desktop: Horizontal Scroll Container - sem margem, menu sobrepõe */}
      <div className="hidden md:block relative overflow-hidden">
        <HorizontalSections />
      </div>
      
      {/* Mobile: Vertical Scroll (Normal) sem menu lateral */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
          <Logo />
        </div>
        
        <Hero />     
        <Clients />
        <Services />
        <Projects />
        <FAQ />
        <Footer />
      </div>
    </HorizontalScrollProvider>
  );
};

// Componente que gerencia as seções horizontais
const HorizontalSections: React.FC = () => {
  const sections = [
    { id: 0, component: Hero },
    { id: 1, component: Clients },
    { id: 2, component: Services },
    { id: 3, component: Projects },
    { id: 4, component: FAQ },
    { id: 5, component: Footer },
    { id: 6, component: FormPage },
  ];

  return (
    <>
      {sections.map(({ id, component: Component }) => (
        <SectionWrapper key={id} index={id}>
          <Component />
        </SectionWrapper>
      ))}
    </>
  );
};

// Wrapper que controla visibilidade e transição
const SectionWrapper: React.FC<{ index: number; children: React.ReactNode }> = ({ 
  index, 
  children 
}) => {
  const { currentSection } = useHorizontalScroll();
  
  const isActive = currentSection === index;
  
  return (
    <div
      className={`
        fixed inset-0 w-screen h-screen
        transition-opacity duration-600 ease-in-out
        ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}
      `}
      style={{
        transitionProperty: 'opacity',
        transitionDuration: '600ms',
      }}
    >
      <div className="pl-24 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Home;