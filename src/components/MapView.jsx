import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { tone, PLACE_CATS } from '../data';

function makeIcon(row, selected) {
  const coin = `<div class="coin${PLACE_CATS.has(row.cat) ? ' sq' : ''}" style="background:${tone(row.color)}">${row.name[0]}</div>`;
  return L.divIcon({
    html: `<div class="pin${selected ? ' sel' : ''}">${coin}</div>`,
    className: '',
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -18],
  });
}

function popupHTML(r) {
  const rate = r.rating > 0
    ? `<div class="pop-rate">★ ${r.rating} · ${r.reviews} reviews</div>`
    : '';
  return `<div class="pop"><div class="pop-head" style="background:${tone(r.color)}">${r.name[0]}</div><div class="pop-b"><div class="pop-name">${r.name}</div><div class="pop-meta">${r.cat} · ${r.hood}</div>${rate}</div></div>`;
}

function MapBehavior({ rows, cat, hoverId, markerRefs }) {
  const map = useMap();

  // fitBounds when cat/rows changes
  useEffect(() => {
    const visible = cat === 'All' ? rows : rows.filter(r => r.cat === cat);
    const pts = visible.filter(r => r.coords).map(r => r.coords);
    if (pts.length) {
      const mobile = window.innerWidth <= 600;
      const padLeft   = mobile ? 16  : 384; // desktop: clear the sidebar panel
      const padBottom = mobile ? 220 : 40;  // mobile: clear the bottom sheet at half-height
      try {
        map.fitBounds(pts, { paddingTopLeft: [padLeft, 30], paddingBottomRight: [40, padBottom], animate: false });
      } catch (e) {}
    }
  }, [map, rows, cat]);

  // pan/popup when hoverId changes
  useEffect(() => {
    if (hoverId != null) {
      const r = rows.find(x => x.id === hoverId);
      const mk = markerRefs.current[hoverId];
      if (r && r.coords) map.panTo(r.coords, { animate: true, duration: 0.4 });
      if (mk) mk.openPopup();
    } else {
      map.closePopup();
    }
  }, [map, hoverId, rows, markerRefs]);

  return null;
}

function PinMarker({ row, onOpen, isHovered, markerRefs }) {
  const markerRef = useRef(null);

  useEffect(() => {
    const mk = markerRef.current;
    if (!mk) return;
    mk.setIcon(makeIcon(row, isHovered));
  }, [isHovered, row]);

  const popupContent = popupHTML(row);

  return (
    <Marker
      ref={el => {
        markerRef.current = el;
        if (el) markerRefs.current[row.id] = el;
      }}
      position={row.coords}
      icon={makeIcon(row, isHovered)}
      eventHandlers={{
        click: () => onOpen(row),
        popupopen: e => {
          const el = e.popup.getElement();
          if (el) {
            const pop = el.querySelector('.pop');
            if (pop) pop.onclick = () => onOpen(row);
          }
        },
      }}
    >
      <Popup closeButton={false} offset={[0, 4]}>
        <div dangerouslySetInnerHTML={{ __html: popupContent }} />
      </Popup>
    </Marker>
  );
}

export default function MapView({ rows, cat, hoverId, onOpen }) {
  const markerRefs = useRef({});
  const visible = cat === 'All' ? rows : rows.filter(r => r.cat === cat);
  const mappable = visible.filter(r => r.coords);

  return (
    <MapContainer
      center={[38.3016, -77.4605]}
      zoom={13}
      zoomControl={false}
      attributionControl={true}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains="abc"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />
      <MapBehavior rows={rows} cat={cat} hoverId={hoverId} markerRefs={markerRefs} />
      {mappable.map(row => (
        <PinMarker
          key={row.id}
          row={row}
          onOpen={onOpen}
          isHovered={hoverId === row.id}
          markerRefs={markerRefs}
        />
      ))}
    </MapContainer>
  );
}
