import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { Eye } from 'lucide-react';
import { colors } from '../../styles/colors';
import { useMenu } from '../../components/layout/MenuContext';
// minimal hero variant

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { open: menuOpen, toggle: toggleMenu } = useMenu();

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

  const locationLabel = locationLoading ? 'Carregando...' : (locationData ? `${locationData.city ? locationData.city + ', ' : ''}${locationData.region ? locationData.region + ', ' : ''}${locationData.country_name || ''}` : 'Localização desconhecida');
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Anima quando a seção está visível (pelo menos 20% dela)
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger quando 20% da seção estiver visível
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleNav = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  

  return (
    <section
      ref={sectionRef}
      id="section-0"
      className="w-full relative overflow-hidden"
      style={{ height: '80vh', minHeight: '420px', backgroundColor: colors.background.dark }}
    >
     

      {/* Content */}
      <div className="relative z-[30] flex items-start justify-center h-full px-0 sm:px-1 md:px-2 lg:px-4 pt-12 md:pt-8 pb-6 lg:py-10">
        
          <div className="w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 items-start gap-4 md:gap-8">
            {/* Left: oversized display heading */}
            <div className="md:col-span-8 lg:col-span-8 flex items-start pr-2 md:pr-4 lg:pr-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                className="display-heading uppercase w-full text-white/95"
                style={{ WebkitTextStroke: '0px transparent' }}
              >
                Soluções em tecnologia pensadas para impulsionar o seu negócio
              </motion.h1>
            </div>

            {/* Right: compact copy, badges, CTA */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col items-start justify-center gap-6 mt-6 md:mt-12 px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="flex flex-wrap items-start gap-3"
              >

              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="text-left text-sm md:text-base text-white/85 max-w-[320px] leading-relaxed"
              >
              Da presença digital a plataformas completas, criamos soluções tecnológicas robustas, seguras e escaláveis, projetadas para sustentar a operação, reduzir riscos e impulsionar o crescimento do negócio.              </motion.h2>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="mt-2 flex flex-col"
              >
                <ButtonCta label="Soluções" className="min-w-[160px]" />

              </motion.div>

              {/* Info grid (Active Ingredients / Chapters) */}
              <div className="mt-6 w-full max-w-[420px] relative">
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="py-2">
                    <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Hora do Brasil</div>
                  </div>

                  <div className="py-2 flex items-center justify-end text-xs text-white/70" aria-live="polite">
                    <div className="text-lg font-mono tracking-wide whitespace-nowrap">{brazilTimeStr}</div>
                  </div>

                  <div className="py-2">
                    <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Localização</div>
                  </div>

                  <div className="py-2 flex items-center justify-end text-xs text-white/70">
                    <div className="text-right">{locationLabel}</div>
                  </div>

                  <div className="py-2">
                    <div className="text-xs uppercase tracking-widest" style={{ color: colors.text.dark }}>Usuários agora</div>
                  </div>

                  <div className="py-2 flex items-center justify-end gap-2 text-xs text-white/70">
                    <Eye className="w-4 h-4 opacity-60" />
                    <div className="font-mono text-sm">{activeUsers === null ? '—' : activeUsers}</div>
                  </div>
                </div>

                {/* Barcode / visual block */}
                <div className="mt-6 flex justify-start">
                </div>

                {/* Corner bracket icons using local SVG (rotated to match each corner) */}
                <img src="/images/icons/square-icon.svg" alt="" className="absolute -left-3 -top-3 w-4 h-4" style={{ transform: 'rotate(0deg)', opacity: 0.12 }} />
                <img src="/images/icons/square-icon.svg" alt="" className="absolute -right-3 -top-3 w-4 h-4" style={{ transform: 'rotate(90deg)', opacity: 0.12 }} />
                <img src="/images/icons/square-icon.svg" alt="" className="absolute -left-3 -bottom-3 w-4 h-4" style={{ transform: 'rotate(270deg)', opacity: 0.12 }} />
                <img src="/images/icons/square-icon.svg" alt="" className="absolute -right-3 -bottom-3 w-4 h-4" style={{ transform: 'rotate(180deg)', opacity: 0.12 }} />

              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
