/* global React, HOME_BRAND, useMobile, L */
// ============================================================================
// HOME · OBRAS EM ANDAMENTO NO MAPA
// Lê content/obras.json, filtra status "Em andamento" com lat/lng e plota no
// mapa (Leaflet + tiles CartoDB). Sidebar lista as obras; clique foca no mapa.
// Fica logo abaixo da seção 3D.
// ============================================================================
const { useState: useStateMapa, useEffect: useEffectMapa, useRef: useRefMapa } = React;

function HomeMapa() {
  const isMobile = useMobile();
  const blue = HOME_BRAND.blue;
  const blueDark = HOME_BRAND.blueDark;
  const ink = '#061922';

  const [obras, setObras] = useStateMapa([]);
  const [sel, setSel] = useStateMapa(null);
  const [visMobile, setVisMobile] = useStateMapa(3);
  const mapEl = useRefMapa(null);
  const mapRef = useRefMapa(null);
  const markersRef = useRefMapa({});

  // Carrega obras em andamento com coordenadas
  useEffectMapa(() => {
    fetch('content/obras.json?t=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        const lista = (d.obras || [])
          .map(function (o) { return Object.assign({}, o, { lat: parseFloat(o.lat), lng: parseFloat(o.lng) }); })
          .filter(function (o) { return o.status === 'Em andamento' && isFinite(o.lat) && isFinite(o.lng); });
        setObras(lista);
      })
      .catch(function () {});
  }, []);

  // Inicializa o mapa quando os dados chegam e o Leaflet está disponível
  useEffectMapa(() => {
    if (!obras.length || mapRef.current) return;
    let tries = 0;
    const init = function () {
      if (!window.L || !mapEl.current || !mapEl.current.clientWidth) {
        if (tries++ < 40) setTimeout(init, 80);
        return;
      }
      const map = L.map(mapEl.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
        .setView([-23.3299, -51.1816], 12);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20,
      }).addTo(map);

      const markers = {};
      obras.forEach(function (o, i) {
        const html =
          '<div style="position:relative;width:58px;height:70px;">' +
            '<div style="width:58px;height:58px;border-radius:13px;overflow:hidden;border:3px solid ' + blue + ';box-shadow:0 8px 18px rgba(6,25,34,.4);background:#fff center/cover no-repeat;background-image:url(\'' + (o.cover || '') + '\');"></div>' +
            '<div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%) rotate(45deg);width:15px;height:15px;background:' + blue + ';border-radius:3px;box-shadow:0 4px 8px rgba(6,25,34,.3);"></div>' +
          '</div>';
        const icon = L.divIcon({ className: '', html: html, iconSize: [58, 70], iconAnchor: [29, 70], popupAnchor: [0, -66] });
        const m = L.marker([o.lat, o.lng], { icon: icon }).addTo(map);
        const popup =
          '<div style="width:230px;font-family:\'Open Sans\',sans-serif;">' +
            (o.cover ? '<img src="' + o.cover + '" style="width:100%;height:120px;object-fit:cover;display:block;"/>' : '') +
            '<div style="padding:12px 14px;">' +
              '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:800;font-size:18px;text-transform:uppercase;color:#061922;line-height:1;">' + (o.title || '') + '</div>' +
              '<div style="margin-top:6px;font-size:12.5px;color:#5b6b75;">' + (o.address || o.city || '') + '</div>' +
            '</div>' +
          '</div>';
        m.bindPopup(popup, { minWidth: 230, closeButton: true, autoPan: true, autoPanPadding: [24, 24] });
        markers[i] = m;
      });
      markersRef.current = markers;
      mapRef.current = map;

      if (obras.length === 1) {
        map.setView([obras[0].lat, obras[0].lng], 14);
      } else {
        const group = L.featureGroup(Object.values(markers));
        try { map.fitBounds(group.getBounds().pad(0.3)); } catch (e) {}
      }
      // Corrige dimensionamento dentro do container flex
      setTimeout(function () { map.invalidateSize(); }, 250);
    };
    init();
  }, [obras]);

  function focar(i) {
    setSel(i);
    const map = mapRef.current, m = markersRef.current[i];
    if (!map || !m) return;
    map.invalidateSize();
    map.closePopup();
    map.once('moveend', function () { m.openPopup(); });
    map.flyTo(m.getLatLng(), 16, { duration: 0.8 });
  }

  if (!obras.length) return null;

  return (
    <section id="obras-mapa" style={{
      background: HOME_BRAND.paper, fontFamily: '"Open Sans", sans-serif', color: ink,
      padding: isMobile ? '56px 20px 64px' : '88px 40px 96px',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        <style>{'@keyframes beSpin{to{transform:rotate(360deg)}} .be-spin{width:15px;height:15px;border:2.5px solid rgba(7,127,191,.25);border-top-color:#077fbf;border-radius:50%;display:inline-block;animation:beSpin .8s linear infinite;flex-shrink:0}'}</style>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 8 }}>
          <span style={{ width: 26, height: 1, background: blueDark, display: 'inline-block' }} />
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: blueDark }}>
            Obras em andamento · {obras.length} {obras.length === 1 ? 'ativa' : 'ativas'}
          </span>
          <span className="be-spin" title="Em andamento" />
        </div>
        <h2 style={{ margin: '0 0 22px', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: isMobile ? 24 : 32, lineHeight: 1, letterSpacing: '-0.01em', textTransform: 'uppercase', color: ink }}>
          Onde estamos construindo agora
        </h2>

        {/* Lista lateral + mapa lado a lado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '400px 1fr',
          background: '#fff', border: '1px solid rgba(6,25,34,.1)', borderRadius: 20,
          overflow: 'hidden', boxShadow: '0 24px 60px rgba(6,25,34,.12)',
        }}>
          {/* Lista lateral — cards retangulares horizontais */}
          <div style={{
            order: isMobile ? 2 : 1,
            padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
            overflowY: isMobile ? 'visible' : 'auto', maxHeight: isMobile ? 'none' : 600,
            borderRight: isMobile ? 'none' : '1px solid rgba(6,25,34,.08)',
          }}>
            {(isMobile ? obras.slice(0, visMobile) : obras).map(function (o, i) {
              const on = sel === i;
              return (
                <div key={o.id || i} onClick={function () { focar(i); }} style={{
                  display: 'flex', alignItems: 'stretch', cursor: 'pointer',
                  borderRadius: 12, overflow: 'hidden', background: '#fff',
                  border: '1.5px solid ' + (on ? blue : 'rgba(6,25,34,.12)'),
                  boxShadow: on ? '0 8px 20px rgba(7,127,191,.18)' : '0 1px 3px rgba(6,25,34,.06)',
                  transition: 'border-color .18s, box-shadow .18s',
                }}
                onMouseEnter={function (e) { if (!on) e.currentTarget.style.boxShadow = '0 6px 16px rgba(6,25,34,.14)'; }}
                onMouseLeave={function (e) { if (!on) e.currentTarget.style.boxShadow = '0 1px 3px rgba(6,25,34,.06)'; }}>
                  <div style={{ flex: '0 0 108px', alignSelf: 'stretch', minHeight: 86, background: '#dfe6ec' }}>
                    {o.cover && <img src={o.cover} alt={o.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: '11px 13px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: blue, display: 'inline-block' }} />
                      <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: blueDark }}>Em andamento</span>
                    </div>
                    <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 17, textTransform: 'uppercase', color: ink, lineHeight: 1.08 }}>{o.title}</div>
                  </div>
                </div>
              );
            })}
            {isMobile && obras.length > 3 && (
              <button
                onClick={function () {
                  setVisMobile(function (v) { return v >= obras.length ? 3 : Math.min(obras.length, v + 3); });
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 4, padding: '12px 18px', cursor: 'pointer', width: '100%',
                  background: '#fff', color: blueDark,
                  border: '1.5px solid rgba(6,25,34,.14)', borderRadius: 12,
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                  fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase',
                }}
              >
                {visMobile >= obras.length
                  ? 'Recolher obras'
                  : 'Ver mais (' + Math.min(visMobile, obras.length) + '/' + obras.length + ')'}
                <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1, display: 'inline-block', transform: visMobile >= obras.length ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>↓</span>
              </button>
            )}
          </div>

          {/* Mapa */}
          <div ref={mapEl} style={{ order: isMobile ? 1 : 2, position: 'relative', zIndex: 0, minHeight: isMobile ? 340 : 600, background: '#e7ebef' }} />
        </div>
      </div>
    </section>
  );
}

window.HomeMapa = HomeMapa;
