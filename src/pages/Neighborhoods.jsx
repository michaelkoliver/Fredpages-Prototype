import { useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '../data/neighborhoods.json';
import cityBoundary from '../data/city-boundary.json';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4775, latitude: 38.300, zoom: 12.6 };

const COLORS = {
  'Downtown':        '#15663f',
  'Central Park':    '#a8553c',
  'Fall Hill':       '#3f6b4a',
  'Plank Road':      '#7a5230',
  'Mary Washington': '#3a6b8a',
  'UMW':             '#6a5a8a',
  'College Heights': '#6a5a8a',
  'Greenbrier':      '#6a5a8a',
  'Riverside':       '#b6802a',
  'Mayfield':        '#996b35',
  'Braehead':        '#8a4b3a',
  'Lafayette':       '#5a6b7a',
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
      </Map>
    </div>
  );
}
