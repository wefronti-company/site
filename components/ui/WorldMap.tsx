import React from 'react';

const WorldMap: React.FC = () => {
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

  // Coordenadas dos pontos azuis (posições mais precisas)
  const locations = [
    { x: 180, y: 150 }, // América do Norte (EUA)
    { x: 280, y: 380 }, // América do Sul (Brasil)
    { x: 560, y: 140 }, // Europa
    { x: 630, y: 280 }, // África
    { x: 780, y: 200 }, // Ásia
    { x: 920, y: 420 }, // Austrália
  ];

  const dotColor = isDark ? '#333333' : '#d1d5db';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full"
        style={{ maxHeight: '600px' }}
      >
        {/* Grid de pontos formando o mapa mundi */}
        <defs>
          <pattern
            id="smallDots"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="0.9" fill={dotColor} />
          </pattern>
        </defs>

        {/* América do Norte */}
        <path
          d="M 80 120 L 100 100 L 130 90 L 160 85 L 190 90 L 220 100 L 245 115 L 260 135 L 270 160 L 275 185 L 270 210 L 250 230 L 220 240 L 190 235 L 160 225 L 135 210 L 115 190 L 100 165 L 90 140 Z M 180 130 L 200 125 L 215 130 L 220 145 L 215 160 L 200 165 L 185 160 L 180 145 Z"
          fill="url(#smallDots)"
        />
        
        {/* México e América Central */}
        <path
          d="M 140 240 L 165 235 L 185 240 L 200 250 L 210 265 L 215 280 L 210 290 L 195 295 L 175 290 L 155 280 L 145 265 L 140 250 Z"
          fill="url(#smallDots)"
        />

        {/* América do Sul */}
        <path
          d="M 240 300 L 260 295 L 280 300 L 295 315 L 305 340 L 315 370 L 320 405 L 322 440 L 318 475 L 310 500 L 295 515 L 275 520 L 255 515 L 240 500 L 230 475 L 225 445 L 225 410 L 230 375 L 235 345 L 238 320 Z"
          fill="url(#smallDots)"
        />

        {/* Europa */}
        <path
          d="M 500 90 L 520 85 L 545 85 L 570 90 L 595 100 L 615 115 L 625 135 L 625 155 L 615 175 L 595 185 L 570 188 L 545 185 L 520 175 L 505 160 L 495 140 L 495 115 Z M 540 110 L 555 108 L 565 115 L 565 130 L 555 140 L 540 140 L 530 130 L 530 120 Z"
          fill="url(#smallDots)"
        />

        {/* África */}
        <path
          d="M 540 200 L 565 195 L 590 200 L 610 215 L 625 240 L 635 270 L 640 305 L 642 340 L 640 375 L 635 410 L 625 440 L 610 465 L 590 480 L 565 488 L 540 488 L 520 478 L 505 460 L 495 435 L 490 405 L 490 370 L 495 335 L 505 300 L 515 265 L 525 235 L 535 215 Z"
          fill="url(#smallDots)"
        />

        {/* Ásia */}
        <path
          d="M 640 100 L 670 95 L 705 95 L 745 100 L 785 110 L 825 125 L 860 145 L 890 165 L 910 185 L 925 205 L 930 225 L 925 245 L 910 260 L 885 270 L 855 275 L 820 275 L 785 270 L 750 260 L 715 245 L 685 225 L 660 205 L 645 180 L 638 155 L 638 130 Z M 760 180 L 780 175 L 800 180 L 815 195 L 825 220 L 828 250 L 825 280 L 815 305 L 800 320 L 780 325 L 760 320 L 745 305 L 738 280 L 738 250 L 745 220 L 755 200 Z"
          fill="url(#smallDots)"
        />

        {/* Austrália */}
        <path
          d="M 870 380 L 895 375 L 925 380 L 955 395 L 975 415 L 985 440 L 985 465 L 975 485 L 955 500 L 925 505 L 895 500 L 870 485 L 855 465 L 850 440 L 855 415 L 865 395 Z"
          fill="url(#smallDots)"
        />

        {/* Pontos azuis de localização */}
        {locations.map((location, index) => (
          <g key={index}>
            {/* Animação de pulso */}
            <circle
              cx={location.x}
              cy={location.y}
              r="6"
              fill="#3B82F6"
              opacity="0.3"
            >
              <animate
                attributeName="r"
                from="6"
                to="12"
                dur="2s"
                begin={`${index * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.4"
                to="0"
                dur="2s"
                begin={`${index * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Ponto principal */}
            <circle
              cx={location.x}
              cy={location.y}
              r="4"
              fill="#3B82F6"
            >
              <animate
                attributeName="r"
                values="4;5;4"
                dur="1.5s"
                begin={`${index * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WorldMap;
