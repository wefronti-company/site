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

export const HorizontalScrollProvider: React.FC<HorizontalScrollProviderProps> = ({ 
  children, 
  totalSections 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSection(index);
    
    // Transição dura 600ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return; // Skip on mobile
      
      if (e.key === 'ArrowRight') {
        nextSection();
      } else if (e.key === 'ArrowLeft') {
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
