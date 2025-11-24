import React from 'react';

/**
 * Grid animado leve usando apenas CSS
 * Substitui AnimatedGridBackground (686 linhas com Three.js)
 * Reduz bundle em ~500KB
 */
const LightweightGrid: React.FC = () => {
 return (
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 {/* Grid Pattern */}
 <div 
 className="absolute inset-0 opacity-[0.03]"
 style={{
 backgroundImage: `
 linear-gradient(to right, currentColor 1px, transparent 1px),
 linear-gradient(to bottom, currentColor 1px, transparent 1px)
 `,
 backgroundSize: '60px 60px',
 }}
 />
 
 {/* Gradient Overlay */}
 <div 
 className="absolute inset-0"
 style={{
 background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 100%)',
 }}
 />
 
 {/* Animated Dots */}
 <div className="absolute inset-0">
 {[...Array(12)].map((_, i) => (
 <div
 key={i}
 className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
 style={{
 left: `${Math.random() * 100}%`,
 top: `${Math.random() * 100}%`,
 animationDelay: `${Math.random() * 2}s`,
 animationDuration: `${2 + Math.random() * 2}s`,
 }}
 />
 ))}
 </div>
 </div>
 );
};

export default LightweightGrid;
