import React from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  technologies: {
    frontend: string[];
    backend: string[];
  };
  image: string;
  badge?: string;
  isNew?: boolean;
  customContent?: React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  technologies,
  image,
  badge,
  isNew = false,
  customContent,
}) => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="group flex flex-col bg-gray-100 dark:bg-[#1a1a1a] transition-all duration-300 hover:scale-[1.02] overflow-hidden"
      style={{
        border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
        borderRadius: '7px',
      }}
    >
      {/* Imagem ou Conteúdo Customizado do Projeto */}
      <div className="relative w-full h-[250px] md:h-[280px] overflow-hidden bg-gray-200 dark:bg-[#0a0a0a]">
        {customContent ? (
          <div className="w-full h-full">
            {customContent}
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {badge && (
            <span
              className="px-3 py-1 text-xs font-medium uppercase tracking-wide"
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
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
        {/* Título e Descrição */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-[#0a0a0a]"
              style={{ borderRadius: '7px' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tecnologias */}
        <div className="mb-4 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[70px]">
              Frontend:
            </span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {technologies.frontend.join(', ')}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[70px]">
              Backend:
            </span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {technologies.backend.join(', ')}
            </span>
          </div>
        </div>

        {/* Footer com Botão */}
        <div className="mt-auto pt-4 border-t" style={{ borderColor: isDark ? '#141414' : '#D1D5DB' }}>
          <button
            className="w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: '#3B82F6',
              borderRadius: '7px',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Ver projeto</span>
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
