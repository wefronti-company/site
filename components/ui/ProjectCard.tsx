import React from 'react';
import Image from 'next/image';
import { ptBR } from '../../locales/pt-BR';
import { colors } from '../../styles/colors';

interface ProjectCardProps {
 title: string;
 description: string;
 category: string;
 tags: string[];
 technologies: {
 frontend: string[];
 backend: string[];
 };
 image?: string;
 badge?: string;
 isNew?: boolean;
 customContent?: React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
	title,
	description,
	category,
	tags,
	technologies,
	image,
	badge,
	isNew = false,
	customContent,
}) => {
 const t = ptBR;

	return (
		<div
			className="group flex flex-col transition-all duration-300 hover:scale-[1.02] overflow-hidden"
			style={{
				backgroundColor: colors.colorGray,
				border: `1px solid ${colors.borderDark}`,
				borderRadius: '7px',
			}}
		>
			{/* Image slot: square placeholder (aspect ratio 1:1). Designed to accept a high-res 1080x1080 image */}
			<div className="relative w-full aspect-square overflow-hidden bg-[#111111]">
				{image ? (
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(min-width: 1024px) 540px, 100vw"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400"> 
						{/* placeholder area to show where the 1080x1080 image will go */}
						<svg width="84" height="84" viewBox="0 0 24 24" fill="none" className="opacity-30">
							<rect x="3" y="3" width="18" height="18" rx="2" stroke="#9CA3AF" strokeWidth="1.6" />
							<path d="M7 14l3-3 4 4 5-6" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
				)}
 
				{/* Badges (category / new) */}
				<div className="absolute top-4 left-4 flex gap-2 z-10">
					{badge && (
						<span
							className="px-3 py-1 text-xs font-medium uppercase tracking-wide"
							style={{
								backgroundColor: colors.blueColor,
								color: colors.whiteColor,
								borderRadius: '7px',
							}}
						>
							{badge}
						</span>
					)}
					{isNew && (
						<span
							className="px-3 py-1 text-xs font-medium uppercase tracking-wide"
							style={{
								backgroundColor: '#FFC107',
								color: '#000',
								borderRadius: '7px',
							}}
						>
							Novo
						</span>
					)}
				</div>
 </div>

	{/* Conteúdo */}
	<div className="flex flex-col flex-grow p-6">
				{/* Title, subtitle (description) and category - kept as requested */}
				<div className="mb-4">
					<h3 className="text-xl md:text-2xl font-medium mb-2" style={{ color: colors.whiteColor }}>
						{title}
					</h3>
					<p className="text-sm leading-relaxed mb-3" style={{ color: colors.whiteColor }}>
						{description}
					</p>
					{/* category */}
					{category && (
						<div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: colors.borderDark, color: colors.whiteColor, borderRadius: 6 }}>
							{category}
						</div>
					)}
				</div>

				{/* Languages / programming languages: combine frontend + backend arrays (if provided) */}
				<div className="mb-4">
					<div className="text-xs font-medium text-gray-400 mb-2" style={{ color: colors.whiteColor }}>Linguagens</div>
					<div className="text-sm" style={{ color: colors.whiteColor }}>
						{[...(technologies.frontend || []), ...(technologies.backend || [])].join(', ')}
					</div>
				</div>

	{/* Footer com Botão */}
	<div className="mt-auto pt-4 border-t" style={{ borderColor: colors.borderDark }}>
						<button
							className="w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
							style={{
								backgroundColor: '#3B82F6',
								borderRadius: '7px',
							}}
						>
 <div className="flex items-center justify-center gap-2">
 <span>{t.projects.viewProject}</span>
 <svg 
 width="16" 
 height="16" 
 viewBox="0 0 24 24" 
 fill="none" 
 stroke="currentColor" 
 strokeWidth="2"
 style={{ transform: 'rotate(-45deg)' }}
 >
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </div>
 </button>
 </div>
 </div>
 </div>
 );
};

export default ProjectCard;
