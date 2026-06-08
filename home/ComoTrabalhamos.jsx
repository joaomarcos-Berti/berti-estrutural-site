/* global React, HOME_BRAND */
// ============================================================================
// HOME · COMO TRABALHAMOS — Tira horizontal compacta (engineer-notebook)
// 5 etapas em linha, fundo quadriculado, tipografia Barlow + Caveat
// Posição: abaixo do Hero da home
// ============================================================================

const CT_STEPS = [
  { n:'01', tag:'Análise',            icon:'📋', note:'viabilidade + padrão de execução' },
  { n:'02', tag:'Orçamento',          icon:'📐', note:'render · 360° · VR Meta Quest Pro' },
  { n:'03', tag:'Concepção',          icon:'🏗️', note:'cálculo estrutural + detalhamento' },
  { n:'04', tag:'Fabricação',         icon:'🔩', note:'qualidade + certificação de material' },
  { n:'05', tag:'Montagem',           icon:'⚡', note:'sem solda · numerado · zero retrabalho' },
];

const CT_TITLES = [
  'Recebemos & Analisamos',
  'Estudo Técnico & BIM 3D',
  'Cálculo & Modelagem Final',
  'Produção Rastreável',
  'Montagem 100% Parafusada',
];

const CT_BODIES = [
  'Análise de viabilidade estrutural e enquadramento no nosso padrão de execução.',
  'Modelagem BIM 3D com render, 360° e realidade virtual para apresentação ao cliente.',
  'Cálculos estruturais e modelagem final — cada peça detalhada para encaixe perfeito.',
  'Fabricação com controle total de qualidade, rastreabilidade e certificação de material.',
  'Montagem 100% parafusada, sem solda, com equipe especializada. Zero retrabalho.',
];

