'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

const ComposableMap = dynamic(() => import('react-simple-maps').then((m) => m.ComposableMap), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        aspectRatio: 2,
        background: theme.colors.admin.inactive,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.secondary,
        fontSize: theme.fontSizes.sm,
      }}
    >
      Carregando mapa…
    </div>
  ),
});

const Geographies = dynamic(() => import('react-simple-maps').then((m) => m.Geographies), { ssr: false });
const Geography = dynamic(() => import('react-simple-maps').then((m) => m.Geography), { ssr: false });

const GEO_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const DEFAULT_FILL = theme.colors.neutral.borderLight;
const MIN_FILL = 'rgba(102, 191, 130, 0.25)';
const MAX_FILL = theme.colors.blue.primary;

interface WorldMapProps {
  countryCounts: Record<string, number>;
}

function getFill(count: number | undefined, maxCount: number): string {
  if (count == null || count <= 0) return DEFAULT_FILL;
  if (maxCount <= 0) return MIN_FILL;
  const t = Math.min(count / maxCount, 1);
  const r = Math.round(102 + (102 - 102) * (1 - t));
  const g = Math.round(191 + (191 - 191) * (1 - t));
  const b = Math.round(130 + (130 - 130) * (1 - t));
  const a = 0.25 + 0.75 * t;
  return `rgba(102, 191, 130, ${a})`;
}

export const WorldMap: React.FC<WorldMapProps> = ({ countryCounts }) => {
  const [tooltip, setTooltip] = useState<{ name: string; count: number } | null>(null);
  const maxCount = Math.max(0, ...Object.values(countryCounts));

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 280 }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20],
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const iso2 = String(geo.properties?.ISO_A2 ?? geo.properties?.iso_a2 ?? '').trim();
              const count = iso2 ? (countryCounts[iso2] ?? 0) : 0;
              const name = (geo.properties?.NAME ?? geo.properties?.name ?? (iso2 || '—')) as string;
              const fill = getFill(count, maxCount);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={theme.colors.neutral.border}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: theme.colors.blue.tertiary, cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={() => setTooltip({ name, count })}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: `${theme.spacing[2]}px ${theme.spacing[4]}px`,
              background: theme.colors.text.primary,
              color: '#fff',
              borderRadius: 8,
              fontSize: theme.fontSizes.sm,
              fontWeight: 500,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tooltip.name}
            {tooltip.count > 0 && (
              <span style={{ opacity: 0.9, marginLeft: theme.spacing[2] }}>
                {tooltip.count} visita{tooltip.count !== 1 ? 's' : ''}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
