import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight } from 'lucide-react';
import { colors } from '../../styles/colors';
import { useMenu } from '../../components/layout/MenuContext';
// minimal hero variant

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { open: menuOpen, toggle: toggleMenu } = useMenu();

  // Brazil clock (client-side, using São Paulo timezone) split into time + meridiem to avoid wrapping
  const [brazilTimeStr, setBrazilTimeStr] = useState<string>('—:—:—');
  const [brazilMeridiem, setBrazilMeridiem] = useState<string>('');
  useEffect(() => {
    const update = () => {
      try {
        const dtf = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'America/Sao_Paulo'
        });
        if ((dtf as any).formatToParts) {
          const parts = (dtf as any).formatToParts(new Date());
          const hour = parts.find((p: any) => p.type === 'hour')?.value || '';
          const minute = parts.find((p: any) => p.type === 'minute')?.value || '';
          const second = parts.find((p: any) => p.type === 'second')?.value || '';
          const day = parts.find((p: any) => p.type === 'dayPeriod')?.value || '';
          setBrazilTimeStr(`${hour}:${minute}:${second}`);
          setBrazilMeridiem(day);
        } else {
          const s = dtf.format(new Date());
          const [time, meridiem] = s.split(' ');
          setBrazilTimeStr(time || s);
          setBrazilMeridiem(meridiem || '');
        }
      } catch (e) {
        const s = new Date().toLocaleTimeString();
        setBrazilTimeStr(s);
        setBrazilMeridiem('');
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
                className="display-heading w-full text-white/95 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-400"
                style={{ WebkitTextStroke: '0px transparent' }}
              >
                Soluções em tecnologia para impulsionar o seu negócio
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
                className="mt-2"
              >
                <ButtonCta label="Soluções" />
                <div className="mt-3">
                </div>
              </motion.div>

              {/* Info grid (Active Ingredients / Chapters) */}
              <div className="mt-6 w-full max-w-[420px] relative">
                <div className="grid grid-cols-2 gap-2 items-start">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400">Hora do Brasil</div>
                  </div>

                  <div className="text-xs text-right text-white/70">
                      <div className="flex items-baseline gap-2 justify-end whitespace-nowrap" aria-live="polite">
                      <div className="text-lg font-mono tracking-wide">{brazilTimeStr}</div>
                      <div className="text-sm opacity-70">{brazilMeridiem}</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs uppercase tracking-widest text-gray-400">Localização</div>
                  </div>

                  <div className="text-xs text-right text-white/70">
                    <div className="py-2 pt-2">{locationLabel}</div>
                    {/* <div className="text-xs text-white/50 mt-1">IP: {locationIp}</div> */}
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
