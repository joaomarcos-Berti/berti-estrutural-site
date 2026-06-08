/* global React, HOME_BRAND, useMobile */
// ============================================================================
// EMPRESA · COMO TRABALHAMOS — Painéis alternados "engineer notebook"
// 5 etapas, foto polaroid + texto com ghost number, fonte Caveat manuscrita
// ============================================================================
const { useState, useEffect, useRef } = React;

const PROC_STEPS = [
  {
    n: '01', tag: 'Avaliação de Projeto', kind: 'render',
    title: 'Avaliação &amp; Recebimento',
    body: 'O cliente encaminha a proposta projetual e nossa equipe de engenheiros avalia se o projeto se enquadra nos padrões executados pela Berti — para dar início ao <b>estudo orçamentário</b> com segurança.',
    note: 'viabilidade + padrão de execução',
    cap: 'projeto recebido', meta: 'Avaliação técnica',
    mode: 'frame',
    img: 'assets/process/cad-monitor.jpg', alt: 'Projeto estrutural em AutoCAD',
  },
  {
    n: '02', tag: 'Orçamento', kind: 'render',
    title: 'Estudo Técnico &amp; Orçamento',
    body: 'A partir de um estudo técnico detalhado, apresentamos ao cliente um <b>modelo inicial em realidade virtual</b> — com os valores, materiais e soluções otimizadas para a <b>redução de custos</b> do projeto.',
    note: 'realidade virtual · materiais · custos',
    cap: 'cliente vê antes de existir', meta: 'Render · VR · 360°',
    mode: 'gallery',
    imgs: [
      { src: 'assets/process/render-aerea.jpg',    alt: 'Render aéreo do galpão' },
      { src: 'assets/process/render-interior.jpg', alt: 'Render interno do galpão' },
      { src: 'assets/process/render-exterior.jpg', alt: 'Render externo do galpão' },
    ],
  },
  {
    n: '03', tag: 'Concepção de Projeto', kind: 'bim',
    title: 'Cálculo &amp; Modelagem BIM',
    body: 'Nossa equipe técnica analisa minuciosamente o projeto com <b>softwares de engenharia avançados</b>. Após aprovação, inicia-se a <b>modelagem BIM final</b> — cada peça elaborada e suas listas de fabricação preparadas para encaixe perfeito.',
    note: 'cálculo estrutural + modelagem BIM',
    cap: 'cada peça calculada', meta: 'Modelo BIM / IFC',
    mode: 'float',
    img: 'assets/process/bim-float.png', alt: 'Modelo estrutural BIM completo',
  },
  {
    n: '04', tag: 'Fabricação', kind: 'render',
    title: 'Fabricação nas Melhores Fábricas',
    body: 'Encaminhamos as listas para as <b>principais fábricas de aço do país</b> — estrutura e cobertura (telhas incluídas). Garantia de qualidade dos materiais em cada etapa, com <b>durabilidade e alto desempenho</b>.',
    note: 'fábricas certificadas · estrutura + cobertura',
    cap: 'peças prontas para a obra', meta: 'Produção e logística',
    mode: 'contain',
    img: 'assets/process/obra-aerea.jpg', alt: 'Peças estruturais entregues na obra',
  },
  {
    n: '05', tag: 'Montagem', kind: 'render',
    title: 'Montagem 100% Parafusada',
    body: 'As peças chegam ao local da obra e são montadas como um <b>quebra-cabeça</b> — processo 100% parafusado, sem solda em campo. Isso <b>simplifica e agiliza</b> a construção, garantindo precisão e eficiência.',
    note: 'sem solda · numerado · zero retrabalho',
    cap: 'estrutura montada em obra', meta: 'Montagem em obra',
    mode: 'frame',
    img: 'assets/process/estrutura-telhado.jpg', alt: 'Estrutura metálica montada em obra',
  },
];

function CircleScribble() {
  return React.createElement('svg', { viewBox:'0 0 54 54', style:{ position:'absolute', inset:-4, width:'calc(100% + 8px)', height:'calc(100% + 8px)', overflow:'visible' } },
    React.createElement('path', { d:'M40,7 C20,2 6,14 7,28 C8,44 30,52 44,44 C56,37 53,15 36,8', fill:'none', stroke:'#1853b8', strokeWidth:2, opacity:0.55 })
  );
}

function Tick({ pos }) {
  const s = { position:'absolute', width:18, height:18, border:'2px solid #4f7fd6', opacity:0.5 };
  if (pos==='tl') { s.top=-2; s.left=-2; s.borderRight=0; s.borderBottom=0; }
  else if (pos==='tr') { s.top=-2; s.right=-2; s.borderLeft=0; s.borderBottom=0; }
  else if (pos==='bl') { s.bottom=-2; s.left=-2; s.borderRight=0; s.borderTop=0; }
  else { s.bottom=-2; s.right=-2; s.borderLeft=0; s.borderTop=0; }
  return React.createElement('span', { style: s });
}

