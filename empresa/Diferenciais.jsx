/* global React, HOME_BRAND */
// ============================================================================
// EMPRESA · DIFERENCIAIS — 3 colunas limpas, sem imagens, visual moderno
// ============================================================================

const DIFERENCIAIS_ITEMS = [
  {
    num: '01',
    title: 'Qualidade e Resistência',
    body: 'Obras projetadas com ligações 100% parafusadas, produtos certificados, alta resistência e proteção galvanizada ou pintura de alta qualidade.',
    tag: 'Engenharia certificada',
  },
  {
    num: '02',
    title: 'Soluções Tecnológicas',
    body: 'Aplicada em cada obra para melhor aproveitamento dos recursos, com logística integrada, segurança e significativa redução dos prazos.',
    tag: 'BIM · VR · CNC',
  },
  {
    num: '03',
    title: 'Para Sua Obra',
    body: 'Trazemos rentabilidade, dinamismo, segurança, sustentabilidade e rigor no cumprimento dos cronogramas para sua obra.',
    tag: 'Compromisso integral',
  },
];

function EmpresaDiferenciais() {
  const accent = HOME_BRAND.blue;
  const ink    = HOME_BRAND.ink;

  return (
    <section id="diferenciais" style={{
      background: ink,
      color: '#fff',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 100px)',
    }}>

      {/* Textura diagonal sutil */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 72px)',
        pointerEvents: 'none',
      }} />

      {/* Linha de acento no topo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: 'clamp(56px, 7vh, 80px)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: accent, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            <span style={{ width: 32, height: 1, background: accent, display: 'block' }} />
            O que nos diferencia
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(38px, 4.4vw, 64px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Três motivos para{' '}
            <span style={{ color: accent }}>escolher a Berti.</span>
          </h2>
        </div>

        {/* Grid 3 colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'rgba(255,255,255,0.08)',
        }}>
          {DIFERENCIAIS_ITEMS.map((item, i) => (
            <DiferencialCard key={item.num} item={item} accent={accent} index={i} />
          ))}
        </div>

        {/* Faixa de stats */}
        <div style={{
          marginTop: 'clamp(48px,6vh,72px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}>
          {[
            { n: '17+',  k: 'Anos de experiência' },
            { n: '100%', k: 'Ligações parafusadas' },
            { n: 'BIM',  k: 'Engenharia digital' },
          ].map((s, i) => (
            <div key={s.k} style={{
              padding: 'clamp(24px,4vh,40px) clamp(20px,3vw,36px)',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800, fontSize: 'clamp(40px, 5vw, 60px)', lineHeight: 0.9,
                color: accent, letterSpacing: '-0.02em',
              }}>{s.n}</div>
              <div style={{
                fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', marginTop: 10, fontWeight: 600,
              }}>{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiferencialCard({ item, accent, index }) {
  const [hov, setHov] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: hov ? 'rgba(71,182,241,0.06)' : '#0c1a27',
        padding: 'clamp(36px,5vh,56px) clamp(28px,3.5vw,48px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        transition: 'background 0.25s ease',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Número de fundo */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: -16, bottom: -40,
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 900,
        fontSize: 'clamp(160px, 18vw, 240px)',
        lineHeight: 0.8,
        color: hov ? 'rgba(71,182,241,0.07)' : 'rgba(255,255,255,0.04)',
        letterSpacing: '-0.04em',
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'color 0.25s',
      }}>{item.num}</div>

      {/* Número pequeno + tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 800, fontSize: 14,
          color: accent, letterSpacing: '0.1em',
        }}>{item.num}</span>
        <span style={{
          width: 24, height: 1, background: 'rgba(255,255,255,0.2)', display: 'block',
        }} />
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>{item.tag}</span>
      </div>

      {/* Linha de acento */}
      <div style={{
        width: hov ? 64 : 40, height: 2,
        background: accent,
        transition: 'width 0.3s ease',
      }} />

      {/* Título */}
      <h3 style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(26px, 2.4vw, 36px)',
        lineHeight: 1.0,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        margin: 0,
        color: '#fff',
      }}>{item.title}</h3>

      {/* Corpo */}
      <p style={{
        fontSize: 'clamp(14px, 1.1vw, 16px)',
        lineHeight: 1.65,
        color: 'rgba(255,255,255,0.62)',
        margin: 0,
        position: 'relative', zIndex: 1,
      }}>{item.body}</p>
    </div>
  );
}

window.EmpresaDiferenciais = EmpresaDiferenciais;
