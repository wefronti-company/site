import React from 'react';

const Footer: React.FC = () => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      className="w-full border-t transition-colors"
      style={{
        backgroundColor: isDark ? '#010101' : '#f7f7f7',
        borderTopColor: isDark ? '#141414' : '#D1D5DB'
      }}
    >
      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="w-full max-w-[1400px] mx-auto">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            
            {/* Logo e Descrição */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Wefronti
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tecnologia e design para transformar suas ideias em produtos digitais que geram receita.
              </p>
            </div>

            {/* Contato */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Contato
              </h4>
              
              {/* Email */}
              <a 
                href="mailto:contato@wefronti.com"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>contato@wefronti.com</span>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>+55 11 99999-9999</span>
              </a>
            </div>

            {/* Redes Sociais */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Redes Sociais
              </h4>
              
              <div className="flex gap-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com/wefronti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border transition-all hover:scale-110"
                  style={{
                    borderColor: isDark ? '#141414' : '#D1D5DB',
                    backgroundColor: isDark ? '#010101' : '#ffffff'
                  }}
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/wefronti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border transition-all hover:scale-110"
                  style={{
                    borderColor: isDark ? '#141414' : '#D1D5DB',
                    backgroundColor: isDark ? '#010101' : '#ffffff'
                  }}
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="9" width="4" height="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div 
            className="w-full h-px mb-6"
            style={{
              backgroundColor: isDark ? '#141414' : '#D1D5DB'
            }}
          />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Wefronti. Todos os direitos reservados.
            </p>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 flex items-center justify-center border transition-all hover:scale-110 hover:bg-blue-500 hover:border-blue-500 group"
              style={{
                borderColor: isDark ? '#141414' : '#D1D5DB',
                backgroundColor: isDark ? '#010101' : '#ffffff'
              }}
              aria-label="Voltar ao topo"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                className="group-hover:stroke-white transition-colors"
              >
                <polyline 
                  points="18 15 12 9 6 15" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