function PhotoMedia({ s }) {
  const isBim = s.kind === 'bim';
  const tapeStyle = {
    position:'absolute', top:-14, left:'50%', transform:'translateX(-50%) rotate(-2.5deg)',
    width:118, height:30,
    background:'rgba(71,182,241,.22)',
    borderLeft:'1px dashed rgba(7,127,191,.35)',
    borderRight:'1px dashed rgba(7,127,191,.35)',
    boxShadow:'0 1px 2px rgba(16,33,44,.06)',
  };
  const frameStyle = {
    position:'relative', background: isBim ? '#0e1b24' : '#fff',
    padding:'14px 14px 16px', borderRadius:3,
    boxShadow:'0 18px 44px -18px rgba(16,33,44,.45), 0 2px 0 rgba(16,33,44,.04)',
  };

  if (s.mode === 'gallery') {
    return (
      <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {s.imgs.map((im, k) => (
          <div key={k} style={{
            ...frameStyle, padding:'9px 9px 11px',
            ...(k===0 ? { gridColumn:'1 / -1' } : {}),
            ...(k===1 ? { transform:'rotate(-1.4deg)' } : k===2 ? { transform:'rotate(1.6deg)' } : {}),
          }}>
            <span style={tapeStyle}/>
            <Tick pos="tl"/><Tick pos="tr"/><Tick pos="bl"/><Tick pos="br"/>
            <img src={im.src} alt={im.alt} style={{ display:'block', width:'100%', height: k===0 ? 'min(25vh,240px)' : 'min(21vh,200px)', objectFit:'cover', borderRadius:1 }}/>
          </div>
        ))}
        <div style={{ gridColumn:'1 / -1', fontFamily:'Caveat, cursive', color:'#1853b8', fontWeight:600, fontSize:22, lineHeight:1 }}>
          {s.cap}{' '}<em style={{ fontFamily:'"Barlow Condensed",sans-serif', fontStyle:'normal', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9fb0c0', marginLeft:8 }}>{s.meta}</em>
        </div>
      </div>
    );
  }
  if (s.mode === 'float') {
    return (
      <figure style={{ margin:0 }}>
        <img src={s.img} alt={s.alt} style={{ width:'100%', height:'auto', display:'block', filter:'drop-shadow(0 24px 30px rgba(16,33,44,.22))' }}/>
        <figcaption style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontWeight:600, fontSize:22, lineHeight:1, marginTop:14, textAlign:'center' }}>
          {s.cap}{' '}<em style={{ fontFamily:'"Barlow Condensed",sans-serif', fontStyle:'normal', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9fb0c0', marginLeft:8 }}>{s.meta}</em>
        </figcaption>
      </figure>
    );
  }
  return (
    <div style={frameStyle}>
      <span style={tapeStyle}/>
      <Tick pos="tl"/><Tick pos="tr"/><Tick pos="bl"/><Tick pos="br"/>
      <img src={s.img} alt={s.alt} style={{
        display:'block', width:'100%',
        height: s.mode==='contain' ? 'auto' : 'min(60vh,520px)',
        maxHeight: s.mode==='contain' ? 'min(60vh,480px)' : undefined,
        objectFit: s.mode==='contain' ? 'contain' : 'cover',
        borderRadius:1,
      }}/>
      <div style={{ fontFamily:'Caveat, cursive', color: isBim ? '#47b6f1' : '#1853b8', fontWeight:600, fontSize:22, lineHeight:1, paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12 }}>
        {s.cap}
        <span style={{ fontFamily:'"Barlow Condensed",sans-serif', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9fb0c0', fontWeight:600 }}>{s.meta}</span>
      </div>
    </div>
  );
}

function ProcessPanel({ s, index }) {
  const photoRef = useRef(null);
  const textRef  = useRef(null);
  const isLeft   = index % 2 === 1;
  const isMobile = useMobile();

  useEffect(() => {
    function upd() {
      if (window.innerWidth <= 880) return;
      const ph = photoRef.current; const tx = textRef.current;
      if (!ph || !tx) return;
      const vh = window.innerHeight;
      const r  = ph.getBoundingClientRect();
      const n  = Math.min(1.2, Math.max(-1.2, (r.top + r.height/2 - vh/2) / (vh*0.9)));
      const sd = isLeft ? -1 : 1;
      ph.style.transform = 'translateX(' + (n*38*sd) + '%)';
      ph.style.opacity   = String(1 - Math.min(1, Math.abs(n))*0.55);
      tx.style.transform = 'translateY(' + (n*20) + 'px)';
      tx.style.opacity   = String(1 - Math.min(1, Math.abs(n))*0.6);
    }
    window.addEventListener('scroll', upd, { passive:true });
    window.addEventListener('resize', upd);
    upd();
    return () => { window.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); };
  }, [isLeft]);

  return (
    <section id={'proc-' + index} style={{ position:'relative', minHeight: isMobile ? '0' : '74vh', display:'flex', alignItems:'center', overflow:'hidden', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:1320, margin:'0 auto', padding:'3.5vh clamp(24px,5vw,84px)', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 'clamp(24px,3vw,48px)' : 'clamp(36px,5vw,84px)', alignItems:'center' }}>

        {/* TEXT */}
        <div ref={textRef} style={{ position:'relative', display:'flex', flexDirection:'column', gap:18, willChange:'transform,opacity', order: isMobile ? 1 : (isLeft ? 2 : 1) }}>
          <span style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, color:'transparent', WebkitTextStroke:'2px rgba(24,83,184,0.16)', letterSpacing:'-0.02em', lineHeight:0.8, userSelect:'none', fontSize:'clamp(120px,15vw,230px)', position:'absolute', top:'-0.42em', left:'-0.06em', zIndex:-1 }}>{s.n}</span>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:46, height:46, flexShrink:0, display:'grid', placeItems:'center', fontFamily:'Caveat, cursive', fontWeight:700, fontSize:26, color:'#1853b8', position:'relative' }}>
              {s.n}<CircleScribble/>
            </div>
            <span style={{ fontFamily:'"Barlow Condensed",sans-serif', textTransform:'uppercase', letterSpacing:'0.16em', fontWeight:700, fontSize:'clamp(13px,1.05vw,16px)', color:'#077fbf' }}>{s.tag}</span>
          </div>
          <h2 dangerouslySetInnerHTML={{ __html: s.title }} style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, textTransform:'uppercase', letterSpacing:'-0.005em', lineHeight:0.98, color:'#10212c', fontSize:'clamp(34px,4.4vw,64px)', margin:0 }}/>
          <svg viewBox="0 0 160 16" style={{ height:16, width:160, overflow:'visible', opacity:0.6 }}>
            <path d="M2,8 H158 M2,3 V13 M158,3 V13" fill="none" stroke="#1853b8" strokeWidth="1.4" opacity="0.55"/>
          </svg>
          <p dangerouslySetInnerHTML={{ __html: s.body }} style={{ fontSize:'clamp(16px,1.18vw,19px)', lineHeight:1.62, color:'#4a606e', maxWidth:'46ch', margin:0 }}/>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:'Caveat, cursive', color:'#1853b8', fontWeight:600, fontSize:'clamp(20px,2vw,28px)', lineHeight:1 }}>
            <svg viewBox="0 0 34 18" style={{ width:34, height:18, overflow:'visible', flexShrink:0 }}>
              <path d="M2,9 H28" fill="none" stroke="#1853b8" strokeWidth="1.4" opacity="0.55"/>
              <path d="M22,3 L30,9 L22,15" fill="none" stroke="#1853b8" strokeWidth="1.4" opacity="0.55"/>
            </svg>
            {s.note}
          </div>
        </div>

        {/* PHOTO */}
        <div ref={photoRef} style={{ willChange:'transform,opacity', order: isMobile ? 2 : (isLeft ? 1 : 2) }}>
          <PhotoMedia s={s}/>
        </div>
      </div>
    </section>
  );
}

