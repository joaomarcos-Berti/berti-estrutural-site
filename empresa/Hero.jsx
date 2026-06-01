/* global React, HOME_BRAND, HOME_PHOTO */
// ============================================================================
// EMPRESA · HERO
// Mesmo design do hero da home (slideshow Ken Burns + véu escuro),
// porém mais compacto — não ocupa 100vh.
// ============================================================================
const { useState: useStateEH, useEffect: useEffectEH } = React;

const EMPRESA_FRAMES = [
  { src: HOME_PHOTO.aerial,             label: 'Centro Logístico · Londrina' },
  { src: HOME_PHOTO.interiorTruss,      label: 'Showroom Automotivo' },
  { src: HOME_PHOTO.supermarketCeiling, label: 'Atacarejo · 6.500 m²' },
  { src: HOME_PHOTO.factoryInterior,    label: 'Indústria · 12.000 m²' },
];

function EmpresaHero({ accent = HOME_BRAND.blue, overlay = 0.62, cycleMs = 6000 }) {
  const [idx, setIdx] = useStateEH(0);

  useEffectEH(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % EMPRESA_FRAMES.length), cycleMs);
    return () => clearInterval(id);
  }, [cycleMs]);

  return (
    <section id="top" style={{
      position: 'relative',
      height: 'clamp(440px, 60vh, 620px)',
      width: '100%', overflow: 'hidden',
      background: '#000', color: '#fff',
      fontFamily: '"Open Sans", system-ui, sans-serif',
    }}>
      {/* =================== BACKGROUND · slideshow Ken Burns =================== */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {EMPRESA_FRAMES.map((f, i) => (
          <div key={f.src} style={{
            position: 'absolute', inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1500ms ease-in-out',
          }}>
            <img src={f.src} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: i === idx ? 'scale(1.08)' : 'scale(1)',
              transition: `transform ${cycleMs + 1500}ms linear`,
              filter: 'grayscale(0.1) contrast(1.05)',
              display: 'block',
            }} />
          </div>
        ))}
      </div>

      {/* =================== Véu escuro (gradiente esq → dir) =================== */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background:
          `linear-gradient(270deg, rgba(0,0,0,${overlay * 0.45}) 0%, rgba(0,0,0,${overlay * 0.55}) 40%, rgba(0,0,0,${overlay + 0.18}) 100%)`,
      }} />
      {/* Vinheta */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* =================== Conteúdo · bloco à esquerda =================== */}
      <div style={{
        position: 'relative', zIndex: 5,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 1440, width: '100%',
        margin: '0 auto',
        padding: '120px 0 60px',
        paddingLeft:  'clamp(80px, 10vw, 180px)',
        paddingRight: 64,
      }}>
        <div style={{ maxWidth: 700 }}>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 14,
          }}>
            <a href="index.html" style={{
              color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
            }}>Home</a>
            <span style={{ margin: '0 10px', color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: accent }}>A Empresa</span>
          </div>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: accent, fontSize: 13.5, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            <span style={{ width: 26, height: 1, background: accent }} />
            Desde 2009 · Londrina · PR
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(38px, 4.2vw, 64px)', lineHeight: 0.94,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
            color: '#fff',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}>
            Por trás de cada obra,<br/>
            <span style={{ color: accent }}>uma engenharia inteira.</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 16.5, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.88)',
            marginTop: 22, marginBottom: 0,
            maxWidth: 540,
            textShadow: '0 2px 14px rgba(0,0,0,0.5)',
          }}>
            17 anos transformando projetos em estrutura — engenharia, fabricação
            e montagem coordenadas como uma máquina única.
          </p>
        </div>
      </div>

      {/* =================== Indicadores de slide =================== */}
      <div style={{
        position: 'absolute', left: 'clamp(80px, 10vw, 180px)', bottom: 24, zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'rgba(255,255,255,0.75)',
      }}>
        {EMPRESA_FRAMES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
            width: i === idx ? 24 : 12, height: 2,
            background: i === idx ? accent : 'rgba(255,255,255,0.35)',
            border: 'none', padding: 0, cursor: 'pointer',
            transition: 'width 240ms ease, background 240ms ease',
          }} />
        ))}
      </div>
    </section>
  );
}

window.EmpresaHero = EmpresaHero;
