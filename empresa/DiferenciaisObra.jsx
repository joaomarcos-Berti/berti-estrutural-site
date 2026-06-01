/* global React, HOME_BRAND */
// ============================================================================
// EMPRESA · DIFERENCIAIS PARA SUA OBRA
// Bloco "RENTABILIDADE, DINAMISMO, SEGURANÇA E SUSTENTABILIDADE".
// Layout zigue-zague: foto e texto alternam de lado a cada linha, ligados por
// uma "espinha" vertical com nós numerados — quebra a monotonia das 3 colunas.
// Molduras com cantos chanfrados ecoam o recorte de aço das peças metálicas.
// ============================================================================

const OBRA_ITEMS = [
  {
    num: '01',
    kicker: 'Time multidisciplinar',
    title: 'Corpo Técnico',
    img: 'empresa/img/corpo-tecnico.jpg',
    body: 'Engenheiros e arquitetos com ampla experiência em todas as etapas do processo — do projeto à fabricação e montagem das estruturas metálicas.',
    body2: 'Uma equipe de alta performance que desenvolve projetos sob medida, com visão global da obra e capacidade de antecipar as necessidades de cada cliente.',
  },
  {
    num: '02',
    kicker: 'Industrialização & CNC',
    title: 'Sistemas Industrializados',
    img: 'empresa/img/sistemas.jpg',
    body: 'Estruturas 100% parafusadas, sem soldas em obra ou fábrica, desenvolvidas com materiais nobres e técnicas que minimizam desperdícios e maximizam eficiência.',
    body2: 'Produção automatizada com programação CNC, assegurando precisão, agilidade, qualidade e rastreabilidade de cada peça.',
  },
  {
    num: '03',
    kicker: 'Normas & certificação',
    title: 'Segurança e Garantia',
    img: 'empresa/img/seguranca.jpg',
    body: 'Obras dimensionadas conforme as normas brasileiras, por engenheiros calculistas experientes. Todos os componentes são certificados por usinas e fornecedores, com rastreabilidade total das peças.',
    body2: 'Empregamos aço galvanizado de alta resistência (ZAR 345) — sem retoques em obra e sem necessidade de manutenção periódica de pintura.',
  },
];

function EmpresaDiferenciaisObra() {
  const accent = HOME_BRAND.blue;

  return (
    <section id="diferenciais-obra" style={{
      background: HOME_BRAND.ink,
      color: '#fff',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Faixa-título estilo banner sobre aço escuro */}
      <div style={{
        position: 'relative',
        padding: '88px clamp(40px, 8vw, 140px) 80px',
        background: 'linear-gradient(120deg, #060d14 0%, #0e2435 55%, #143047 100%)',
        borderBottom: `3px solid ${accent}`,
        overflow: 'hidden',
      }}>
        {/* Diagonais de aço decorativas */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 60px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 1100 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: accent, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            <span style={{ width: 30, height: 1, background: accent }} />
            Diferenciais
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800, fontSize: 'clamp(34px, 4.4vw, 62px)', lineHeight: 0.98,
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            margin: 0, textWrap: 'balance',
          }}>
            Rentabilidade, dinamismo, segurança e
            sustentabilidade <span style={{ color: accent }}>para sua obra.</span>
          </h2>
        </div>
      </div>

      {/* Linhas zigue-zague */}
      <div style={{
        position: 'relative',
        padding: 'clamp(64px, 7vw, 110px) clamp(40px, 8vw, 140px) clamp(72px, 8vw, 120px)',
        maxWidth: 1340, margin: '0 auto',
      }}>
        {/* Espinha vertical central (desktop) */}
        <div aria-hidden="true" className="obra-spine" style={{
          position: 'absolute', top: 40, bottom: 40, left: '50%',
          width: 1, background: 'rgba(255,255,255,0.14)',
          transform: 'translateX(-50%)',
        }} />

        {OBRA_ITEMS.map((it, i) => (
          <ObraRow key={it.num} item={it} flip={i % 2 === 1} accent={accent} last={i === OBRA_ITEMS.length - 1} />
        ))}
      </div>

      <style>{`
        .obra-row {
          display: grid;
          grid-template-columns: 1fr 96px 1fr;
          align-items: center;
          gap: 0;
          margin-bottom: clamp(64px, 7vw, 104px);
        }
        .obra-row:last-child { margin-bottom: 0; }
        .obra-figure { position: relative; }
        .obra-photo {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%);
          filter: saturate(1.02) contrast(1.02);
        }
        .obra-node {
          justify-self: center;
          width: 64px; height: 64px;
          border-radius: 50%;
          background: ${accent};
          color: #061018;
          display: flex; align-items: center; justify-content: center;
          font-family: "Barlow Condensed", sans-serif;
          font-weight: 800; font-size: 26px;
          box-shadow: 0 0 0 8px rgba(71,182,241,0.12);
          z-index: 2;
        }
        @media (max-width: 880px) {
          .obra-spine { display: none; }
          .obra-row { grid-template-columns: 1fr; gap: 24px; }
          .obra-row .obra-figure { order: 0 !important; }
          .obra-row .obra-copy   { order: 1 !important; }
          .obra-node { display: none; }
        }
      `}</style>
    </section>
  );
}

function ObraRow({ item, flip, accent }) {
  const figure = (
    <figure className="obra-figure" style={{
      order: flip ? 2 : 0, margin: 0,
      gridColumn: flip ? 3 : 1,
    }}>
      {/* Moldura chanfrada de fundo (offset) */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        transform: flip ? 'translate(14px, 14px)' : 'translate(-14px, 14px)',
        border: `1px solid ${accent}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)',
        opacity: 0.5,
      }} />
      <img className="obra-photo" src={item.img} alt={item.title} loading="lazy" />
      {/* Etiqueta kicker sobre a foto */}
      <figcaption style={{
        position: 'absolute', top: 18, left: flip ? 'auto' : 18, right: flip ? 18 : 'auto',
        background: 'rgba(6,16,24,0.82)',
        backdropFilter: 'blur(4px)',
        color: accent,
        fontFamily: '"Barlow Condensed", sans-serif',
        fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '7px 13px',
      }}>{item.kicker}</figcaption>
    </figure>
  );

  const node = (
    <div className="obra-node" style={{ gridColumn: 2 }}>{item.num}</div>
  );

  const copy = (
    <div className="obra-copy" style={{
      order: flip ? 0 : 2,
      gridColumn: flip ? 1 : 3,
      padding: flip ? '0 60px 0 0' : '0 0 0 60px',
      textAlign: flip ? 'right' : 'left',
    }}>
      <h3 style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 800, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1,
        letterSpacing: '-0.01em', textTransform: 'uppercase',
        margin: '0 0 18px',
      }}>{item.title}</h3>
      <div style={{
        width: 56, height: 3, background: accent,
        marginLeft: flip ? 'auto' : 0, marginBottom: 20,
      }} />
      <p style={{
        fontSize: 16, lineHeight: 1.62, color: 'rgba(255,255,255,0.74)',
        margin: '0 0 14px', textWrap: 'pretty',
      }}>{item.body}</p>
      <p style={{
        fontSize: 16, lineHeight: 1.62, color: 'rgba(255,255,255,0.74)',
        margin: 0, textWrap: 'pretty',
      }}>{item.body2}</p>
    </div>
  );

  return (
    <div className="obra-row">
      {flip ? copy : figure}
      {node}
      {flip ? figure : copy}
    </div>
  );
}

window.EmpresaDiferenciaisObra = EmpresaDiferenciaisObra;
