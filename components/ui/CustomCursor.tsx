import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Aro externo grande */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-gray-400/30 dark:border-white/20 transition-transform duration-150 ease-out hidden lg:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Bolinha interna pequena */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-gray-600 dark:bg-white transition-transform duration-75 ease-out hidden lg:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '8px',
          height: '8px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CustomCursor;
