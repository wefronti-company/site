import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import { Check, ShoppingCart, BarChart2, Code, ArrowUpRight, CheckCheckIcon, BriefcaseBusiness, ChessKingIcon, RocketIcon, CheckCircle2, CheckSquare2Icon, CheckLineIcon, CheckCheck, GitGraphIcon, Asterisk, AsteriskIcon, AsteriskSquareIcon } from 'lucide-react';
import Menu from '../../components/ui/Menu';

const Solutions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((([entry]) => {
      setIsVisible(entry.isIntersecting);
      // mark that the section has been entered at least once (single-entry animation)
      setHasEntered(prev => prev || entry.isIntersecting);
    }) as IntersectionObserverCallback, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const BASE_SPEED = 80; // px/s base speed (positive -> move right, negative -> move left)

  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const wrapWidthRef = useRef(0);

  // Initialize constant rightward movement
  useEffect(() => {
    // start moving right at base speed
    posRef.current = 0;
    if (marqueeTrackRef.current) {
      wrapWidthRef.current = marqueeTrackRef.current.scrollWidth / 2;
    }
  }, []);

  // Marquee animation runner (requestAnimationFrame) — constant rightward loop (carousel behavior)
  // Start a continuous right->left carousel after the section enters
  useEffect(() => {
    if (!hasEntered) return;
    const el = marqueeTrackRef.current;
    if (!el) return;

    let scrollPosition = 0;
    const speed = 0.5; // pixels per frame (same as ServicesCarousel)

    const animate = () => {
      const track = marqueeTrackRef.current;
      if (!track) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // ensure wrap width is calculated
      if (!wrapWidthRef.current) wrapWidthRef.current = track.scrollWidth / 3;

      // move left
      scrollPosition -= speed;

      const scrollWidth = wrapWidthRef.current || track.scrollWidth / 3;
      if (Math.abs(scrollPosition) >= scrollWidth) {
        scrollPosition = 0;
      }

      track.style.transform = `translateX(${scrollPosition}px)`;
      track.setAttribute('data-pos', String(Math.round(scrollPosition)));

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const track = marqueeTrackRef.current;
      if (track) wrapWidthRef.current = track.scrollWidth / 3;
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [hasEntered]);



  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="w-full pt-14 pb-6 md:pt-18 md:pb-8"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="relative z-[20] px-0 sm:px-1 md:px-2 lg:px-4">
        <div className="w-full max-w-none mx-auto pt-6 md:pt-10">

          {/* Header: badge above title aligned to card 01 content */}
          <div className="w-full max-w-none mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6">

              {/* Badge column: align left with card padding */}
              <div className="col-span-1 pl-8 md:pl-12 flex items-start">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: colors.purple.tertiary }}>
                    <CheckCheck className="w-4 h-4" style={{ color: colors.text.dark }} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.text.dark }}>VEJA COMO PODEMOS LHE AJUDAR</span>
                </motion.div>
              </div>

              {/* Title spans two columns but starts at same left offset */}
              <div className="col-span-2 pl-8 md:pl-12">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="display-heading text-left w-full mt-2"
                  style={{ color: colors.text.dark, fontSize: 'clamp(1.75rem, 4vw, 4.5rem)', lineHeight: 1.04 }}
                >
                  Soluções digitais pensadas para atender diferentes necessidades do seu negócio
                </motion.h2>
              </div>

            </div>
          </div>

          {/* Three cards aligned left-to-right */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch md:-mx-2 lg:-mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Card 1 - Sites & E-commerce */}
            <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: colors.purple.tertiary }}>
              <div className="flex items-start justify-between">
                <motion.div
                  className="w-10 h-10 flex items-center justify-center"
                  animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, delay: 0 }}
                  style={{ willChange: 'transform' }}
                >
                  <ShoppingCart className="w-8 h-8" style={{ color: colors.primary.white }} />
                </motion.div>
                <div className="text-sm" style={{ color: colors.primary.white }}>01.</div>
              </div>

              <h3 className="mt-10 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: colors.primary.white, lineHeight: 1.05 }}>SITES E E-COMMERCE</h3>
              <p className="mt-6 text-base md:text-lg max-w-md leading-relaxed" style={{ color: colors.primary.white }}>Sites institucionais modernos e lojas virtuais completas com checkout otimizado, gestão de produtos e integrações de pagamento.</p>

              <a href="/solucoes/sites" className="mt-8 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.text.light }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.text.light }} /></a>
            </div>

            {/* Card 2 - SaaS & Dashboard */}
            <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: colors.purple.secondary }}>
              <div className="flex items-start justify-between">
                <motion.div
                  className="w-10 h-10 flex items-center justify-center"
                  animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, delay: 0.12 }}
                  style={{ willChange: 'transform' }}
                >
                  <BarChart2 className="w-8 h-8" style={{ color: colors.purple.primary }} />
                </motion.div>
                <div className="text-sm" style={{ color: colors.primary.white }}>02.</div>
              </div>

              <h3 className="mt-10 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: '#ffffff', lineHeight: 1.05 }}>SAAS E DASHBOARD</h3>
              <p className="mt-6 text-base md:text-lg text-gray-200 max-w-md leading-relaxed">Plataformas como serviço prontas para escalar e painéis analíticos interativos para visualizar dados e métricas em tempo real.</p>

              <a href="/solucoes/saas" className="mt-8 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.whiteColor }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.whiteColor }} /></a>
            </div>

            {/* Card 3 - API & Sistemas (light) */}
            <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: colors.purple.tertiary }}>
              <div className="flex items-start justify-between">
                <motion.div
                  className="w-10 h-10 flex items-center justify-center"
                  animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, delay: 0.24 }}
                  style={{ willChange: 'transform' }}
                >
                  <Code className="w-8 h-8" style={{ color: colors.primary.white }} />
                </motion.div>
                <div className="text-sm" style={{ color: colors.primary.white }}>03.</div>
              </div>

              <h3 className="mt-10 text-lg md:text-2xl lg:text-3xl font-light uppercase" style={{ color: colors.primary.white, lineHeight: 1.05 }}>API E SISTEMAS</h3>
              <p className="mt-6 text-base md:text-lg max-w-md leading-relaxed" style={{ color: colors.primary.white }}>Integrações seguras com APIs, além de sistemas web robustos para conectar e automatizar processos do negócio.</p>

              <a href="/solucoes/api" className="mt-8 text-base font-medium inline-flex items-center gap-2 w-max px-0 py-0 cursor-pointer" style={{ color: colors.primary.white }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.primary.white }} /></a>
            </div>

          </motion.div>

          {/* Marquee loop - reacts to scroll direction (down -> left, up -> right) */}
          <motion.div
            className="mt-6 w-screen -mx-4 md:-mx-8 lg:-mx-16"
            initial={{ opacity: 0, y: 18 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            <div className={`marquee ${!isVisible ? 'paused' : ''}`} aria-hidden>
              <div ref={marqueeTrackRef} className="marquee-track flex-nowrap" style={{ '--marquee-duration': '24s' } as React.CSSProperties}>
                {Array.from({ length: 3 }).flatMap((_, r) => (
                  Array.from({ length: 8 }).flatMap((_, i) => ([
                    <div key={`m-${r}-${i}`} className="px-2">
                      <span className="text-2xl md:text-4xl lg:text-4xl font-light tracking-tight" style={{ color: colors.text.dark }}>Código é só o meio, o foco é o resultado</span>
                    </div>,

                    <div key={`c-${r}-${i}`} className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
                      <div aria-hidden className="w-12 h-12 md:w-12 md:h-12 flex items-center justify-center" style={{ borderRadius: '999px', backgroundColor: colors.purple.tertiary }}>
                        <Asterisk className="w-6 h-6 md:w-6 md:h-6" style={{ color: colors.primary.white }} />
                      </div>
                    </div>
                  ]))
                ))}
              </div>
            </div>
          </motion.div>

          {/* Solutions-only centered menu */}
          <Menu />

        </div>
      </div>
    </section>
  );
};

export default Solutions;
