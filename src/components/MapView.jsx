import { useRef, useCallback, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import { tone } from '../data';
import 'mapbox-gl/dist/mapbox-gl.css';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CENTER = { longitude: -77.4605, latitude: 38.3016, zoom: 13, pitch: 48 };

function Pin({ row, selected, onClick }) {
  const bg = tone(row.color);
  const isPlace = row.type === 'public';
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

export default function MapView({ rows, cat, hoverId, onOpen, shown = true }) {
  const mapRef = useRef(null);
  const visible  = useMemo(
    () => cat === 'All' ? rows : rows.filter(r => r.cat === cat),
    [rows, cat]
  );
  // Trails are listings (markers) now; their routes are rendered by the
  // basemap straight from OpenStreetMap, so we no longer draw geometry here.
  const mappable = visible.filter(r => r.coords);
  const hovered  = hoverId != null ? rows.find(r => r.id === hoverId) : null;

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
        // keep the tilt — fitBounds resets pitch to 0 unless we pass it
        pitch: 48,
        animate: false,
      }
    );
  }, [cat]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map) fitVisible(map);
  }, [fitVisible]);

  useEffect(() => {
    if (!shown) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    requestAnimationFrame(() => {
      map.resize();
      fitVisible(map);
    });
  }, [shown, fitVisible]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={TOKEN}
      initialViewState={CENTER}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/standard"
      onLoad={e => {
        const map = e.target;
        // Standard basemap config: keep roads/places, hide Mapbox's own POI
        // icons so they don't compete with our business pins.
        try { map.setConfigProperty('basemap', 'showPointOfInterestLabels', false); }
        catch { /* non-Standard style: config not supported */ }
        fitVisible(map);
      }}
      cooperativeGestures={false}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {mappable.map(row => (
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
              <div className="pop-meta">{hovered.cat}{hovered.hood ? ` · ${hovered.hood}` : ''}</div>
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
