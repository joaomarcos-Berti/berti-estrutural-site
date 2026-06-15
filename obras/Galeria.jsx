/* global React, HOME_BRAND, OBRAS_CATS, OBRAS_LIST, ObrasLightbox */
// ============================================================================
// OBRAS · HERO + FILTRO + MOSAICO ANIMADO (FLIP)
// O grid é um mosaico de tamanhos variados (std/wide/tall). Ao trocar o
// filtro, as peças remanescentes deslizam para a nova posição via FLIP.
// ============================================================================
const { useState, useRef, useLayoutEffect } = React;

function ObrasGaleria() {
  const accent = HOME_BRAND.blue;
  const validKeys = OBRAS_CATS.map((c) => c.key).concat('andamento');
  const initial = validKeys.includes((window.location.hash || '').replace('#', ''))
    ? window.location.hash.replace('#', '') : 'todas';
  const [filter, setFilter] = useState(initial);
  const [openIdx, setOpenIdx] = useState(-1);
  const [lista, setLista] = useState(OBRAS_LIST); // fallback; substituído pelo content/obras.json
  const gridRef = useRef(null);
  const prevRects = useRef({});

  // Fonte única de dados: content/obras.json (a mesma que o admin edita)
  React.useEffect(() => {
    fetch('content/obras.json?t=' + Date.now())
      .then((r) => r.json())
      .then((d) => { if (d && Array.isArray(d.obras) && d.obras.length) setLista(d.obras); })
      .catch(() => {});
  }, []);

  const emAndamento = (o) => o.status === 'Em andamento';
  const visible = filter === 'andamento'
    ? lista.filter(emAndamento)
    : lista.filter((o) => !emAndamento(o) && (filter === 'todas' || o.cat === filter));

  // ── FLIP: anima reposicionamento ao filtrar ──────────────────────────
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll('[data-obra-card]');
    const next = {};
    cards.forEach((card) => {
      const id = card.dataset.obraCard;
      const r = card.getBoundingClientRect();
      next[id] = r;
      const prev = prevRects.current[id];
      if (prev) {
        const dx = prev.left - r.left;
        const dy = prev.top - r.top;
        if (dx || dy) {
          card.style.transition = 'none';
          card.style.transform = `translate(${dx}px, ${dy}px)`;
          requestAnimationFrame(() => {
            card.style.transition = 'transform 520ms cubic-bezier(.2,.85,.25,1)';
            card.style.transform = '';
          });
        }
      } else {
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 460ms ease, transform 460ms ease';
          card.style.opacity = '1';
          card.style.transform = '';
        });
      }
    });
    prevRects.current = next;
  }, [filter]);

  const finalizadas = lista.filter((o) => !emAndamento(o));
  const counts = OBRAS_CATS.reduce((acc, c) => {
    acc[c.key] = c.key === 'todas' ? finalizadas.length : finalizadas.filter((o) => o.cat === c.key).length;
    return acc;
  }, {});
  counts['andamento'] = lista.filter(emAndamento).length;

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', background: HOME_BRAND.ink, color: '#fff',
        padding: '160px clamp(40px, 8vw, 140px) 56px',
        fontFamily: '"Open Sans", system-ui, sans-serif', overflow: 'hidden',
      }}>
        <img src="assets/photos/aerial.jpg" alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(17,20,24,0.7) 0%, rgba(17,20,24,0.95) 100%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 1340, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif', color: accent,
            fontSize: 13, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            <span style={{ width: 30, height: 1, background: accent }} />
            Portfólio
          </div>
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(56px, 9vw, 150px)', lineHeight: 0.86,
            letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 0 22px',
          }}>Obras que<br/><span style={{ color: accent }}>sustentam.</span></h1>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)',
            maxWidth: 560, margin: 0,
          }}>
            Do varejo de grande fluxo às plantas industriais pesadas. Filtre por
            segmento e explore a engenharia por trás de cada projeto.
          </p>
        </div>
      </section>

      {/* ── FILTRO (botões) ───────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,10,12,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px clamp(40px, 8vw, 140px)',
        fontFamily: '"Open Sans", system-ui, sans-serif',
      }}>
        <div style={{
          maxWidth: 1340, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        }}>
          {OBRAS_CATS.map((c) => {
            const on = filter === c.key;
            return (
              <button key={c.key} onClick={() => setFilter(c.key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '11px 20px', cursor: 'pointer',
                border: `1px solid ${on ? accent : 'rgba(255,255,255,0.2)'}`,
                background: on ? accent : 'transparent',
                color: on ? '#05080c' : 'rgba(255,255,255,0.82)',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
              }}
                onMouseEnter={(e) => { if (!on) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={(e) => { if (!on) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.82)'; } }}
              >
                {c.label}
                <span style={{
                  fontSize: 11, fontFamily: '"Open Sans", sans-serif', fontWeight: 700,
                  padding: '2px 7px', borderRadius: 20,
                  background: on ? 'rgba(5,8,12,0.18)' : 'rgba(255,255,255,0.12)',
                  color: on ? '#05080c' : 'rgba(255,255,255,0.7)',
                }}>{counts[c.key]}</span>
              </button>
            );
          })}

          {counts['andamento'] > 0 && (
            <button onClick={() => setFilter('andamento')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '11px 20px', cursor: 'pointer', marginLeft: 'auto',
              border: `1px solid ${filter === 'andamento' ? accent : 'rgba(71,182,241,0.5)'}`,
              background: filter === 'andamento' ? accent : 'transparent',
              color: filter === 'andamento' ? '#05080c' : accent,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: filter === 'andamento' ? '#05080c' : accent, display: 'inline-block' }} />
              Em andamento
              <span style={{
                fontSize: 11, fontFamily: '"Open Sans", sans-serif', fontWeight: 700,
                padding: '2px 7px', borderRadius: 20,
                background: filter === 'andamento' ? 'rgba(5,8,12,0.18)' : 'rgba(71,182,241,0.18)',
                color: filter === 'andamento' ? '#05080c' : accent,
              }}>{counts['andamento']}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MOSAICO ────────────────────────────────────────────────────── */}
      <section style={{
        background: HOME_BRAND.ink, padding: 'clamp(28px, 4vw, 56px) clamp(40px, 8vw, 140px) clamp(72px, 8vw, 120px)',
      }}>
        <div ref={gridRef} className="obra-grid" style={{ maxWidth: 1340, margin: '0 auto' }}>
          {visible.map((o, i) => (
            <ObraCard key={o.id} obra={o} accent={accent}
              onClick={() => setOpenIdx(visible.findIndex((x) => x.id === o.id))} />
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────── */}
      <ObrasLightbox
        obra={openIdx >= 0 ? visible[openIdx] : null}
        onClose={() => setOpenIdx(-1)}
        onPrev={() => setOpenIdx((p) => (p - 1 + visible.length) % visible.length)}
        onNext={() => setOpenIdx((p) => (p + 1) % visible.length)}
      />

      <style>{`
        .obra-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .obra-cell { aspect-ratio: 4 / 3; }
        @media (max-width: 1000px) {
          .obra-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 620px) {
          .obra-grid { grid-template-columns: 1fr; }
          .obra-cell { aspect-ratio: 16 / 10; }
        }
      `}</style>
    </>
  );
}

