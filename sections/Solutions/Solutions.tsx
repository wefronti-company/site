import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';

const Solutions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((([entry]) => {
      setIsVisible(entry.isIntersecting);
    }) as IntersectionObserverCallback, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="w-full py-12 md:py-20"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {/* Header: left badge + right title/subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 flex items-start"
            >
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ width: 10, height: 10, background: '#bfffae', borderRadius: 4 }} />
                <span className="text-xs font-medium" style={{ color: colors.text.dark }}>THE INTEGRATED PLATFORM</span>
              </div>
            </motion.div>

            <div className="md:col-span-10">
              <motion.h2
                initial={{ opacity: 0, x: 10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-3xl md:text-5xl font-medium leading-tight"
                style={{ color: colors.text.dark }}
              >
                Combining synthetic biology, chemistry, and AI into an engine of discovery.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="mt-4 text-base md:text-lg text-gray-700 max-w-3xl"
              >
                Our platform enables precise, dynamic control of biological targets and pathways, generating high-fidelity datasets that, combined with advanced AI, unlock systematic exploration of previously inaccessible chemical space.
              </motion.p>
            </div>
          </div>

          {/* Three cards aligned left-to-right */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Card 1 - Optogenetics (green) */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: '#cfffbe' }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  {/* decorative icon */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0e2b20" strokeWidth="1.5"><circle cx="12" cy="12" r="6"/></svg>
                </div>
                <div className="text-sm text-gray-600">01.</div>
              </div>

              <h3 className="mt-8 text-2xl font-medium" style={{ color: '#0e2b20' }}>Optogenetics</h3>
              <p className="mt-4 text-base text-gray-800 max-w-md">We harness light to control biology with unmatched precision.</p>
            </div>

            {/* Card 2 - Chemistry (dark) */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: '#122625' }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"><path d="M12 2l4 7-4 7-4-7 4-7z"/></svg>
                </div>
                <div className="text-sm text-white/60">02.</div>
              </div>

              <h3 className="mt-8 text-2xl font-medium" style={{ color: '#ffffff' }}>Chemistry</h3>
              <p className="mt-4 text-base text-gray-200 max-w-md">We apply the latest chemistry tools to optimize our drug discovery.</p>
            </div>

            {/* Card 3 - AI (light) */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: '#e9efe9' }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#12201a" strokeWidth="1.5"><polyline points="8 6 16 12 8 18"/></svg>
                </div>
                <div className="text-sm text-gray-700">03.</div>
              </div>

              <h3 className="mt-8 text-2xl font-medium" style={{ color: '#12201a' }}>AI</h3>
              <p className="mt-4 text-base text-gray-800 max-w-md">We power our platform with an AI engine fueled by differentiated datasets.</p>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Solutions;
