import { useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '../data/neighborhoods.json';
import cityBoundary from '../data/city-boundary.json';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4775, latitude: 38.300, zoom: 12.6 };

const COLORS = {};
const PALETTE = ['#15663f','#a8553c','#3f6b4a','#7a5230','#3a6b8a','#6a5a8a','#b6802a','#996b35','#8a4b3a','#5a6b7a','#3a7a5a','#7a3a5a','#5a7a3a','#3a5a7a','#7a5a3a'];

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

  const colorData = useMemo(() => {
    const d = JSON.parse(JSON.stringify(data));
    d.features.forEach((f, i) => { f.properties.color = PALETTE[i % PALETTE.length]; });
    return d;
  }, []);

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
        <Source id="hoods" type="geojson" data={colorData}>
          <Layer
            id="hood-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.42,
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
              'text-size': 11,
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-allow-overlap': false,
              'text-padding': 2,
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
