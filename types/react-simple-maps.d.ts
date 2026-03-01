declare module 'react-simple-maps' {
  import { FC, ReactNode } from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, number | number[]>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export const ComposableMap: FC<ComposableMapProps>;

  export interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (geos: unknown[]) => unknown[];
    children: (props: { geographies: Array<{ rsmKey?: string; properties?: Record<string, unknown> }> }) => ReactNode;
  }

  export const Geographies: FC<GeographiesProps>;

  export interface GeographyProps {
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: { default?: object; hover?: object; pressed?: object };
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }

  export const Geography: FC<GeographyProps>;
}
