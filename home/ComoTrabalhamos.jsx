/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · COMO TRABALHAMOS — 5 etapas com hover: imagem sobe de baixo + link
// ============================================================================

const CT_STEPS = [
  {
    n:'01', tag:'Avaliação de Projeto', word:'Avaliação',
    title:'Avaliação & Recebimento',
    body:'O cliente encaminha a proposta e nossa equipe avalia se o projeto se enquadra nos padrões Berti para iniciar o orçamento.',
    note:'viabilidade + padrão de execução',
    img:'assets/process/cad-monitor.jpg',
    alt:'Projeto estrutural em AutoCAD',
    href:'Empresa.html#proc-0',
  },
  {
    n:'02', tag:'Orçamento', word:'Orçamento',
    title:'Estudo Técnico & Orçamento',
    body:'Apresentamos um modelo inicial em realidade virtual com os valores, materiais e soluções otimizadas para redução de custos.',
    note:'realidade virtual · materiais · custos',
    img:'assets/process/render-aerea.jpg',
    alt:'Render aéreo em realidade virtual',
    href:'Empresa.html#proc-1',
  },
  {
    n:'03', tag:'Concepção de Projeto', word:'BIM',
    title:'Cálculo & Modelagem BIM',
    body:'Softwares avançados de engenharia calculam e modelam em BIM cada peça — listas de fabricação geradas para encaixe perfeito.',
    note:'cálculo estrutural + modelagem BIM',
    img:'assets/process/bim-float.png',
    alt:'Modelo BIM estrutural',
    href:'Empresa.html#proc-2',
  },
  {
    n:'04', tag:'Fabricação', word:'Fabricação',
    title:'Fabricação nas Melhores Fábricas',
    body:'Enviamos as listas para as principais fábricas de aço do país — estrutura e cobertura com qualidade e rastreabilidade.',
    note:'fábricas certificadas · estrutura + cobertura',
    img:'assets/process/obra-aerea.jpg',
    alt:'Peças estruturais em obra',
    href:'Empresa.html#proc-3',
  },
  {
    n:'05', tag:'Montagem', word:'Montagem',
    title:'Montagem 100% Parafusada',
    body:'Peças montadas como um quebra-cabeça — processo 100% parafusado, sem solda em campo, com precisão e agilidade.',
    note:'sem solda · numerado · zero retrabalho',
    img:'assets/process/estrutura-telhado.jpg',
    alt:'Estrutura metálica montada',
    href:'Empresa.html#proc-4',
  },
];