// ── Card de obra ───────────────────────────────────────────────────────────
function ObraCard({ obra, accent, onClick }) {
  const statusColor = (obra.status === 'Em obra' || obra.status === 'Em andamento') ? accent
    : obra.status === 'Em projeto' ? '#c9a227' : 'rgba(255,255,255,0.9)';
  return (
    <button
      data-obra-card={obra.id}
      onClick={onClick}
      className="obra-cell"
      style={{
        position: 'relative', padding: 0, border: 'none', cursor: 'pointer',
        overflow: 'hidden', background: '#05080c', color: '#fff', textAlign: 'left',
        willChange: 'transform',
      }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.07)';
        const ov = e.currentTarget.querySelector('[data-ov]');
        if (ov) ov.style.opacity = '1';
        const go = e.currentTarget.querySelector('[data-go]');
        if (go) { go.style.opacity = '1'; go.style.transform = 'translateY(0)'; }
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
        const ov = e.currentTarget.querySelector('[data-ov]');
        if (ov) ov.style.opacity = '0';
        const go = e.currentTarget.querySelector('[data-go]');
        if (go) { go.style.opacity = '0'; go.style.transform = 'translateY(8px)'; }
      }}
    >
      <img src={obra.cover} alt={obra.title} loading="lazy" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', display: 'block',
        transition: 'transform 760ms cubic-bezier(.2,.8,.2,1)',
      }} />
      {/* Gradiente base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)',
      }} />
      {/* Overlay azul no hover */}
      <div data-ov style={{
        position: 'absolute', inset: 0, opacity: 0,
        background: 'linear-gradient(180deg, rgba(7,127,191,0.12) 0%, rgba(7,127,191,0.32) 100%)',
        transition: 'opacity 320ms ease',
      }} />

      {/* Topo: segmento + status */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          background: 'rgba(4,8,12,0.62)', color: accent, padding: '5px 10px',
        }}>{obra.catLabel}</span>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: statusColor,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
          {obra.status}
        </span>
      </div>

      {/* Base: título + meta */}
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16 }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: 26, lineHeight: 0.98,
          letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: 6,
        }}>{obra.title}</div>
        <div style={{
          fontSize: 12.5, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.02em',
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          <span>{obra.city}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
          <span>{obra.area}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
          <span>{obra.tons}</span>
        </div>
        {/* Ver detalhes (hover) */}
        <div data-go style={{
          marginTop: 12, opacity: 0, transform: 'translateY(8px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: '"Barlow Condensed", sans-serif', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: accent,
        }}>Ver obra →</div>
      </div>
    </button>
  );
}

window.ObrasGaleria = ObrasGaleria;
