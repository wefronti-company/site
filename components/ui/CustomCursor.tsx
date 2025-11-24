import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
 const [position, setPosition] = useState({ x: 0, y: 0 });
 const [isVisible, setIsVisible] = useState(false);
 const [isMounted, setIsMounted] = useState(false);

 useEffect(() => {
 setIsMounted(true);
 
 const handleMouseMove = (e: MouseEvent) => {
 setPosition({ x: e.clientX, y: e.clientY });
 if (!isVisible) setIsVisible(true);
 };

 const handleMouseLeave = () => {
 setIsVisible(false);
 };

 window.addEventListener('mousemove', handleMouseMove);
 window.addEventListener('mouseleave', handleMouseLeave);

 return () => {
 window.removeEventListener('mousemove', handleMouseMove);
 window.removeEventListener('mouseleave', handleMouseLeave);
 };
 }, [isVisible]);

 if (!isMounted || !isVisible) return null;

 return (
 <>
 {/* Aro externo grande */}
 <div
 className="fixed pointer-events-none rounded-full border-2 border-gray-400/30 transition-transform duration-150 ease-out hidden lg:block"
 style={{
 left: `${position.x}px`,
 top: `${position.y}px`,
 width: '40px',
 height: '40px',
 transform: 'translate(-50%, -50%)',
 zIndex: 99999,
 }}
 />
 
 {/* Bolinha interna pequena */}
 <div
 className="fixed pointer-events-none rounded-full bg-gray-600 transition-transform duration-75 ease-out hidden lg:block"
 style={{
 left: `${position.x}px`,
 top: `${position.y}px`,
 width: '8px',
 height: '8px',
 transform: 'translate(-50%, -50%)',
 zIndex: 99999,
 }}
 />
 </>
 );
};

export default CustomCursor;
