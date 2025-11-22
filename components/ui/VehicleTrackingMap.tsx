import React from 'react';

const VehicleTrackingMap: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [vehiclePosition, setVehiclePosition] = React.useState(0);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Anima o veículo ao longo da rota
  React.useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePosition((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calcula a posição do veículo na rota
  const getVehiclePosition = () => {
    const progress = vehiclePosition / 100;
    // Rota simulada: São Paulo -> Rio de Janeiro (curva suave)
    const startX = 150;
    const startY = 320;
    const endX = 380;
    const endY = 280;
    
    // Adiciona curvatura à rota
    const controlX = 250;
    const controlY = 250;
    
    const t = progress;
    const x = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * controlX + Math.pow(t, 2) * endX;
    const y = Math.pow(1-t, 2) * startY + 2 * (1-t) * t * controlY + Math.pow(t, 2) * endY;
    
    return { x, y };
  };

  const vehiclePos = getVehiclePosition();
  const roadColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const mapBg = isDark ? '#0a0a0a' : '#f5f5f5';

  return (
    <div className="relative w-full h-full bg-cover" style={{ backgroundColor: mapBg }}>
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full"
        style={{ minHeight: '250px' }}
      >
        {/* Mapa do Sudeste do Brasil com pontos */}
        <defs>
          <pattern
            id="mapDots"
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="0.8" fill={isDark ? '#1a1a1a' : '#d1d5db'} />
          </pattern>
        </defs>

        {/* Região Sudeste - contorno simplificado */}
        <path
          d="M 120 250 L 140 220 L 180 200 L 230 190 L 280 200 L 320 220 L 360 250 L 380 290 L 370 330 L 340 360 L 290 380 L 240 385 L 190 375 L 150 350 L 130 310 L 120 270 Z"
          fill="url(#mapDots)"
        />

        {/* Rota entre cidades (linha curva) */}
        <path
          d="M 150 320 Q 250 250 380 280"
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 4"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="24"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Marcador Cidade A (São Paulo) */}
        <g>
          <circle cx="150" cy="320" r="6" fill="#10b981" opacity="0.3">
            <animate attributeName="r" from="6" to="12" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="320" r="4" fill="#10b981" />
          <text x="150" y="345" fontSize="11" fill={isDark ? '#fff' : '#000'} textAnchor="middle" fontWeight="500">
            São Paulo
          </text>
        </g>

        {/* Marcador Cidade B (Rio de Janeiro) */}
        <g>
          <circle cx="380" cy="280" r="6" fill="#ef4444" opacity="0.3">
            <animate attributeName="r" from="6" to="12" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="280" r="4" fill="#ef4444" />
          <text x="380" y="268" fontSize="11" fill={isDark ? '#fff' : '#000'} textAnchor="middle" fontWeight="500">
            Rio de Janeiro
          </text>
        </g>

        {/* Veículo em movimento */}
        <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}>
          {/* Sombra do veículo */}
          <ellipse cx="0" cy="8" rx="8" ry="3" fill="#000" opacity="0.2" />
          
          {/* Ícone do veículo (carro) */}
          <g transform="translate(-10, -10)">
            <path
              d="M 3 10 L 5 5 L 7 3 L 13 3 L 15 5 L 17 10 L 18 10 L 18 14 L 16 14 L 16 15 C 16 16 15 17 14 17 C 13 17 12 16 12 15 L 8 15 C 8 16 7 17 6 17 C 5 17 4 16 4 15 L 4 14 L 2 14 L 2 10 Z M 6 5 L 8 8 L 12 8 L 14 5 Z"
              fill="#3B82F6"
              stroke="#fff"
              strokeWidth="0.5"
            />
            {/* Janelas */}
            <rect x="7" y="5" width="3" height="2" fill="#fff" opacity="0.6" rx="0.5" />
            <rect x="11" y="5" width="2" height="2" fill="#fff" opacity="0.6" rx="0.5" />
          </g>

          {/* Indicador de sinal GPS */}
          <circle cx="0" cy="-15" r="8" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.6">
            <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="-15" r="3" fill="#3B82F6" />
        </g>

        {/* Informações de rastreamento (HUD) */}
        <g>
          {/* Card de informações */}
          <rect
            x="10"
            y="10"
            width="120"
            height="70"
            fill={isDark ? '#1a1a1a' : '#ffffff'}
            opacity="0.95"
            rx="4"
          />
          <rect
            x="10"
            y="10"
            width="120"
            height="70"
            fill="none"
            stroke={isDark ? '#2a2a2a' : '#e5e7eb'}
            strokeWidth="1"
            rx="4"
          />
          
          {/* Textos */}
          <text x="20" y="28" fontSize="10" fill={isDark ? '#9ca3af' : '#6b7280'} fontWeight="500">
            STATUS
          </text>
          <text x="20" y="42" fontSize="12" fill="#10b981" fontWeight="600">
            ● EM TRÂNSITO
          </text>
          
          <text x="20" y="58" fontSize="10" fill={isDark ? '#9ca3af' : '#6b7280'} fontWeight="500">
            VELOCIDADE
          </text>
          <text x="20" y="72" fontSize="12" fill={isDark ? '#fff' : '#000'} fontWeight="600">
            {Math.floor(60 + Math.sin(vehiclePosition / 10) * 20)} km/h
          </text>
        </g>

        {/* Timestamp */}
        <text x="490" y="390" fontSize="9" fill={isDark ? '#6b7280' : '#9ca3af'} textAnchor="end" fontStyle="italic">
          Atualizado agora
        </text>
      </svg>
    </div>
  );
};

export default VehicleTrackingMap;
