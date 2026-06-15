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
  const mapEl = useRefMapa(null);
  const mapRef = useRefMapa(null);
  const markersRef = useRefMapa({});

  // Carrega obras em andamento com coordenadas
  useEffectMapa(() => {
    fetch('content/obras.json?t=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        const lista = (d.obras || []).filter(function (o) {
          return o.status === 'Em andamento' && typeof o.lat === 'number' && typeof o.lng === 'number';
        });
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

      const group = L.featureGroup(Object.values(markers));
      try { map.fitBounds(group.getBounds().pad(0.3)); } catch (e) {}
    };
    init();
  }, [obras]);

  function focar(i) {
    setSel(i);
    const map = mapRef.current, m = markersRef.current[i];
    if (map && m) { map.flyTo(m.getLatLng(), 15, { duration: 0.8 }); m.openPopup(); }
  }

  if (!obras.length) return null;

  return (
    <section id="obras-mapa" style={{
      background: HOME_BRAND.paper, fontFamily: '"Open Sans", sans-serif', color: ink,
      padding: isMobile ? '56px 20px 64px' : '88px 40px 96px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{ width: 30, height: 1, background: blueDark, display: 'inline-block' }} />
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '0.28em', textTransform: 'uppercase', color: blueDark }}>
            Obras em andamento · {obras.length} ativas
          </span>
        </div>
        <h2 style={{ margin: '0 0 28px', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 900, fontSize: isMobile ? 36 : 50, lineHeight: 0.92, letterSpacing: '-0.01em', textTransform: 'uppercase', color: ink }}>
          Onde estamos<br/>construindo agora
        </h2>

        {/* Grade: lista + mapa */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '360px 1fr',
          gap: 18, background: '#fff', border: '1px solid rgba(6,25,34,.1)', borderRadius: 20,
          overflow: 'hidden', boxShadow: '0 24px 60px rgba(6,25,34,.12)',
        }}>
          {/* Lista */}
          <div style={{
            padding: 16, display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 12,
            overflowX: isMobile ? 'auto' : 'visible', overflowY: isMobile ? 'visible' : 'auto',
            maxHeight: isMobile ? 'none' : 560,
          }}>
            {obras.map(function (o, i) {
              const on = sel === i;
              return (
                <div key={o.id || i} onClick={function () { focar(i); }} style={{
                  flex: isMobile ? '0 0 220px' : 'initial',
                  cursor: 'pointer', borderRadius: 14, overflow: 'hidden', background: '#fff',
                  border: '1px solid ' + (on ? blue : 'rgba(6,25,34,.1)'),
                  boxShadow: on ? '0 8px 20px rgba(7,127,191,.18)' : '0 4px 12px rgba(6,25,34,.06)',
                  transition: 'border-color .18s, box-shadow .18s',
                }}>
                  {o.cover && <img src={o.cover} alt={o.title} style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }} />}
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 17, textTransform: 'uppercase', color: ink, lineHeight: 1 }}>{o.title}</div>
                    <div style={{ marginTop: 5, fontSize: 12.5, color: blueDark, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>◢</span><span>{o.city || o.address}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mapa */}
          <div ref={mapEl} style={{ minHeight: isMobile ? 360 : 560, background: '#e7ebef' }} />
        </div>
      </div>
    </section>
  );
}

window.HomeMapa = HomeMapa;