function StepCard({ s, i, spanFull }) {
  const { useState, useEffect } = React;
  const [hov, setHov] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    if (!document.querySelector('link[data-caveat]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap';
      l.setAttribute('data-caveat','1');
      document.head.appendChild(l);
    }
  }, []);

  return (
    <a
      href={s.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:'relative',
        gridColumn: spanFull ? '1 / -1' : undefined,
        display:'flex', flexDirection:'column', alignItems:'center',
        textDecoration:'none', color:'inherit',
        cursor:'pointer',
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        transition:'transform 300ms cubic-bezier(.2,.8,.2,1)',
        zIndex: hov ? 10 : 1,
      }}
    >
      {/* Slide-up image — reveals from bottom (desktop only) */}
      {!isMobile && <div style={{
        position:'absolute',
        bottom:'calc(100% + 12px)',
        left:'50%',
        transform: hov ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(24px)',
        opacity: hov ? 1 : 0,
        transition:'opacity 260ms ease, transform 300ms cubic-bezier(.2,.8,.2,1)',
        pointerEvents:'none',
        width:220,
        zIndex:20,
      }}>
        {/* Polaroid frame */}
        <div style={{
          background: s.n==='03' ? '#0e1b24' : '#fff',
          padding:'10px 10px 12px',
          borderRadius:3,
          boxShadow:'0 20px 48px -14px rgba(16,33,44,.55), 0 2px 0 rgba(16,33,44,.04)',
          position:'relative',
        }}>
          {/* Tape */}
          <span style={{
            position:'absolute', top:-12, left:'50%',
            transform:'translateX(-50%) rotate(-2deg)',
            width:90, height:24,
            background:'rgba(71,182,241,.22)',
            borderLeft:'1px dashed rgba(7,127,191,.35)',
            borderRight:'1px dashed rgba(7,127,191,.35)',
            display:'block',
          }}/>
          <img
            src={s.img} alt={s.alt}
            style={{
              display:'block', width:'100%', height:130,
              objectFit: s.n==='03' ? 'contain' : 'cover',
              borderRadius:1,
            }}
          />
          <div style={{
            fontFamily:'Caveat, cursive',
            color: s.n==='03' ? '#47b6f1' : '#1853b8',
            fontWeight:700, fontSize:17, lineHeight:1.25,
            paddingTop:8, textAlign:'center',
          }}>
            {s.note}
          </div>
        </div>
        {/* Arrow pointing down */}
        <div style={{ textAlign:'center', marginTop:6 }}>
          <svg viewBox="0 0 16 10" style={{ width:16, height:10 }}>
            <path d="M1,1 L8,9 L15,1" fill="none" stroke="#1853b8" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
      </div>}

      {/* Circle number */}
      <div style={{
        width:76, height:76, borderRadius:'50%', flexShrink:0,
        border: `2px solid ${hov ? '#077fbf' : '#c6d4e2'}`,
        background: hov ? '#077fbf' : '#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Caveat, cursive', fontWeight:700,
        fontSize: hov ? 30 : 26,
        color: hov ? '#fff' : '#1853b8',
        transition:'all 280ms ease',
        boxShadow: hov ? '0 12px 28px -10px rgba(7,127,191,0.5)' : '0 4px 12px -6px rgba(16,33,44,0.12)',
        marginBottom:16, position:'relative',
      }}>
        {s.n}
        {/* Blueprint corner ticks */}
        {['tl','tr','bl','br'].map(p => {
          const ts = { position:'absolute', width:10, height:10, border:'1.5px solid #4f7fd6', opacity: hov ? 0 : 0.4, transition:'opacity 0.2s' };
          if (p==='tl') { ts.top=-2; ts.left=-2; ts.borderRight=0; ts.borderBottom=0; }
          else if (p==='tr') { ts.top=-2; ts.right=-2; ts.borderLeft=0; ts.borderBottom=0; }
          else if (p==='bl') { ts.bottom=-2; ts.left=-2; ts.borderRight=0; ts.borderTop=0; }
          else { ts.bottom=-2; ts.right=-2; ts.borderLeft=0; ts.borderTop=0; }
          return React.createElement('span', { key:p, style:ts });
        })}
      </div>

      {/* Teaser permanente — sinaliza interatividade antes do hover */}
      <div style={{
        display:'inline-flex', alignItems:'center', gap:4,
        fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700,
        textTransform:'uppercase', letterSpacing:'0.05em',
        fontSize:'clamp(12px,0.95vw,13.5px)', color:'#077fbf',
        borderBottom: hov ? '1px solid #077fbf' : '1px dashed rgba(7,127,191,0.5)',
        paddingBottom:2, marginBottom:9, transition:'border-color 0.2s',
      }}>
        {s.word || s.tag}
        <span style={{ fontSize:14, lineHeight:1 }} aria-hidden="true">›</span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800,
        textTransform:'uppercase', fontSize:'clamp(15px,1.3vw,19px)',
        lineHeight:1.05, color:'#10212c', textAlign:'center', marginBottom:10,
      }}>
        {s.title}
      </div>

      {/* Body — expands on hover */}
      <div style={{
        fontSize:'clamp(13.5px,0.95vw,15px)', lineHeight:1.55, color:'#4a606e',
        textAlign:'center', maxWidth:210,
        opacity: hov ? 1 : 0,
        maxHeight: hov ? 240 : 0,
        overflow:'hidden',
        transition:'opacity 0.25s ease, max-height 0.3s ease',
      }}>
        {s.body}
      </div>

      {/* "ver mais →" hint on hover */}
      <div style={{
        marginTop: hov ? 10 : 0,
        opacity: hov ? 1 : 0,
        maxHeight: hov ? 24 : 0,
        overflow:'hidden',
        transition:'opacity 0.25s ease, max-height 0.3s ease',
        fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700,
        fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase',
        color:'#077fbf',
      }}>
        ver etapa →
      </div>
    </a>
  );
}

function HomeComoTrabalhamos() {
  const isMobile = useMobile();
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
    <section style={{
      background:'transparent', ...gridBg,
      padding:'clamp(60px,8vh,100px) clamp(20px,5vw,84px) clamp(64px,9vh,110px)',
      fontFamily:'"Open Sans", system-ui, sans-serif', color:'#10212c',
      position:'relative', overflow:'visible',
    }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'clamp(56px,8vh,96px)', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontSize:'clamp(22px,2.4vw,34px)', fontWeight:700, lineHeight:1, display:'inline-block', transform:'rotate(-2deg)', marginBottom:14 }}>
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
        <p style={{ maxWidth:540, margin:'0 auto', fontSize:'clamp(15px,1.1vw,17px)', lineHeight:1.58, color:'#4a606e' }}>
          Cinco etapas, um único responsável — do recebimento do projeto à montagem parafusada em obra.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap: isMobile ? '20px' : 'clamp(12px,2vw,28px)', maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
        {/* Connector line */}
        <div style={{ position:'absolute', top:38, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg, transparent, #c6d4e2 20%, #c6d4e2 80%, transparent)', zIndex:0, pointerEvents:'none' }}/>

        {CT_STEPS.map((s, i) => <StepCard key={s.n} s={s} i={i} spanFull={isMobile && CT_STEPS.length % 2 === 1 && i === CT_STEPS.length - 1}/>)}
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', marginTop:'clamp(40px,6vh,64px)', position:'relative', zIndex:1 }}>
        <a href="Empresa.html#processo" style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', fontSize:14, color:'#077fbf', textDecoration:'none', borderBottom:'1.5px solid #077fbf', paddingBottom:2 }}>
          Ver processo completo &nbsp;→
        </a>
      </div>

      <style>{`
        @media(max-width:760px){
          .ct-grid{ grid-template-columns: repeat(3,1fr) !important; }
        }
        @media(max-width:480px){
          .ct-grid{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.HomeComoTrabalhamos = HomeComoTrabalhamos;
