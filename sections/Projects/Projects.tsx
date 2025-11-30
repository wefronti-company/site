import React from 'react';
import Badge from '../../components/ui/Badge';
import ProjectCard from '../../components/ui/ProjectCard';
import VehicleTrackingMap from '../../components/ui/VehicleTrackingMap';
import CheckoutAnimation from '../../components/ui/CheckoutAnimation';
import HealthDashboard from '../../components/ui/HealthDashboard';
import { ptBR } from '../../locales/pt-BR';

const Projects: React.FC = () => {
	const t = ptBR;

 const projects = [
 {
 ...t.projects.items[0],
 technologies: {
 frontend: ['Next.js 16', 'React 19', 'Tailwind CSS 4'],
 backend: ['Node.js', 'PostgreSQL', 'Prisma ORM'],
 },
 customContent: <HealthDashboard />,
 },
 {
 ...t.projects.items[1],
 technologies: {
 frontend: ['React', 'Mapbox GL', 'Socket.io'],
 backend: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'],
 },
 customContent: <VehicleTrackingMap />,
 },
 {
 ...t.projects.items[2],
 technologies: {
 frontend: ['React', 'Formik', 'Framer Motion'],
 backend: ['Node.js', 'Stripe', 'PayPal API'],
 },
 customContent: <CheckoutAnimation />,
 },
 ];

 return (
 <section 
 id="projects"
 className="w-full py-20 md:py-0 md:h-screen md:w-screen md:flex md:items-center bg-custom-white transition-colors border-t border-b"
 style={{
 borderTopColor: '#D1D5DB',
 borderBottomColor: '#D1D5DB'
 }}
 >
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">
 {/* Cabeçalho */}
 <div className="text-left md:text-center mb-12 md:mb-16">
 <Badge icon="trophy" text={t.projects.badge} />
 <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 mt-6 mb-4">
 {t.projects.title}
 </h2>
 <p className="text-lg text-gray-600 max-w-2xl md:mx-auto">
 {t.projects.subtitle}
 </p>
 </div>

 {/* Grid de Projetos */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {projects.map((project, index) => (
 <ProjectCard key={index} {...project} />
 ))}
 </div>
 </div>
 </div>
 </section>
 );
};

export default Projects;
