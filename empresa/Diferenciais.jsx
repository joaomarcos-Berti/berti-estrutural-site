/* global React, HOME_BRAND, HOME_PHOTO */
// ============================================================================
// EMPRESA · DIFERENCIAIS
// Layout editorial assimétrico — 1 card grande (Qualidade) + 2 menores
// empilhados (Tecnologia, Para sua Obra). Quebra a monotonia de "3 colunas
// iguais" do site original, mas mantém a mesma hierarquia de leitura.
// ============================================================================

const DIFERENCIAIS_ITEMS = [
  {
    num: '01',
    title: 'Qualidade e Resistência',
    body: 'Obras projetadas com ligações 100% parafusadas, produtos certificados, alta resistência e proteção galvanizada ou pintura de alta qualidade.',
    tag: 'Engenharia certificada',
    icon: 'quality',
  },
  {
    num: '02',
    title: 'Soluções Tecnológicas',
    body: 'Tecnologia aplicada em cada obra para melhor aproveitamento dos recursos, com logística integrada e redução significativa de prazos e custos.',
    tag: 'BIM · VR · CNC',
    icon: 'tech',
  },
  {
    num: '03',
    title: 'Para Sua Obra',
    body: 'Trazemos rentabilidade, dinamismo, segurança, sustentabilidade e rigor no cumprimento dos cronogramas para sua obra.',
    tag: 'Compromisso integral',
    icon: 'badge',
  },
];

