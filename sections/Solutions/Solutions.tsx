import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import { Check, ShoppingCart, BarChart2, Code, ArrowUpRight, CheckLineIcon, CheckCircle2, CheckSquareIcon, CheckSquare2Icon } from 'lucide-react';

const Solutions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((([entry]) => {
      setIsVisible(entry.isIntersecting);
    }) as IntersectionObserverCallback, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const BASE_SPEED = 80; // px/s base speed (positive -> move right, negative -> move left)

  // Marquee direction based on scroll / wheel (keeps state for reference)
  const [marqueeDirection, setMarqueeDirection] = useState<'left'|'right'>('left');
  const lastScrollY = useRef(0);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const currentSpeedRef = useRef(0);
  const desiredSpeedRef = useRef(-BASE_SPEED); // start moving left by default
  const wrapWidthRef = useRef(0);

  useEffect(() => {
    // initialize scroll position
    lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;

    const onWheel = (e: WheelEvent) => {
      setMarqueeDirection(e.deltaY > 0 ? 'left' : 'right');
      desiredSpeedRef.current = e.deltaY > 0 ? -BASE_SPEED : BASE_SPEED;
    };

    let ticking = false;
    const SCROLL_FACTOR = 6; // multiplier for immediate scroll response
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          const delta = current - lastScrollY.current;
          const dir = delta > 0 ? 'left' : 'right';

          // Update direction / desired speed (for continued movement)
          setMarqueeDirection(dir);
          desiredSpeedRef.current = dir === 'left' ? -BASE_SPEED : BASE_SPEED;

          // Immediate positional update tied to the scroll delta for direct feel
          if (delta !== 0) {
            // scrolling down (delta>0) moves marquee left (negative X)
            posRef.current += -delta * SCROLL_FACTOR;

            const track = marqueeTrackRef.current;
            if (track) {
              const wrap = wrapWidthRef.current || track.scrollWidth / 2 || 1;
              // normalize wrap and wrap position
              if (posRef.current <= -wrap) posRef.current += wrap;
              if (posRef.current > 0) posRef.current -= wrap;
              track.style.transform = `translateX(${Math.round(posRef.current)}px)`;
              track.setAttribute('data-pos', String(Math.round(posRef.current)));
            }
          }

          lastScrollY.current = current;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Marquee animation runner (requestAnimationFrame) — smooth speed interpolation
  useEffect(() => {
    const runner = (time: number) => {
      const track = marqueeTrackRef.current;
      if (!track) {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        return;
      }

      const now = performance.now();
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min(0.06, (now - lastTimeRef.current) / 1000); // cap dt
      lastTimeRef.current = now;

      // Update wrap width if unknown or resized
      if (!wrapWidthRef.current) {
        wrapWidthRef.current = track.scrollWidth / 2;
      }

      // Smoothly interpolate current speed towards desired speed
      const alpha = 1 - Math.pow(0.001, dt); // smoothing factor ~ responsive to dt
      currentSpeedRef.current += (desiredSpeedRef.current - currentSpeedRef.current) * alpha;

      // Update position
      // If section is not visible, still move but at reduced intensity to save distraction
      const visibilityFactor = isVisible ? 1 : 0.35;
      posRef.current += currentSpeedRef.current * dt * visibilityFactor;

      // Wrap position within [-wrapWidth, 0)
      const wrap = wrapWidthRef.current || track.scrollWidth / 2 || 1;
      if (posRef.current <= -wrap) posRef.current += wrap;
      if (posRef.current > 0) posRef.current -= wrap;

      track.style.transform = `translateX(${Math.round(posRef.current)}px)`;
      // debug hook for quick inspection in the DOM
      track.setAttribute('data-pos', String(Math.round(posRef.current)));
      animFrameRef.current = requestAnimationFrame(runner);
    };

    // reset values (ensure immediate movement)
    desiredSpeedRef.current = marqueeDirection === 'left' ? -BASE_SPEED : BASE_SPEED;
    currentSpeedRef.current = desiredSpeedRef.current;

    if (!animFrameRef.current) animFrameRef.current = requestAnimationFrame(runner);

    const onResize = () => {
      const track = marqueeTrackRef.current;
      if (track) {
        wrapWidthRef.current = track.scrollWidth / 2;
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [isVisible, marqueeDirection]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="w-full py-12 md:py-20"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="relative z-[20] px-0 sm:px-1 md:px-2 lg:px-4">
        <div className="w-full max-w-none mx-auto">

          {/* Header: badge (width = card 1) + title/subtitle — match hero alignment */}
          <div className="w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 items-center gap-6 px-4 md:px-0">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-4 flex items-start"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <Check className="w-4 h-4" style={{ color: colors.text.dark }} strokeWidth={2} />
                <span className="text-sm font-medium uppercase" style={{ color: colors.text.dark }}>VEJA COMO PODEMOS LHE AJUDAR</span>
              </div>
            </motion.div>

            <div className="md:col-span-8">
              <motion.h2
                initial={{ opacity: 0, x: 10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-3xl md:text-5xl lg:text-[74px] font-light uppercase leading-tight"
                style={{ color: colors.text.dark }}
              >
                Soluções digitais pensadas para atender diferentes necessidades do negócio
              </motion.h2>

              
            </div>
          </div>

          {/* Three cards aligned left-to-right */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch md:-mx-2 lg:-mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Card 1 - Sites & E-commerce */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.tertiary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8" style={{ color: colors.green.secondary }} />
                </div>
                <div className="text-sm" style={{ color: colors.green.secondary }}>01.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: '#0e2b20' }}>SITES E E-COMMERCE</h3>
              <p className="mt-4 text-base md:text-lg text-gray-800 max-w-md">Sites institucionais modernos e lojas virtuais completas com checkout otimizado, gestão de produtos e integrações de pagamento.</p>

              <a href="/solucoes/sites" className="mt-6 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.text.dark }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.text.dark }} /></a>
            </div>

            {/* Card 2 - SaaS & Dashboard */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.secondary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8" style={{ color: colors.green.primary }} />
                </div>
                <div className="text-sm text-white/60">02.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: colors.green.primary }}>SAAS E DASHBOARD</h3>
              <p className="mt-4 text-base md:text-lg text-gray-200 max-w-md">Plataformas como serviço prontas para escalar e painéis analíticos interativos para visualizar dados e métricas em tempo real.</p>

              <a href="/solucoes/saas" className="mt-6 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.whiteColor }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.whiteColor }} /></a>
            </div>

            {/* Card 3 - API & Sistemas (light) */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.primary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Code className="w-8 h-8" style={{ color: colors.green.secondary }} />
                </div>
                <div className="text-sm text-gray-700">03.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: '#12201a' }}>API E SISTEMAS</h3>
              <p className="mt-4 text-base md:text-lg text-gray-800 max-w-md">Integrações seguras com APIs, além de sistemas web robustos para conectar e automatizar processos do negócio.</p>

              <a href="/solucoes/api" className="mt-6 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.text.dark }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.text.dark }} /></a>
            </div>

          </motion.div>

          {/* Marquee loop - reacts to scroll direction (down -> left, up -> right) */}
          <div className="mt-10 w-screen -mx-4 md:-mx-8 lg:-mx-16">
            <div className={`marquee ${!isVisible ? 'paused' : ''}`} aria-hidden>
              <div ref={marqueeTrackRef} className="marquee-track flex-nowrap" style={{ '--marquee-duration': '24s' } as React.CSSProperties}>
                {Array.from({ length: 8 }).flatMap((_, i) => ([
                  <div key={`m-${i}`} className="px-6">
                    <span className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight" style={{ color: colors.text.dark }}>Código é só o meio, o foco é o resultado</span>
                  </div>,

                  <div key={`c-${i}`} className="flex items-center justify-center w-21 h-21 md:w-24 md:h-24">
                    <div aria-hidden className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full" style={{ backgroundColor: 'transparent' }}>
                      <CheckSquare2Icon className="w-10 h-10 md:w-10 md:h-10" style={{ background: colors.green.tertiary,  color: colors.green.tertiary }} />
                    </div>
                  </div>
                ]))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Solutions;
