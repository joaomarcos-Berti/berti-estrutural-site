/* global React, HOME_BRAND */
// ============================================================================
// OBRAS · LIGHTBOX / FICHA DA OBRA
// Overlay com foto grande, galeria de miniaturas (inclui modelo BIM),
// ficha técnica e navegação ←/→ entre as obras filtradas.
// ============================================================================
const { useState, useEffect } = React;

function ObrasLightbox({ obra, onClose, onPrev, onNext }) {
  const [active, setActive] = useState(0);
  const accent = HOME_BRAND.blue;

  // Reset da imagem ativa ao trocar de obra
  useEffect(() => { setActive(0); }, [obra && obra.id]);

  // Teclado: Esc fecha, ←/→ navegam
  useEffect(() => {
    if (!obra) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [obra, onClose, onNext, onPrev]);

  if (!obra) return null;

  const specs = [
    { k: 'Cidade',  v: obra.city },
    { k: 'Área',    v: obra.area },
    { k: 'Aço',     v: obra.tons },
    { k: 'Vão livre', v: obra.vao },
    { k: 'Ano',     v: obra.year },
    { k: 'Status',  v: obra.status },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,8,12,0.92)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 56px)',
        fontFamily: '"Open Sans", system-ui, sans-serif',
        animation: 'obraFade 220ms ease',
      }}
    >
      {/* Fechar */}
      <button onClick={onClose} aria-label="Fechar" style={{
        position: 'absolute', top: 22, right: 26, zIndex: 3,
        width: 48, height: 48, border: '1px solid rgba(255,255,255,0.25)',
        background: 'transparent', color: '#fff', cursor: 'pointer',
        fontSize: 22, lineHeight: 1,
        transition: 'background 180ms ease, border-color 180ms ease',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
      >✕</button>

      {/* Setas */}
      <NavArrow dir="prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} accent={accent} />
      <NavArrow dir="next" onClick={(e) => { e.stopPropagation(); onNext(); }} accent={accent} />

      {/* Painel */}
      <div onClick={(e) => e.stopPropagation()} style={{
        display: 'grid', gridTemplateColumns: '1.5fr 1fr',
        maxWidth: 1180, width: '100%', maxHeight: '88vh',
        background: HOME_BRAND.ink, overflow: 'hidden',
        boxShadow: '0 40px 120px -30px rgba(0,0,0,0.8)',
      }}>
        {/* Lado imagem */}
        <div style={{ position: 'relative', background: '#05080c', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <img key={obra.gallery[active]} src={obra.gallery[active]} alt={obra.title} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', display: 'block', animation: 'obraFade 280ms ease',
            }} />
            {/* etiqueta segmento */}
            <div style={{
              position: 'absolute', top: 18, left: 18,
              background: 'rgba(4,8,12,0.78)', color: accent,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '7px 13px',
            }}>{obra.catLabel}</div>
          </div>
          {/* Miniaturas */}
          {obra.gallery.length > 1 && (
            <div style={{ display: 'flex', gap: 8, padding: 12, background: '#05080c' }}>
              {obra.gallery.map((g, i) => (
                <button key={g} onClick={() => setActive(i)} style={{
                  width: 84, height: 58, padding: 0, border: 'none', cursor: 'pointer',
                  outline: i === active ? `2px solid ${accent}` : '2px solid transparent',
                  outlineOffset: -2, flexShrink: 0, background: '#000',
                  opacity: i === active ? 1 : 0.55, transition: 'opacity 180ms ease',
                }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado ficha */}
        <div style={{ padding: 'clamp(28px, 3vw, 44px)', color: '#fff', overflowY: 'auto' }}>
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif', color: accent,
            fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>{obra.city}</div>
          <h3 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(30px, 3vw, 44px)', lineHeight: 0.98,
            letterSpacing: '-0.01em', textTransform: 'uppercase', margin: '0 0 20px',
          }}>{obra.title}</h3>

          <p style={{
            fontSize: 15.5, lineHeight: 1.62, color: 'rgba(255,255,255,0.74)',
            margin: '0 0 28px', textWrap: 'pretty',
          }}>{obra.desc}</p>

          {/* Ficha técnica */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid rgba(255,255,255,0.12)',
          }}>
            {specs.map((s, i) => (
              <div key={s.k} style={{
                padding: '16px 4px',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                paddingLeft: i % 2 === 1 ? 18 : 4,
              }}>
                <div style={{
                  fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 6,
                }}>{s.k}</div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                  fontSize: 22, color: '#fff', letterSpacing: '0.01em',
                }}>{s.v}</div>
              </div>
            ))}
          </div>

          <a href="Home%20Berti.html#orcamento" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28,
            background: accent, color: '#000', padding: '14px 26px',
            fontSize: 12.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>Quero uma obra assim <span>→</span></a>
        </div>
      </div>

      <style>{`
        @keyframes obraFade { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 860px) {
          .obra-lb-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function NavArrow({ dir, onClick, accent }) {
  const isPrev = dir === 'prev';
  return (
    <button onClick={onClick} aria-label={isPrev ? 'Anterior' : 'Próxima'} style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [isPrev ? 'left' : 'right']: 'clamp(8px, 2vw, 24px)', zIndex: 3,
      width: 54, height: 54, borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(4,8,12,0.5)',
      color: '#fff', cursor: 'pointer', fontSize: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 180ms ease, border-color 180ms ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(4,8,12,0.5)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
    >{isPrev ? '←' : '→'}</button>
  );
}

window.ObrasLightbox = ObrasLightbox;
