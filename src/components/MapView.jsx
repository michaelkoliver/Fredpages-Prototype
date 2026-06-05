import { useRef, useCallback, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import { tone, PLACE_CATS, TRAIL_PATHS, TRAIL_PATH_IDS } from '../data';
import 'mapbox-gl/dist/mapbox-gl.css';

const TRAIL_CASING = {
  id: 'trails-casing',
  type: 'line',
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': '#ffffff', 'line-width': 8, 'line-opacity': 0.55 },
};

const TRAIL_MULTIUSE = {
  id: 'trails-multiuse',
  type: 'line',
  filter: ['==', ['get', 'kind'], 'multi-use'],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': ['get', 'color'], 'line-width': 4.5, 'line-opacity': 0.9 },
};

const TRAIL_NATURE = {
  id: 'trails-nature',
  type: 'line',
  filter: ['==', ['get', 'kind'], 'nature'],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-opacity': 0.9, 'line-dasharray': [3, 2] },
};

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4605, latitude: 38.3016, zoom: 13 };

function Pin({ row, selected, onClick }) {
  const bg = tone(row.color);
  const isPlace = PLACE_CATS.has(row.cat);
  return (
    <Marker
      longitude={row.coords[1]}
      latitude={row.coords[0]}
      anchor="center"
      onClick={e => { e.originalEvent.stopPropagation(); onClick(row); }}
    >
      <div className={`pin${selected ? ' sel' : ''}`}>
        <div className={`coin${isPlace ? ' sq' : ''}`} style={{ background: bg }}>
          {row.name[0]}
        </div>
      </div>
    </Marker>
  );
}

export default function MapView({ rows, cat, hoverId, onOpen }) {
  const mapRef = useRef(null);
  const visible  = cat === 'All' ? rows : rows.filter(r => r.cat === cat);
  const mappable = visible.filter(r => r.coords);
  const pinnable = mappable.filter(r => !TRAIL_PATH_IDS.has(r.id));
  const hovered  = hoverId != null ? rows.find(r => r.id === hoverId) : null;

  // Filter trail GeoJSON to only the trails visible under current category
  const visibleTrailIds = useMemo(() => new Set(
    visible.filter(r => TRAIL_PATH_IDS.has(r.id)).map(r => r.id)
  ), [visible]);

  const trailData = useMemo(() => ({
    ...TRAIL_PATHS,
    features: TRAIL_PATHS.features.filter(f => visibleTrailIds.has(f.properties.id)),
  }), [visibleTrailIds]);

  // fitBounds when category changes
  const fitVisible = useCallback((map) => {
    if (!mappable.length) return;
    const lngs = mappable.map(r => r.coords[1]);
    const lats = mappable.map(r => r.coords[0]);
    const mobile = window.innerWidth <= 600;
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      {
        padding: {
          top: 30,
          left:   mobile ? 16  : 384,
          right:  40,
          bottom: mobile ? 220 : 40,
        },
        animate: false,
      }
    );
  }, [cat]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map) fitVisible(map);
  }, [fitVisible]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={TOKEN}
      initialViewState={CENTER}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      onLoad={e => fitVisible(e.target)}
      cooperativeGestures={false}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {/* Trails rendered as line paths */}
      <Source id="trails" type="geojson" data={trailData}>
        <Layer {...TRAIL_CASING} />
        <Layer {...TRAIL_MULTIUSE} />
        <Layer {...TRAIL_NATURE} />
      </Source>

      {pinnable.map(row => (
        <Pin
          key={row.id}
          row={row}
          selected={hoverId === row.id}
          onClick={onOpen}
        />
      ))}

      {hovered && hovered.coords && (
        <Popup
          longitude={hovered.coords[1]}
          latitude={hovered.coords[0]}
          anchor="bottom"
          offset={18}
          closeButton={false}
          closeOnClick={false}
        >
          <div className="pop" onClick={() => onOpen(hovered)} style={{ cursor: 'pointer' }}>
            <div className="pop-head" style={{ background: tone(hovered.color) }}>{hovered.name[0]}</div>
            <div className="pop-b">
              <div className="pop-name">{hovered.name}</div>
              <div className="pop-meta">{hovered.cat} · {hovered.hood}</div>
              {hovered.rating > 0 && (
                <div className="pop-rate">★ {hovered.rating} · {hovered.reviews} reviews</div>
              )}
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
