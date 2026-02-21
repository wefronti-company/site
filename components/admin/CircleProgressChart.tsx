import React from 'react';
import { theme } from '../../styles/theme';

const { colors, fontSizes } = theme;

const CHART_COLOR = colors.blue.primary;
const CHART_BG = 'rgba(255, 255, 255, 0.08)';

interface CircleProgressChartProps {
  current: number;
  goal: number;
}

/** Gráfico circular completo com % no centro */
export const CircleProgressChart: React.FC<CircleProgressChartProps> = ({ current, goal }) => {
  const percentage = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;

  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={CHART_BG}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        <span
          style={{
            fontSize: fontSizes.xl,
            fontWeight: 700,
            color: colors.text.light,
          }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
