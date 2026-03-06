'use client';

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

const TOPOJSON_URL =
  'https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/br-states.json';

export default function MapSaoPaulo() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 650,
        center: [-54, -15],
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={TOPOJSON_URL}>
        {({ geographies }: { geographies: Array<{ id?: string; rsmKey: string; [key: string]: unknown }> }) =>
          geographies.map((geo) => {
            const isSP = geo.id === 'SP';
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isSP ? '#4B9574' : '#e6eceb'}
                stroke={isSP ? '#2d6b4a' : 'rgba(0,0,0,0.22)'}
                strokeWidth={0.7}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: isSP ? '#5aa67d' : '#d7e1df' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
