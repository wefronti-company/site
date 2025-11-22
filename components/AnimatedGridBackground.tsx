import React, { useEffect, useRef, useState } from 'react';

interface PixelBlastProps {
  variant?: 'circle' | 'square';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  speed?: number;
  edgeFade?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  liquid?: boolean;
  liquidStrength?: number;
}

const AnimatedGridBackground: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 4,
  patternScale = 2.5,
  speed = 0.6,
  edgeFade = 0.25,
  enableRipples = true,
  rippleSpeed = 0.4,
  liquid = true,
  liquidStrength = 0.12,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += speed * 0.01;
      
      const cols = Math.floor(canvas.width / (pixelSize * patternScale));
      const rows = Math.floor(canvas.height / (pixelSize * patternScale));
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * pixelSize * patternScale;
          const y = j * pixelSize * patternScale;
          
          // Ondas e ripples
          let wave = 0;
          
          if (enableRipples) {
            const wave1 = Math.sin(i * 0.15 + time * rippleSpeed * 3) * Math.cos(j * 0.15 + time * rippleSpeed * 3);
            const wave2 = Math.sin(i * 0.08 - time * rippleSpeed * 2) * Math.cos(j * 0.08 + time * rippleSpeed * 2);
            wave = (wave1 + wave2) * 0.5;
          }
          
          // Efeito liquid
          if (liquid) {
            const liquidWave = Math.sin(i * 0.1 + time * 2) * Math.cos(j * 0.1 - time * 1.5);
            wave += liquidWave * liquidStrength * 3;
          }
          
          // Edge fade
          const edgeDistX = Math.min(i / (cols * edgeFade), (cols - i) / (cols * edgeFade));
          const edgeDistY = Math.min(j / (rows * edgeFade), (rows - j) / (rows * edgeFade));
          const edgeFactor = Math.min(edgeDistX, edgeDistY, 1);
          
          if (wave > 0.1) {
            const opacity = Math.min(wave * 0.5 * edgeFactor, 0.4);
            const size = pixelSize * (1 + wave * 0.2);
            
            ctx.fillStyle = isDark 
              ? `rgba(255, 255, 255, ${opacity})` 
              : `rgba(0, 0, 0, ${opacity})`;
            
            if (variant === 'circle') {
              ctx.beginPath();
              ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, size, size);
            }
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark, variant, pixelSize, patternScale, speed, edgeFade, enableRipples, rippleSpeed, liquid, liquidStrength]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 0.8 }}
      />
    </div>
  );
};

export default AnimatedGridBackground;
