import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface HorizontalScrollContextType {
  currentSection: number;
  totalSections: number;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  isTransitioning: boolean;
}

const HorizontalScrollContext = createContext<HorizontalScrollContextType | undefined>(undefined);

interface HorizontalScrollProviderProps {
  children: React.ReactNode;
  totalSections: number;
}

export const HorizontalScrollProvider: React.FC<HorizontalScrollProviderProps> = ({ children, totalSections }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smoothly scrolls to a section by index. Expects elements with ids: section-{index}
  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isTransitioning) return;

    const el = document.getElementById(`section-${index}`);
    if (!el) return;

    setIsTransitioning(true);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // wait for scroll to finish (approx); then allow transitions again
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentSection(index);
    }, 600);

    return () => clearTimeout(timeout);
  }, [totalSections, isTransitioning]);

  const nextSection = useCallback(() => {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, goToSection]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  // Track which section is in view using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (!id) return;
          const match = id.match(/section-(\d+)/);
          if (!match) return;
          const idx = Number(match[1]);
          if (entry.isIntersecting) {
            setCurrentSection(idx);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    // Observe all section elements with id section-<index>
    for (let i = 0; i < totalSections; i++) {
      const el = document.getElementById(`section-${i}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [totalSections]);

  // Keyboard navigation (up/down arrows for vertical behavior)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return; // Skip on mobile

      if (e.key === 'ArrowDown') {
        nextSection();
      } else if (e.key === 'ArrowUp') {
        prevSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSection, prevSection]);

  return (
    <HorizontalScrollContext.Provider
      value={{
        currentSection,
        totalSections,
        goToSection,
        nextSection,
        prevSection,
        isTransitioning,
      }}
    >
      {children}
    </HorizontalScrollContext.Provider>
  );
};

export const useHorizontalScroll = () => {
  const context = useContext(HorizontalScrollContext);
  if (!context) {
    throw new Error('useHorizontalScroll must be used within HorizontalScrollProvider');
  }
  return context;
};