function EmpresaProcesso() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!document.querySelector('link[data-caveat]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap';
      l.setAttribute('data-caveat','1');
      document.head.appendChild(l);
    }
    function upd() {
      const vc = window.innerHeight / 2;
      let bi = 0, bd = Infinity;
      PROC_STEPS.forEach((_,i) => {
        const el = document.getElementById('proc-'+i);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height/2 - vc);
        if (d < bd) { bd = d; bi = i; }
      });
      setActive(bi);
    }
    window.addEventListener('scroll', upd, { passive:true });
    return () => window.removeEventListener('scroll', upd);
  }, []);

  const gridBg = {
    background:'#fbfcfe',
    backgroundImage:[
      'linear-gradient(#d5e3f4 1px, transparent 1px)',
      'linear-gradient(90deg, #d5e3f4 1px, transparent 1px)',
      'linear-gradient(#eaf0f8 1px, transparent 1px)',
      'linear-gradient(90deg, #eaf0f8 1px, transparent 1px)',
    ].join(','),
    backgroundSize:'120px 120px, 120px 120px, 24px 24px, 24px 24px',
    fontFamily:'"Open Sans", system-ui, sans-serif',
    color:'#10212c',
    position:'relative',
  };

  return (
    <div style={gridBg}>
      {/* Engineering margin line */}
      <div style={{ position:'fixed', top:0, bottom:0, left:'max(48px,5vw)', width:1, background:'rgba(213,68,68,0.18)', zIndex:0, pointerEvents:'none' }}/>

      {/* Section intro — compact, sits below EmpresaHero */}
      <div style={{ position:'relative', zIndex:2, padding:'clamp(48px,7vh,80px) clamp(24px,5vw,84px) clamp(32px,4vh,52px)', textAlign:'center' }}>
        <div style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontSize:'clamp(22px,2.4vw,34px)', fontWeight:700, lineHeight:1, display:'inline-block', transform:'rotate(-2deg)', marginBottom:14 }}>
          do projeto à obra entregue
        </div>
        <h2 id="processo" style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, textTransform:'uppercase', fontSize:'clamp(36px,4.8vw,68px)', lineHeight:0.98, margin:'0 0 16px', color:'#10212c', letterSpacing:'-0.01em' }}>
          Como{' '}
          <span style={{ position:'relative', color:'#077fbf', whiteSpace:'nowrap' }}>
            trabalhamos
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" style={{ position:'absolute', left:'-2%', bottom:'0.02em', width:'104%', height:'0.32em', overflow:'visible' }}>
              <path d="M3,15 C70,4 150,22 220,9 C255,3 285,11 297,8" fill="none" stroke="#47b6f1" strokeWidth="5" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>
        <p style={{ maxWidth:'52ch', margin:'0 auto', fontSize:'clamp(16px,1.2vw,19px)', lineHeight:1.6, color:'#4a606e' }}>
          Orientamos cada cliente do projeto à obra — com realidade virtual para transparência na decisão, BIM para precisão de fabricação e montagem 100% parafusada. Um único responsável em cinco etapas.
        </p>
      </div>

      {/* Panels */}
      <main>
        {PROC_STEPS.map((s, i) => <ProcessPanel key={s.n} s={s} index={i}/>)}
      </main>

      {/* Outro */}
      <footer style={{ position:'relative', zIndex:2, minHeight:'56vh', display:'flex', flexDirection:'column', justifyContent:'center', gap:22, padding:'9vh clamp(24px,5vw,84px) 13vh calc(max(48px,5vw) + 40px)' }}>
        <div style={{ fontFamily:'Caveat, cursive', color:'#1853b8', fontSize:'clamp(26px,3vw,44px)', fontWeight:700, lineHeight:1, transform:'rotate(-2deg)', display:'inline-block' }}>e o resultado…</div>
        <h2 style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:800, textTransform:'uppercase', fontSize:'clamp(30px,4vw,58px)', lineHeight:1, color:'#10212c', margin:0, maxWidth:'18ch' }}>
          Estrutura <em style={{ fontStyle:'normal', color:'#077fbf' }}>numerada, parafusada</em> e entregue no prazo.
        </h2>
        <a href="Home Berti.html#orcamento" style={{ display:'inline-flex', alignItems:'center', gap:12, alignSelf:'flex-start', background:'#077fbf', color:'#fff', textDecoration:'none', fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', fontSize:17, padding:'16px 28px', borderRadius:3 }}>
          Solicitar orçamento &nbsp;→
        </a>
      </footer>

      {/* Progress dots */}
      <style>{`@media(max-width:880px){.proc-dots{display:none!important}}@media(max-width:880px){.panel-grid{grid-template-columns:1fr!important}}`}</style>
      <div className="proc-dots" style={{ position:'fixed', right:'max(20px,2.2vw)', top:'50%', transform:'translateY(-50%)', zIndex:40, display:'flex', flexDirection:'column', gap:16, alignItems:'flex-end' }}>
        {PROC_STEPS.map((s, i) => (
          <a key={i} href={'#proc-'+i} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <span style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', fontSize:12, color: i===active ? '#077fbf' : '#9fb0c0', opacity: i===active ? 1 : 0, transition:'0.22s', whiteSpace:'nowrap' }}>{s.n} {s.tag}</span>
            <span style={{ width:11, height:11, borderRadius:'50%', border:'2px solid '+(i===active?'#077fbf':'#c6d4e2'), background: i===active?'#077fbf':'#fff', transform: i===active?'scale(1.18)':'scale(1)', transition:'0.22s', display:'block' }}/>
          </a>
        ))}
      </div>
    </div>
  );
}

window.EmpresaProcesso = EmpresaProcesso;
