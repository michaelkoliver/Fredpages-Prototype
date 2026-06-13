import { useEffect, useMemo, useRef, useState } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '../data/neighborhoods.json';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4605, latitude: 38.3016, zoom: 13 };

const GROUP_COLORS = {
  'Downtown':              '#15663f',
  'Riverside North':       '#2a7a8a',
  'Central Park':          '#a8553c',
  'Celebrate Virginia':    '#b6802a',
  'College Heights / UMW': '#6a5a8a',
  'Hospital / Cowan':      '#3a6b8a',
  'Plank Road':            '#7a5230',
  'Fall Hill':             '#3f6b4a',
  'Mayfield':              '#996b35',
  'Braehead':              '#8a4b3a',
  'Lafayette South':       '#5a6b7a',
};

export default function Neighborhoods() {
  const mapRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  const fc = useMemo(() => data, []);
  const groups = useMemo(() => {
    const m = new Map();
    fc.features.forEach(f => {
      const g = f.properties.group;
      if (!m.has(g)) m.set(g, []);
      m.get(g).push(f.properties.name);
    });
    return Array.from(m.entries()).sort();
  }, [fc]);

  const labelData = useMemo(() => ({
    type: 'FeatureCollection',
    features: fc.features.map(f => {
      let lats = 0, lngs = 0, n = 0;
      f.geometry.coordinates[0].forEach(([lo, la]) => { lngs += lo; lats += la; n++; });
      return {
        type: 'Feature',
        properties: f.properties,
        geometry: { type: 'Point', coordinates: [lngs/n, lats/n] },
      };
    }),
  }), [fc]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    requestAnimationFrame(() => map.resize());
  }, []);

  return (
    <div className="page-wrap" style={{ maxWidth: 'none', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', margin: 0, marginRight: 'auto' }}>Neighborhoods</h1>
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{fc.features.length} polygons · {groups.length} suggested groups</span>
        <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
          Labels
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: 'calc(100vh - var(--nav-h) - var(--nav-h-2) - 55px)' }}>
        <div style={{ overflowY: 'auto', borderRight: '1px solid var(--line)', padding: '8px 0' }}>
          {groups.map(([g, members]) => (
            <div key={g} style={{ padding: '8px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: GROUP_COLORS[g] || '#888' }} />
                {g}
                <span style={{ color: 'var(--text-3)', fontSize: 12, fontWeight: 500, marginLeft: 'auto' }}>{members.length}</span>
              </div>
              <ul style={{ margin: '4px 0 0 22px', padding: 0, listStyle: 'none', fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                {members.sort().map(n => <li key={n}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Map
            ref={mapRef}
            mapboxAccessToken={TOKEN}
            initialViewState={CENTER}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            interactiveLayerIds={['hood-fill']}
            onMouseMove={e => {
              const f = e.features?.[0];
              setHovered(f ? f.properties : null);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <NavigationControl position="top-right" showCompass={false} />
            <Source id="hoods" type="geojson" data={fc} promoteId="name">
              <Layer
                id="hood-fill"
                type="fill"
                paint={{
                  'fill-color': ['match', ['get', 'group'],
                    ...Object.entries(GROUP_COLORS).flatMap(([k, v]) => [k, v]),
                    '#888'],
                  'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.55, 0.32],
                }}
              />
              <Layer
                id="hood-line"
                type="line"
                paint={{ 'line-color': '#ffffff', 'line-width': 1 }}
              />
            </Source>
            {showLabels && (
              <Source id="hood-labels" type="geojson" data={labelData}>
                <Layer
                  id="hood-label"
                  type="symbol"
                  layout={{
                    'text-field': ['get', 'name'],
                    'text-size': 10,
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-allow-overlap': false,
                    'text-anchor': 'center',
                  }}
                  paint={{
                    'text-color': '#1f2422',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1.5,
                  }}
                />
              </Source>
            )}
          </Map>
          {hovered && (
            <div style={{
              position: 'absolute', bottom: 18, left: 18, background: '#fff',
              border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px',
              boxShadow: 'var(--shadow-2)', minWidth: 200, fontSize: 13,
            }}>
              <b style={{ fontSize: 14, display: 'block' }}>{hovered.name}</b>
              <span style={{ color: 'var(--text-2)' }}>{hovered.group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
