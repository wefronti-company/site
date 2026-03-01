'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { getCountryName } from '../../lib/countryNames';

interface CountryListProps {
  countryCounts: Record<string, number>;
}

const TOP_N = 50;

export const CountryList: React.FC<CountryListProps> = ({ countryCounts }) => {
  const entries = Object.entries(countryCounts).filter(([, c]) => c > 0);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top50 = sorted.slice(0, TOP_N);
  const others = sorted.slice(TOP_N);
  const othersSum = others.reduce((acc, [, c]) => acc + c, 0);
  const total = sorted.reduce((acc, [, c]) => acc + c, 0);

  if (total === 0) {
    return (
      <p style={{ margin: 0, color: theme.colors.text.light, opacity: 0.8, fontSize: theme.fontSizes.sm }}>
        Nenhuma visita nos últimos 30 dias.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
      <h3
        style={{
          margin: 0,
          fontSize: theme.fontSizes.sm,
          fontWeight: 600,
          color: theme.colors.text.light,
          opacity: 0.9,
        }}
      >
        Visitas por país (30 dias)
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {top50.map(([iso2, count], i) => (
          <motion.li
            key={iso2}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02, duration: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
              background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.03)',
              borderRadius: 6,
              fontSize: theme.fontSizes.sm,
              color: theme.colors.text.light,
            }}
          >
            <span>{getCountryName(iso2)}</span>
            <span style={{ fontWeight: 600, color: theme.colors.blue.primary }}>
              {count}
            </span>
          </motion.li>
        ))}
        {othersSum > 0 && (
          <motion.li
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: TOP_N * 0.02, duration: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
              marginTop: theme.spacing[2],
              borderTop: `1px solid ${theme.colors.neutral.border}`,
              fontSize: theme.fontSizes.sm,
              color: theme.colors.text.light,
              opacity: 0.9,
            }}
          >
            <span>Outros países</span>
            <span style={{ fontWeight: 600 }}>{othersSum}</span>
          </motion.li>
        )}
      </ul>
    </div>
  );
};
