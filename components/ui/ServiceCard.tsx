import React from 'react';
import { colors } from '../../styles/colors';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  href?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageSrc, imageAlt, icon, href }) => {
  return (
    <article className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.neutral.cardLight}`, backgroundColor: 'transparent' }}>
      {/* Top image (if provided) */}
      {imageSrc && (
        <div className="w-full h-44 md:h-56 bg-white/5 overflow-hidden rounded-t-2xl">
          <img src={imageSrc} alt={imageAlt || title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-md flex-shrink-0" style={{ color: colors.purple.tertiary, backgroundColor: 'rgba(115,111,176,0.05)', border: `1px solid ${colors.neutral.cardLight}`, borderRadius: 8 }} aria-hidden>
            {icon && React.isValidElement(icon) ? React.cloneElement(icon as any, { style: { display: 'block', margin: 0 } }) : icon}
          </div>

          <h3 className="text-lg font-semibold m-0 self-center" style={{ color: colors.text.primary }}>{title}</h3>

          <p className="text-sm m-0 col-span-2 mt-3" style={{ color: colors.text.secondary }}>{description}</p>
        </div>

        {href ? (
          <div className="mt-4">
            <a href={href} className="inline-block text-sm font-medium text-white/80 hover:text-white transition-colors" aria-label={`Saiba mais sobre ${title}`}>Saiba mais →</a>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default ServiceCard;
