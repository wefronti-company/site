import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { colors } from '../../styles/colors';
import { motion } from 'framer-motion';

interface AccordionItemProps {
  id: string;
  index?: number;
  title: string;
  summary?: string;
  imageSrc?: string;
  children?: React.ReactNode;
}

// Context for grouping accordion items so only one stays open
const AccordionContext = React.createContext<{
  openId?: string;
  setOpenId: (id?: string) => void;
} | null>(null);

export const Accordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openId, setOpenId] = React.useState<string | undefined>(undefined);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, index = 1, title, summary, imageSrc, children }) => {
  // Local state when not used inside grouped Accordion
  const [localOpen, setLocalOpen] = React.useState(false);
  const ctx = React.useContext(AccordionContext);
  const open = ctx ? ctx.openId === id : localOpen;

  // Refs and measurement state to animate to exact pixel heights and avoid jumps
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [measuredHeight, setMeasuredHeight] = React.useState<number>(0);

  const measure = React.useCallback(() => {
    const el = contentRef.current;
    if (el) {
      // scrollHeight captures full content including images
      setMeasuredHeight(el.scrollHeight);
    }
  }, []);

  React.useLayoutEffect(() => {
    measure();
    const el = contentRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.neutral.cardLight}` }}>
      <button
        id={`acc-${id}`}
        type="button"
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        onClick={() => {
          // measure before opening to ensure correct animation height
          if (!open) measure();
          if (ctx) {
            ctx.setOpenId(open ? undefined : id);
          } else {
            setLocalOpen(!localOpen);
          }
        }}
        onKeyDown={(e) => {
          // Ensure Enter / Space toggle on all browsers
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!open) measure();
            if (ctx) {
              ctx.setOpenId(open ? undefined : id);
            } else {
              setLocalOpen(!localOpen);
            }
          }
        }}
        className="w-full flex items-center justify-between px-5 py-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-300 transition"
        style={{ background: 'transparent', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${colors.neutral.cardLight}`, borderRadius: '6px', backgroundColor: 'rgba(115,111,176,0.06)', color: colors.purple.tertiary }} aria-hidden>
            <span className="text-sm font-semibold" style={{ color: colors.purple.tertiary }}>{index}</span>
          </div>

          <div>
            <div className="text-lg md:text-xl lg:text-2xl font-regular" style={{ color: colors.text.primary }}>{title}</div>
            {summary ? <div className="text-sm mt-1" style={{ color: colors.text.secondary }}>{summary}</div> : null}
          </div>
        </div>

        <div className="ml-4 flex-shrink-0">
          {open ? <Minus size={18} style={{ color: colors.purple.tertiary }} aria-hidden /> : <Plus size={18} style={{ color: colors.purple.tertiary }} aria-hidden />}
        </div>
      </button>

      {/* Controlled height animation to avoid jumpy behavior when images load */}
      <motion.div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`acc-${id}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: open ? measuredHeight + 2 : 0, opacity: open ? 1 : 0 }}
        transition={{ height: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }, opacity: { duration: 0.2 } }}
        style={{ overflow: 'hidden' }}
        aria-hidden={!open}
      >
        <div ref={contentRef} className="pt-4 px-5 pb-5 md:flex md:items-start md:gap-6">
          {imageSrc ? (
            <div className="mb-4 md:mb-0 md:w-1/3 flex-shrink-0 md:ml-3 rounded-md" style={{ padding: '6px' }}>
              <div className="overflow-hidden rounded-md" style={{ border: `1px solid ${colors.neutral.cardLight}`, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <img src={imageSrc} alt={title} className="w-full h-44 md:h-40 object-cover rounded-md" onLoad={() => measure()} />
              </div>
            </div>
          ) : null}

          <div className="md:flex-1 text-lg font-regular" style={{ color: colors.text.secondary }}>
            {children ? children : (
              <p className="m-0">
                Este é um passo genérico do processo. Aqui explicamos como conduzimos a fase de descoberta e planejamento: entrevistas com stakeholders, análises de métricas e definição de roadmap.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccordionItem;
