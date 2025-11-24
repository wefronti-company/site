import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// URL do TopoJSON - usando unpkg que converte automaticamente
const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

const WorldMap: React.FC = () => {
 // Coordenadas dos pontos azuis (longitude, latitude)
 const locations = [
 { coordinates: [-95, 40], country: 'United States' }, // EUA
 { coordinates: [-43.2, -22.9], country: 'Brazil' }, // Rio de Janeiro, Brasil
 { coordinates: [10, 50], country: 'Europe' }, // Europa
 { coordinates: [30, 0], country: 'Africa' }, // África
 { coordinates: [100, 30], country: 'Asia' }, // Ásia/China
 { coordinates: [135, -25], country: 'Australia' }, // Austrália
 ];

 const dotColor = '#9ca3af';

 return (
 <div className="relative w-full h-full flex items-center justify-center">
 <ComposableMap
 projection="geoMercator"
 projectionConfig={{
 scale: 140,
 center: [0, 20],
 }}
 style={{ width: '100%', height: '100%' }}
 >
 <defs>
 {/* Pattern de pontos para preencher os continentes */}
 <pattern
 id="dots"
 x="0"
 y="0"
 width="6"
 height="6"
 patternUnits="userSpaceOnUse"
 >
 <circle cx="3" cy="3" r="0.9" fill={dotColor} />
 </pattern>
 </defs>

 <Geographies 
 geography={geoUrl}
 parseGeographies={(geographies) => {
 console.log('Geographies loaded:', geographies);
 return geographies;
 }}
 >
 {({ geographies }) => {
 if (!geographies || geographies.length === 0) {
 console.error('No geographies loaded');
 return null;
 }
 return geographies.map((geo) => (
 <Geography
 key={geo.rsmKey}
 geography={geo}
 fill="url(#dots)"
 stroke="none"
 />
 ));
 }}
 </Geographies>

 {/* Pontos azuis de localização */}
 {locations.map((location, index) => {
 const projection = {
 scale: 140,
 center: [0, 20] as [number, number],
 };
 
 // Conversão manual de coordenadas geográficas para SVG
 const scale = projection.scale;
 const centerX = projection.center[0];
 const centerY = projection.center[1];
 
 const x = (location.coordinates[0] - centerX) * (scale / 360) * 2 * Math.PI + 400;
 const y = 250 - (location.coordinates[1] - centerY) * (scale / 180) * Math.PI;

 return (
 <g key={index}>
 {/* Animação de pulso */}
 <circle
 cx={x}
 cy={y}
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
 cx={x}
 cy={y}
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
 );
 })}
 </ComposableMap>
 </div>
 );
};

export default WorldMap;
