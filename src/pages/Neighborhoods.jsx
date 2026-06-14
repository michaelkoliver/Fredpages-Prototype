import { useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '../data/neighborhoods.json';
import cityBoundary from '../data/city-boundary.json';
import osm from '../data/osm-neighborhoods.json';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4775, latitude: 38.300, zoom: 12.6 };

const COLORS = {
  'Downtown':                     '#15663f',
  'Celebrate  / Central Park':    '#a8553c',
  'Fall Hill':                    '#3f6b4a',
  'Plank Road / Route 3':         '#7a5230',
  'Hospital / Cowan Blvd':        '#3a6b8a',
  'University / Central Rte 1':   '#6a5a8a',
  'Princess Anne / N. Route 1':   '#b6802a',
  'Dixon Street / Mayfield':      '#996b35',
  'Braehead / National Park':     '#8a4b3a',
  'Lafayette / S. Route 1':       '#5a6b7a',
};

export default function Neighborhoods() {
  const mapRef = useRef(null);

  const labels = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.features.map(f => ({
      type: 'Feature',
      properties: { name: f.properties.name },
      geometry: { type: 'Point', coordinates: [f.properties.cx, f.properties.cy] },
    })),
  }), []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map) requestAnimationFrame(() => map.resize());
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 'calc(var(--nav-h) + var(--nav-h-2)) 0 0 0' }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={CENTER}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="city" type="geojson" data={cityBoundary}>
          <Layer
            id="city-line"
            type="line"
            paint={{ 'line-color': '#1f2422', 'line-width': 2.5 }}
          />
        </Source>
        <Source id="hoods" type="geojson" data={data}>
          <Layer
            id="hood-fill"
            type="fill"
            paint={{
              'fill-color': ['match', ['get', 'name'],
                ...Object.entries(COLORS).flatMap(([k, v]) => [k, v]),
                '#888'],
              'fill-opacity': 0.45,
            }}
          />
          <Layer
            id="hood-line"
            type="line"
            paint={{ 'line-color': '#ffffff', 'line-width': 1.5 }}
          />
        </Source>
        <Source id="hood-labels" type="geojson" data={labels}>
          <Layer
            id="hood-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 14,
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-allow-overlap': true,
            }}
            paint={{
              'text-color': '#1f2422',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            }}
          />
        </Source>
        <Source id="osm-neigh" type="geojson" data={osm}>
          <Layer
            id="osm-neigh-dot"
            type="circle"
            paint={{
              'circle-color': '#a8553c',
              'circle-radius': 4,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1.5,
            }}
          />
          <Layer
            id="osm-neigh-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 11,
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 0.9],
              'text-anchor': 'top',
              'text-allow-overlap': false,
            }}
            paint={{
              'text-color': '#7a2f1a',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
