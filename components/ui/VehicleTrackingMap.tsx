import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

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

  // Coordenadas reais: São Paulo e Rio de Janeiro (expandidas)
  const saoPaulo: [number, number] = [-48.5, -24.5];
  const rioDeJaneiro: [number, number] = [-42.5, -21.5];

  // Calcula a posição do veículo na rota com curva
  const getVehiclePosition = (): [number, number] => {
    const progress = vehiclePosition / 100;
    
    // Ponto de controle para criar a curva (Bézier quadrática)
    const controlPoint: [number, number] = [-45.5, -21.0];
    
    // Fórmula Bézier quadrática: P(t) = (1-t)²*P0 + 2(1-t)t*P1 + t²*P2
    const t = progress;
    const lon = Math.pow(1-t, 2) * saoPaulo[0] + 2 * (1-t) * t * controlPoint[0] + Math.pow(t, 2) * rioDeJaneiro[0];
    const lat = Math.pow(1-t, 2) * saoPaulo[1] + 2 * (1-t) * t * controlPoint[1] + Math.pow(t, 2) * rioDeJaneiro[1];
    
    return [lon, lat];
  };

  const vehiclePos = getVehiclePosition();
  
  // Cor dos pontos (igual ao mapa de clientes)
  const dotColor = isDark ? '#4a4a4a' : '#9ca3af';

  // Função para converter coordenadas geográficas para o sistema de coordenadas SVG do mapa
  const projectCoordinate = (coord: [number, number]): [number, number] => {
    const scale = 2200;
    const centerLon = -45.5;
    const centerLat = -23;
    
    // Projeção Mercator simplificada
    const x = (coord[0] - centerLon) * scale / 360 * 2 * Math.PI;
    const y = -(coord[1] - centerLat) * scale / 180 * Math.PI;
    
    return [x, y];
  };

  const projectedSP = projectCoordinate(saoPaulo);
  const projectedRJ = projectCoordinate(rioDeJaneiro);
  const projectedControl = projectCoordinate([-45.5, -21.0]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: isDark ? '#010101' : '#f7f7f7',
        padding: '16px',
      }}
    >
      <div 
        className="relative w-full h-full"
        style={{
          backgroundColor: isDark ? '#010101' : '#f7f7f7',
          padding: '16px',
          boxShadow: isDark 
            ? '0 2px 10px rgba(0, 0, 0, 0.5)' 
            : '0 2px 10px rgba(255, 200, 0, 0.1)',
        }}
      >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2200,
          center: [-45.5, -23],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Padrão de pontos (mesmo estilo da seção clientes) */}
          <pattern id="dots-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.9" fill={dotColor} />
          </pattern>
        </defs>

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === 'Brazil')
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#dots-pattern)"
                  stroke={dotColor}
                  strokeWidth={0.3}
                />
              ))
          }
        </Geographies>

        {/* Linha da rota com curva usando SVG dentro do mapa */}
        <g>
          <defs>
            <path
              id="curved-route"
              d={`M ${projectedSP[0]},${projectedSP[1]} Q ${projectedControl[0]},${projectedControl[1]} ${projectedRJ[0]},${projectedRJ[1]}`}
              fill="none"
            />
          </defs>
          <path
            d={`M ${projectedSP[0]},${projectedSP[1]} Q ${projectedControl[0]},${projectedControl[1]} ${projectedRJ[0]},${projectedRJ[1]}`}
            stroke="#fbbf24"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="22 7"
            fill="none"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="29"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Marcador São Paulo - MAIOR */}
        <Marker coordinates={saoPaulo}>
          <g>
            <circle r={8} fill="#10b981" opacity={0.3}>
              <animate attributeName="r" from="8" to="14" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r={6} fill="#10b981" />
            <text
              textAnchor="middle"
              y={-12}
              style={{
                fontFamily: 'system-ui',
                fontSize: '22px',
                fill: isDark ? '#fff' : '#000',
                fontWeight: 700,
              }}
            >
              São Paulo
            </text>
          </g>
        </Marker>

        {/* Marcador Rio de Janeiro - MAIOR */}
        <Marker coordinates={rioDeJaneiro}>
          <g>
            <circle r={8} fill="#ef4444" opacity={0.3}>
              <animate attributeName="r" from="8" to="14" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r={6} fill="#ef4444" />
            <text
              textAnchor="middle"
              y={-12}
              style={{
                fontFamily: 'system-ui',
                fontSize: '22px',
                fill: isDark ? '#fff' : '#000',
                fontWeight: 700,
              }}
            >
              Rio de Janeiro
            </text>
          </g>
        </Marker>

        {/* Veículo em movimento - MUITO MAIOR */}
        <Marker coordinates={vehiclePos}>
          <g>
            {/* Sinal GPS - MAIOR */}
            <circle r={22} fill="none" stroke="#3B82F6" strokeWidth={2} opacity={0.6}>
              <animate attributeName="r" from="12" to="12" dur="5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="2" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle r={6.5} fill="#3B82F6" />
            
            {/* Ícone do carro - 3.5X MAIOR */}
            <g transform="translate(-36, 9)">
              <path
                d="M 2 5 L 3 2 L 4 1 L 8 1 L 9 2 L 10 5 L 11 5 L 11 8 L 10 8 L 10 9 C 10 9.5 9.5 10 9 10 C 8.5 10 8 9.5 8 9 L 4 9 C 4 9.5 3.5 10 3 10 C 2.5 10 2 9.5 2 9 L 2 8 L 1 8 L 1 5 Z"
                fill="#3B82F6"
                stroke="#fff"
                strokeWidth="0.5"
                transform="scale(4.5)"
              />
            </g>
          </g>
        </Marker>
      </ComposableMap>

      {/* Informações de rastreamento (HUD) */}
      <div
        className="absolute top-3 left-3 px-4 py-3 backdrop-blur-sm"
        style={{
          backgroundColor: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
          borderRadius: '7px',
          minWidth: '140px',
        }}
      >
        <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
          STATUS
        </div>
        <div className="text-xs font-semibold text-green-500 mb-2 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          EM TRÂNSITO
        </div>
        
        <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
          VELOCIDADE
        </div>
        <div className="text-xs font-semibold text-gray-900 dark:text-white">
          {Math.floor(60 + Math.sin(vehiclePosition / 10) * 20)} km/h
        </div>
      </div>

      {/* Label Rastreio */}
      <div className="absolute bottom-3 right-3 text-right">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">Rastreio</div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400 italic">Atualizado agora</div>
      </div>
      </div>
    </div>
  );
};

export default VehicleTrackingMap;