function HomeComoTrabalhamos() {
  const { useState, useEffect, useRef } = React;
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!document.querySelector('link[data-caveat]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap';
      l.setAttribute('data-caveat','1');
      document.head.appendChild(l);
    }
  }, []);

  const gridBg = {
    backgroundImage:[
      'linear-gradient(#d5e3f4 1px, transparent 1px)',
      'linear-gradient(90deg, #d5e3f4 1px, transparent 1px)',
      'linear-gradient(#eaf0f8 1px, transparent 1px)',
      'linear-gradient(90deg, #eaf0f8 1px, transparent 1px)',
    ].join(','),
    backgroundSize:'120px 120px, 120px 120px, 24px 24px, 24px 24px',
  };

  return (
    <section ref={sectionRef} style={{
      background:'#fbfcfe', ...gridBg,
      padding:'clamp(60px,8vh,100px) clamp(20px,5vw,84px)',
      fontFamily:'"Open Sans", system-ui, sans-serif',
      color:'#10212c',
      position:'relative', overflow:'hidden',
    }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'clamp(40px,6vh,72px)', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontSize:'clamp(22px,2.4vw,34px)', fontWeight:700, lineHeight:1, display:'inline-block', transform:'rotate(-2deg)', marginBottom:12 }}>
          do projeto à obra entregue
        </div>
        <h2 style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, textTransform:'uppercase', fontSize:'clamp(36px,4.5vw,60px)', lineHeight:0.98, margin:'0 0 16px', color:'#10212c', letterSpacing:'-0.01em' }}>
          Como{' '}
          <span style={{ position:'relative', color:'#077fbf' }}>
            trabalhamos
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" style={{ position:'absolute', left:'-2%', bottom:'0.02em', width:'104%', height:'0.32em', overflow:'visible' }}>
              <path d="M3,15 C70,4 150,22 220,9 C255,3 285,11 297,8" fill="none" stroke="#47b6f1" strokeWidth="5" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>
        <p style={{ maxWidth:560, margin:'0 auto', fontSize:'clamp(15px,1.1vw,17px)', lineHeight:1.58, color:'#4a606e' }}>
          Cinco etapas, um único responsável — do recebimento do projeto à montagem parafusada em obra.
        </p>
      </div>

      {/* Steps grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'clamp(12px,2vw,28px)', maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
        {/* Connector line */}
        <div style={{ position:'absolute', top:38, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg, transparent, #c6d4e2 20%, #c6d4e2 80%, transparent)', zIndex:0, pointerEvents:'none' }}/>

        {CT_STEPS.map((s, i) => (
          <div key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              position:'relative', zIndex:1,
              display:'flex', flexDirection:'column', alignItems:'center',
              cursor:'default',
              transition:'transform 280ms cubic-bezier(.2,.8,.2,1)',
              transform: active === i ? 'translateY(-8px)' : 'translateY(0)',
            }}
          >
            {/* Circle number */}
            <div style={{
              width:76, height:76, borderRadius:'50%', flexShrink:0,
              border: active===i ? '2px solid #077fbf' : '2px solid #c6d4e2',
              background: active===i ? '#077fbf' : '#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Caveat, cursive', fontWeight:700,
              fontSize: active===i ? 32 : 28,
              color: active===i ? '#fff' : '#1853b8',
              transition:'all 280ms ease',
              boxShadow: active===i ? '0 12px 28px -10px rgba(7,127,191,0.45)' : '0 4px 12px -6px rgba(16,33,44,0.12)',
              marginBottom:16,
              position:'relative',
            }}>
              {s.n}
              {/* Blueprint ticks */}
              {['tl','tr','bl','br'].map(p => {
                const ts = { position:'absolute', width:10, height:10, border:'1.5px solid #4f7fd6', opacity: active===i ? 0 : 0.4, transition:'opacity 0.2s' };
                if (p==='tl') { ts.top=-2; ts.left=-2; ts.borderRight=0; ts.borderBottom=0; }
                else if (p==='tr') { ts.top=-2; ts.right=-2; ts.borderLeft=0; ts.borderBottom=0; }
                else if (p==='bl') { ts.bottom=-2; ts.left=-2; ts.borderRight=0; ts.borderTop=0; }
                else { ts.bottom=-2; ts.right=-2; ts.borderLeft=0; ts.borderTop=0; }
                return React.createElement('span', { key:p, style:ts });
              })}
            </div>

            {/* Tag */}
            <div style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', fontSize:'clamp(11px,0.9vw,13px)', color: active===i ? '#077fbf' : '#9fb0c0', transition:'color 0.2s', marginBottom:8 }}>
              {s.tag}
            </div>

            {/* Title */}
            <div style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, textTransform:'uppercase', fontSize:'clamp(15px,1.3vw,19px)', lineHeight:1.05, color:'#10212c', textAlign:'center', marginBottom:10 }}>
              {CT_TITLES[i]}
            </div>

            {/* Body — visible on hover */}
            <div style={{
              fontSize:'clamp(13px,0.95vw,15px)', lineHeight:1.55, color:'#4a606e',
              textAlign:'center', maxWidth:180,
              opacity: active===i ? 1 : 0,
              maxHeight: active===i ? 80 : 0,
              overflow:'hidden',
              transition:'opacity 0.25s ease, max-height 0.3s ease',
            }}>
              {CT_BODIES[i]}
            </div>

            {/* Handwritten note */}
            {active === i && (
              <div style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontWeight:600, fontSize:'clamp(13px,1vw,16px)', marginTop:8, textAlign:'center', lineHeight:1.2 }}>
                {s.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', marginTop:'clamp(40px,6vh,64px)', position:'relative', zIndex:1 }}>
        <a href="Empresa.html#processo" style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', fontSize:14, color:'#077fbf', textDecoration:'none', borderBottom:'1.5px solid #077fbf', paddingBottom:2 }}>
          Ver processo completo &nbsp;→
        </a>
      </div>

      <style>{`
        @media(max-width:760px){
          .ct-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media(max-width:480px){
          .ct-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.HomeComoTrabalhamos = HomeComoTrabalhamos;
