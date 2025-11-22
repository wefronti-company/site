import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  text,
  rating,
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
      className="flex-shrink-0 w-[350px] md:w-[400px] p-8 bg-gray-100 dark:bg-[#1a1a1a] transition-colors"
      style={{
        border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
        borderRadius: '7px',
      }}
    >
      {/* Estrelas */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={index < rating ? '#3B82F6' : isDark ? '#2a2a2a' : '#e5e7eb'}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* Texto do depoimento */}
      <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        "{text}"
      </p>

      {/* Informações do cliente */}
      <div className="border-t pt-4" style={{ borderColor: isDark ? '#141414' : '#D1D5DB' }}>
        <p className="font-medium text-gray-900 dark:text-white">{name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {role} • {company}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
