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

        {/* Mapa (largura total) */}
        <div style={{
          background: '#fff', border: '1px solid rgba(6,25,34,.1)', borderRadius: 20,
          overflow: 'hidden', boxShadow: '0 24px 60px rgba(6,25,34,.12)',
        }}>
          <div ref={mapEl} style={{ position: 'relative', zIndex: 0, minHeight: isMobile ? 360 : 520, background: '#e7ebef' }} />
        </div>

        {/* Lista de obras (separada, abaixo do mapa) */}
        <div style={{
          marginTop: isMobile ? 20 : 28,
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: isMobile ? 12 : 16,
        }}>
            {obras.map(function (o, i) {
              const on = sel === i;
              return (
                <div key={o.id || i} onClick={function () { focar(i); }} style={{
                  position: 'relative', height: 'auto', aspectRatio: '1 / 1',
                  cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
                  background: '#0b1b24',
                  border: '2px solid ' + (on ? blue : 'transparent'),
                  boxShadow: on ? '0 10px 26px rgba(7,127,191,.30)' : '0 4px 14px rgba(6,25,34,.10)',
                  transform: on ? 'translateY(-2px)' : 'none',
                  transition: 'border-color .2s, box-shadow .2s, transform .2s',
                }}
                onMouseEnter={function (e) { if (!on) e.currentTarget.style.boxShadow = '0 12px 26px rgba(6,25,34,.22)'; }}
                onMouseLeave={function (e) { if (!on) e.currentTarget.style.boxShadow = '0 4px 14px rgba(6,25,34,.10)'; }}>
                  {o.cover && <img src={o.cover} alt={o.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,25,34,0) 28%, rgba(6,25,34,.85) 100%)' }} />
                  <div style={{
                    position: 'absolute', top: 10, right: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(71,182,241,.95)', color: '#05222e', padding: '4px 9px', borderRadius: 999,
                    fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#05222e', display: 'inline-block' }} /> Em andamento
                  </div>
                  <div style={{ position: 'absolute', left: 14, right: 14, bottom: 11, color: '#fff' }}>
                    <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 20, textTransform: 'uppercase', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,.55)' }}>{o.title}</div>
                    <div style={{ marginTop: 5, fontSize: 12, color: 'rgba(255,255,255,.88)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ color: blue }}>◢</span><span>{o.city || o.address}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

window.HomeMapa = HomeMapa;
