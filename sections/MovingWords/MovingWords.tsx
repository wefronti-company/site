import React, { useEffect, useRef } from 'react';
import { colors } from '../../styles/colors';

const words = [
  'Aplicativos Mobile',
  'Dashboards',
  'Saas',
  'Sistemas Web',
  'Desenvolvimento de Softwares',
  'Websites',
];

const ArrowIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#3774d5', size = 16 }) => (
  // diagonal up-right arrow with rounded caps. The shaft is a thick diagonal line,
  // the head is formed by two short perpendicular strokes so it visually matches the
  // reference (45° angle, bold/rounded style).
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 20 L20 4" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4 L20 4 L20 10" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MovingWords: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let lastScroll = window.scrollY;

    const onFrame = () => {
      const rect = container.getBoundingClientRect();
      // use the container center as reference
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top + rect.height / 2) / viewportHeight));

      // compute translateX from progress (-distance .. distance) in alternating direction
      const distance = 120; // px max shift
      const offset = (progress - 0.5) * 2 * distance; // -distance..distance

      // baseOffset moves the whole ticker slightly to the left so the first word
      // appears partly cut off and gives the effect of words flowing out of the sides.
      const baseOffset = 84; // px - tweak this if you want more/less cutoff

      // Use scroll delta for slight parallax
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      // Combine offsets
      (content.style as any).transform = `translateX(${-baseOffset - offset - delta * 0.3}px)`;

      rafRef.current = requestAnimationFrame(onFrame);
    };

    rafRef.current = requestAnimationFrame(onFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // duplicate the words list so the sequence flows from the end back to the beginning
  const displayWords = [...words, ...words];

  return (
    <section
      aria-label="skills-ticker"
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{ backgroundColor: colors.whiteColor }}
    >
      {/* Make this container truly full width (remove centered max-width) so it doesn't cut words */}
      {/* full-bleed container: use viewport width and remove horizontal padding so words can extend to the edges */}
      <div className="w-screen max-w-none mx-auto py-8 md:py-8 px-0">
        <div className="relative overflow-hidden">
          <div
            ref={contentRef}
            className="flex items-center gap-4 whitespace-nowrap transition-transform will-change-transform"
            style={{ color: colors.blackColor, fontWeight: 500, fontSize: '1.15rem' }}
          >
            {displayWords.map((w, idx) => (
              <div key={`${w}-${idx}`} className="flex items-center gap-2 mr-12 md:mr-16">
                <div style={{ color: colors.blueColor }} aria-hidden>
                  <ArrowIcon color={colors.blueColor} size={14} />
                </div>
                <div style={{ color: colors.blackColor }}>{w}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovingWords;
