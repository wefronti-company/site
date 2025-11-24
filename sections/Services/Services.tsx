import React from 'react';
import Badge from '../../components/ui/Badge';
import ServiceCard from '../../components/ui/ServiceCard';
import { useLanguage } from '../../contexts/LanguageContext';

const Services: React.FC = () => {
 const { t } = useLanguage();

 return (
 <section 
 id="services"
 className="w-full py-20 md:py-0 md:h-screen md:w-screen md:flex md:items-center bg-custom-white transition-colors"
 >
 <div className="px-4 md:px-8 lg:px-16">
 <div className="w-full max-w-[1400px] mx-auto">
 
 {/* Left Side - Info */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
 
 <div className="lg:col-span-5 flex flex-col gap-6">
 <Badge text={t.services.badge} icon="rocket" />
 
 <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight">
 {t.services.title}
 </h2>
 
 <p className="text-lg text-gray-600">
 {t.services.description}
 </p>

 <div className="mt-8">
 <h3 className="text-lg font-semibold text-gray-900 mb-4">
 {t.services.teamTitle}
 </h3>
 <p className="text-base text-gray-600 mb-4">
 {t.services.teamDescription}
 </p>
 </div>

 <div className="flex flex-col gap-3">
 {t.services.teamRoles.map((role, index) => (
 <div key={index} className="flex items-center gap-3">
 <svg 
 width="20" 
 height="20" 
 viewBox="0 0 24 24" 
 fill="none" 
 stroke="currentColor"
 className="text-blue-500 flex-shrink-0"
 >
 <polyline points="9 11 12 14 22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <span className="text-base md:text-lg text-gray-700">{role}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Right Side - Service Cards */}
 <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
 {t.services.offerings.map((service, index) => (
 <ServiceCard
 key={index}
 title={service.title}
 description={service.description}
 features={service.features}
 timeline={service.timeline}
 />
 ))}
 </div>

 </div>
 </div>
 </div>
 </section>
 );
};

export default Services;
