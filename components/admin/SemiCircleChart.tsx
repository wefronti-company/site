import React from 'react';
import { theme } from '../../styles/theme';

const { colors, fontSizes, spacing } = theme;

const CHART_COLOR = colors.blue.primary;
const CHART_BG = 'rgba(255, 255, 255, 0.08)';

interface SemiCircleChartProps {
  current: number;
  goal: number;
  label: string;
  valueDisplay: string;
}

/** Gráfico meia-lua (semi-circular) para exibir progresso em relação à meta */
export const SemiCircleChart: React.FC<SemiCircleChartProps> = ({
  current,
  goal,
  label,
  valueDisplay,
}) => {
  const percentage = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;

  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startX = strokeWidth / 2;
  const endX = size - strokeWidth / 2;

  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const arcPath = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`;
  const chartHeight = radius + strokeWidth * 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
      <svg
        width={size}
        height={chartHeight}
        style={{ overflow: 'visible' }}
        viewBox={`0 ${cy - strokeWidth} ${size} ${chartHeight}`}
        aria-hidden
      >
        <path
          d={arcPath}
          fill="none"
          stroke={CHART_BG}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.7 }}>
          {label}
        </p>
        <p
          style={{
            margin: 0,
            marginTop: 2,
            fontSize: fontSizes.lg,
            fontWeight: 600,
            color: colors.text.light,
          }}
        >
          {valueDisplay}
        </p>
        <p style={{ margin: 0, marginTop: 2, fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.6 }}>
          {percentage.toFixed(0)}% da meta
        </p>
      </div>
    </div>
  );
};