function EmpresaDiferenciais() {
  const accent = HOME_BRAND.blue;

  return (
    <section id="diferenciais" style={{
      background: HOME_BRAND.ink,
      color: '#fff',
      padding: '120px clamp(64px, 8vw, 140px) 110px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Textura sutil de aço (diagonais) no fundo */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 64px)',
        pointerEvents: 'none',
      }} />

      {/* Cabeçalho */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64,
        alignItems: 'end', marginBottom: 64, position: 'relative', zIndex: 1,
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: accent, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            <span style={{ width: 28, height: 1, background: accent }} />
            O que nos diferencia
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800, fontSize: 'clamp(38px, 4.2vw, 60px)', lineHeight: 0.95,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            margin: 0,
          }}>
            Três motivos para<br/>
            <span style={{ color: accent }}>escolher a Berti.</span>
          </h2>
        </div>
        <p style={{
          fontSize: 17, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.62)',
          maxWidth: 540, justifySelf: 'end', margin: 0,
        }}>
          Não vendemos só estrutura — entregamos previsibilidade. Cada um destes
          pilares atravessa todas as etapas do nosso processo, do primeiro
          desenho à última peça parafusada na obra.
        </p>
      </div>

      {/* Grid assimétrico · 1 grande + 2 empilhados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: 20,
        position: 'relative', zIndex: 1,
      }}>
        {/* Card grande à esquerda · ocupa 2 linhas */}
        <DiferencialCard
          item={DIFERENCIAIS_ITEMS[0]}
          variant="large"
          accent={accent}
          style={{ gridRow: '1 / span 2' }}
        />

        {/* Cards menores empilhados à direita */}
        <DiferencialCard item={DIFERENCIAIS_ITEMS[1]} variant="solid" accent={accent} />
        <DiferencialCard item={DIFERENCIAIS_ITEMS[2]} variant="outline" accent={accent} />
      </div>

      {/* Faixa de stats inferior — reforça a credibilidade */}
      <div style={{
        marginTop: 60,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        borderTop: '1px solid rgba(255,255,255,0.12)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        position: 'relative', zIndex: 1,
      }}>
        {[
          { n: '17+',  k: 'Anos de experiência' },
          { n: '100%', k: 'Ligações parafusadas' },
          { n: 'BIM',  k: 'Engenharia digital' },
        ].map((s, i) => (
          <div key={s.k} style={{
            padding: '34px 28px',
            borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800, fontSize: 56, lineHeight: 0.9,
              color: accent, letterSpacing: '-0.02em',
            }}>{s.n}</div>
            <div style={{
              fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)', marginTop: 10, fontWeight: 600,
            }}>{s.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Card de diferencial — 3 variantes visuais para criar ritmo
// ============================================================================
function DiferencialCard({ item, variant, accent, style }) {
  const isLarge   = variant === 'large';
  const isSolid   = variant === 'solid';
  const isOutline = variant === 'outline';

  const bg =
    isLarge   ? '#0a1620' :
    isSolid   ? accent     :
                'transparent';
  const fg =
    isSolid ? '#0a1620' : '#fff';
  const bodyColor =
    isSolid ? 'rgba(10,22,32,0.78)' : 'rgba(255,255,255,0.72)';
  const tagColor =
    isSolid ? 'rgba(10,22,32,0.65)' : accent;
  const numColor =
    isSolid ? 'rgba(10,22,32,0.18)' :
    isLarge ? 'rgba(71,182,241,0.10)' :
              'rgba(255,255,255,0.06)';

  return (
    <article style={{
      position: 'relative',
      background: bg,
      color: fg,
      padding: isLarge ? '48px 48px 44px' : '36px 38px 34px',
      border: isOutline ? '1px solid rgba(255,255,255,0.16)' : 'none',
      minHeight: isLarge ? 540 : 240,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'transform 320ms ease, background 240ms ease',
      cursor: 'default',
      ...style,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        if (isOutline) e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (isOutline) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Número gigante de fundo */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: isLarge ? -10 : -8,
        bottom: isLarge ? -40 : -32,
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 900,
        fontSize: isLarge ? 360 : 200,
        lineHeight: 0.8,
        color: numColor,
        letterSpacing: '-0.04em',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>{item.num}</div>

      {/* Topo: tag + ícone */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 24, marginBottom: isLarge ? 'auto' : 18,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: tagColor,
          paddingTop: 8,
        }}>{item.tag}</div>

        <div style={{
          width: isLarge ? 104 : 78,
          height: isLarge ? 104 : 78,
          background: isSolid ? 'rgba(10,22,32,0.08)' : 'rgba(71,182,241,0.10)',
          border: isSolid ? '1px solid rgba(10,22,32,0.18)' : `1px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <DiferencialIcon kind={item.icon} color={isSolid ? '#0a1620' : '#fff'} size={isLarge ? 56 : 42} />
        </div>
      </div>

      {/* Espaçador para empurrar título no card grande */}
      {isLarge && <div style={{ flex: 1, minHeight: 80 }} />}

      {/* Título + corpo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 800,
          fontSize: isLarge ? 'clamp(36px, 3.4vw, 48px)' : 26,
          lineHeight: 0.98,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
          color: fg,
          textWrap: 'balance',
        }}>{item.title}</h3>

        <p style={{
          fontSize: isLarge ? 16.5 : 14.5,
          lineHeight: 1.6,
          color: bodyColor,
          margin: 0,
          maxWidth: isLarge ? 460 : 'none',
          textWrap: 'pretty',
        }}>{item.body}</p>

        {/* Régua decorativa */}
        <div style={{
          width: isLarge ? 80 : 48, height: 2,
          background: isSolid ? '#0a1620' : accent,
          marginTop: isLarge ? 28 : 18,
        }} />
      </div>
    </article>
  );
}

// ============================================================================
// Ícones · espelham o set fornecido pelo cliente
// ============================================================================
function DiferencialIcon({ kind, color = '#fff', size = 48 }) {
  if (kind === 'quality') return (
    // Certificado/documento com selo e fita — estilo bold preenchido
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} xmlns="http://www.w3.org/2000/svg">
      {/* Documento */}
      <path d="M16 8h26a2 2 0 0 1 2 2v36l-7-4-7 4V10a2 2 0 0 1 2-2z" opacity="0" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20 6h22a3 3 0 0 1 3 3v30a4 4 0 0 0 4 4h-4V12H24v-2h-4V6zm-4 4h20a3 3 0 0 1 3 3v36.5l-6.5-4-6.5 4V52H16a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3zm5 9h12v3H21v-3zm0 8h12v3H21v-3zm0 8h8v3h-8v-3z" />
      {/* Selo com fita */}
      <circle cx="44" cy="46" r="9" />
      <path d="M38 53l-3 9 5-3 4 3 1-7" fill={color} />
    </svg>
  );
  if (kind === 'tech') return (
    // Engrenagem com circuito/nós — estilo bold preenchido
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M28 8h4v4.3a16 16 0 0 1 4.6 1.9l3-3 2.8 2.8-3 3a16 16 0 0 1 1.9 4.6H46v4h-4.3a16 16 0 0 1-1.9 4.6l3 3-2.8 2.8-3-3a16 16 0 0 1-4.6 1.9V40h-4v-4.3a16 16 0 0 1-4.6-1.9l-3 3L18 34l3-3a16 16 0 0 1-1.9-4.6H15v-4h4.1a16 16 0 0 1 1.9-4.6l-3-3L20.8 12l3 3a16 16 0 0 1 4.2-1.8V8zm2 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      {/* Trilhas de circuito */}
      <circle cx="48" cy="46" r="3" />
      <circle cx="54" cy="38" r="2.4" />
      <circle cx="52" cy="54" r="2.4" />
      <path d="M40 44h6v3h-6zM48 43v-3h3.5v3zM48 49v3h3v-3z" />
    </svg>
  );
  if (kind === 'badge') return (
    // Selo serrilhado com check — estilo bold preenchido
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6l5.2 3.6 6.3-.6 2.4 5.9 5.9 2.4-.6 6.3L54.2 36l-3.6 5.2.6 6.3-5.9 2.4-2.4 5.9-6.3-.6L32 58l-5.2-3.6-6.3.6-2.4-5.9-5.9-2.4.6-6.3L9.8 36l3.6-5.2-.6-6.3 5.9-2.4 2.4-5.9 6.3.6L32 6z" />
      <path d="M27.5 38.5l-5.5-5.5 2.8-2.8 2.7 2.7 8.4-8.4 2.8 2.8-11.2 11.2z" fill={color === '#fff' ? '#0a1620' : '#fff'} />
    </svg>
  );
  return null;
}

window.EmpresaDiferenciais = EmpresaDiferenciais;
