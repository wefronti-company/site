import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { Eye } from 'lucide-react';
import { colors } from '../../styles/colors';
import { useMenu } from '../../components/layout/MenuContext';

const ServicesCarousel = dynamic(() => import('../../sections/ServicesCarousel'), { ssr: false });
// minimal hero variant

const Hero: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isOverlapped, setIsOverlapped] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { open: menuOpen, toggle: toggleMenu } = useMenu();

  // Disable pointer-events on hero once user scrolls so underlying sections receive events
  useEffect(() => {
    const onScroll = () => {
      setIsOverlapped(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Brazil clock (client-side, using São Paulo timezone) split into time + meridiem to avoid wrapping
  // Brazil clock (24h) — using Sao_Paulo timezone and ensuring no meridiem
  const [brazilTimeStr, setBrazilTimeStr] = useState<string>('—:—:—');
  useEffect(() => {
    const update = () => {
      try {
        const dtf = new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo'
        });
        setBrazilTimeStr(dtf.format(new Date()));
      } catch (e) {
        setBrazilTimeStr(new Date().toLocaleTimeString());
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch user's location from IP with fallback providers and a loading state
  const [locationData, setLocationData] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  useEffect(() => {
    let cancelled = false;

    const fetchIpApi = async () => {
      try {
        // Try ipapi.co first
        const r = await fetch('https://ipapi.co/json/');
        if (!r.ok) throw new Error('ipapi failed');
        const d = await r.json();
        if (cancelled) return;
        if (d && (d.city || d.country_name || d.region)) {
          setLocationData({ city: d.city, region: d.region, country_name: d.country_name, ip: d.ip });
          setLocationLoading(false);
          return;
        }
      } catch (e) {
        // fallback to ipwho.is
      }

      try {
        const rWho = await fetch('https://ipwho.is/');
        if (rWho.ok) {
          const dw = await rWho.json();
          if (!cancelled && dw && dw.success) {
            setLocationData({ city: dw.city, region: dw.region, country_name: dw.country, ip: dw.ip });
            setLocationLoading(false);
            return;
          }
        }
      } catch (e) {
        // continue to other fallbacks
      }

      try {
        // get just the ip via ipify
        const r2 = await fetch('https://api.ipify.org?format=json');
        const ipj = r2.ok ? await r2.json() : null;
        const ip = ipj?.ip;
        if (!ip) throw new Error('no ip');

        // query ip-api (supports https)
        const r3 = await fetch(`https://ip-api.com/json/${ip}?fields=status,country,regionName,city,query`);
        if (!r3.ok) throw new Error('ip-api failed');
        const d3 = await r3.json();
        if (d3 && d3.status === 'success') {
          setLocationData({ city: d3.city, region: d3.regionName, country_name: d3.country, ip: d3.query });
          setLocationLoading(false);
          return;
        }
      } catch (e) {
        // final fallback
      }

      if (!cancelled) {
        setLocationData(null);
        setLocationLoading(false);
      }
    };

    fetchIpApi();

    return () => { cancelled = true; };
  }, []);

  const locationLabel = locationLoading ? 'Carregando...' : (locationData ? `${locationData.region || ''}${locationData.country_name ? ', ' + locationData.country_name : ''}`.replace(/^, /, '') : 'Localização desconhecida');
  const locationIp = locationLoading ? '—' : (locationData?.ip || '—');

  // Active users (poll /api/active-users with a stable visitorId saved in localStorage)
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;

    const getVisitorId = () => {
      try {
        let id = localStorage.getItem('visitorId');
        if (!id) {
          id = `v_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
          localStorage.setItem('visitorId', id);
        }
        return id;
      } catch (e) {
        return `v_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      }
    };

    const id = getVisitorId();

    const fetchActive = async () => {
      try {
        const r = await fetch(`/api/active-users?visitorId=${encodeURIComponent(id)}`);
        if (!r.ok) throw new Error('active api failed');
        const d = await r.json();
        if (!cancelled) setActiveUsers(typeof d.active === 'number' ? d.active : null);
      } catch (e) {
        if (!cancelled) setActiveUsers(null);
      }
    };

    fetchActive();
    const t = setInterval(fetchActive, 10 * 1000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  useEffect(() => {
    if (hasEntered) return; // already animated once
    let cancelled = false;
    let obs: IntersectionObserver | null = null;

    obs = new IntersectionObserver((([entry]) => {
      if (entry.isIntersecting && !cancelled) {
        setHasEntered(true);
        if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
      }
    }) as IntersectionObserverCallback, { threshold: 0.2, rootMargin: '0px' });

    if (sectionRef.current && obs) obs.observe(sectionRef.current);

    return () => {
      cancelled = true;
      if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
    };
  }, [hasEntered]);

  const handleNav = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  

  return (
    <section
      ref={sectionRef}
      id="section-0"
      className="w-full fixed inset-0 overflow-hidden"
      style={{ height: '100vh', minHeight: '420px', backgroundColor: colors.background.dark, zIndex: 0, pointerEvents: isOverlapped ? 'none' : 'auto' }}
    >

      {/* Top services carousel inside Hero */}
      <div className="absolute top-0 left-0 w-full z-[20]">
        <ServicesCarousel />
      </div>
     

      {/* Content */}
      <div className="relative z-[30] flex items-start md:items-end justify-center h-full px-0 sm:px-1 md:px-2 lg:px-4 pb-12">
        
          <div className="w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 items-stretch gap-4 md:gap-8 h-full">
            {/* Left: oversized display heading */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col items-start pr-2 md:pr-4 lg:pr-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mt-auto">
                  <div className="mb-12">
                    <Image src="/images/brand/isologo-white.webp" alt="Logo wefronti"  width={148} height={148} priority />
                  </div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                    className="display-heading uppercase w-full"
                    style={{ color: colors.green.primary, WebkitTextStroke: '0px transparent' }}
                  >
                    Soluções em tecnologia pensadas para <span style={{ color: colors.green.tertiary }}>Impulsionar seu negócio</span>
                  </motion.h1>
                </div>
              </div>
            </div> 

            {/* Right: compact copy, badges, CTA */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col items-start gap-6 pl-2 md:pl-4 lg:pl-6 md:relative md:h-full">
              <div className="w-full md:absolute md:bottom-0 md:right-4 lg:right-6 flex flex-col md:justify-end" style={{ maxWidth: '360px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="flex flex-wrap items-start gap-3"
                >

                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                  className="text-left text-sm md:text-base max-w-[360px] leading-7 md:leading-8"
                  style={{ color: colors.text.light , fontSize: '22px', fontWeight: 300 }}
                >
                Da presença digital a plataformas completas, criamos soluções tecnológicas robustas, seguras e escaláveis, projetadas para sustentar a operação, reduzir riscos e impulsionar o crescimento do negócio.              </motion.h2>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                  className="mt-4 mb-6 flex flex-col"
                >
                  <ButtonCta label="Soluções" design="split" className="w-auto" onClick={() => handleNav('#solutions')} />

                </motion.div>

                {/* Info grid (Active Ingredients / Chapters) */}
                <div className="w-full max-w-[420px] relative">
                  <div className="grid grid-cols-[auto_minmax(140px,240px)] gap-1 items-center">
                    <div className="py-1">
                      <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Hora do Brasil</div>
                    </div>

                    <div className="py-1 flex items-center justify-end text-xs text-white/70" aria-live="polite">
                      <div className="text-sm tracking-wide whitespace-nowrap">{brazilTimeStr}</div>
                    </div>

                    <div className="py-1">
                      <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Localização</div>
                    </div>

                    <div className="py-1 flex items-center justify-end text-xs text-white/70">
                      <div className="text-sm text-right">{locationLabel}</div>
                    </div>

                    <div className="py-1">
                      <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Navegando</div>
                    </div>

                    <div className="py-1 flex items-center justify-end gap-2 text-xs text-white/70">
                      <Eye className="w-4 h-4 opacity-60" />
                      <div className="text-sm leading-none">{activeUsers === null ? '—' : activeUsers}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
