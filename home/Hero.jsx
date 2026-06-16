/* global React, HOME_BRAND, HOME_PHOTO, useMobile */
// ============================================================================
// HOME · HERO
// Vídeo-slideshow ao fundo passando as obras + bloco escuro à direita com
// título forte, subtítulo e dois CTAs (Orçamento / Obras).
// ============================================================================
const { useState: useStateHero, useEffect: useEffectHero, useRef: useRefHero } = React;

// Fotos que rodam no "vídeo" de fundo
const HERO_FRAMES = [
{ src: 'assets/photos/hero-01.jpg', label: 'Sky Mall · Londrina · PR' },
{ src: 'assets/photos/hero-02.jpg', label: 'Nipponflex · Maringá · PR' },
{ src: 'assets/photos/hero-03.jpg', label: 'Supermercado Camilo · Marialva · PR' },
{ src: 'assets/photos/hero-04.jpg', label: 'Projeto Comercial · Ivaiporã · PR' },
{ src: 'assets/photos/hero-05.jpg', label: 'Supermercado Bavaresco · Pontal do Paraná · PR' },
];

// Vídeo institucional do canal (autoplay mudo; clique para ativar som)
const HERO_VIDEO_ID = 'ROzn_Gl4R2Q';

// Modal "tela grande" com o vídeo institucional (abre ao clicar na pílula do Hero)
function HeroVideoModal({ accent, onClose }) {
  useEffectHero(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, []);

  const src = `https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(4,20,28,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 56px)', animation: 'beHeroFade .25s ease both',
    }}>
      <style>{'@keyframes beHeroFade{from{opacity:0}to{opacity:1}}'}</style>

      {/* Rótulo */}
      <div style={{
        position: 'absolute', top: 22, left: 26, display: 'flex', alignItems: 'center', gap: 9,
        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 13,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, display: 'inline-block' }} />
        Vídeo institucional · Berti Estrutural
      </div>

      {/* Fechar */}
      <button onClick={onClose} aria-label="Fechar vídeo" style={{
        position: 'absolute', top: 18, right: 20, width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
        fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>

      {/* Player 16:9 */}
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'relative', width: '100%', maxWidth: 1120, aspectRatio: '16 / 9',
        borderRadius: 10, overflow: 'hidden', background: '#000',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.14)',
      }}>
        <iframe
          title="Vídeo institucional Berti Estrutural"
          src={src}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function HomeHero({
  align = 'left',        // 'right' | 'left'
  overlay = 0.62,         // 0..1 — opacidade do véu escuro
  cycleMs = 6000,         // duração de cada quadro
  accent = HOME_BRAND.blue,
  ctaSecondary = 'outline', // 'outline' | 'whatsapp'
}) {
  const [idx, setIdx] = useStateHero(0);
  const [videoOpen, setVideoOpen] = useStateHero(false);
  const isMobile = useMobile();

  useEffectHero(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % HERO_FRAMES.length);
    }, cycleMs);
    return () => clearInterval(id);
  }, [cycleMs]);

  const blockAlignRight = align === 'right';

  return (
    <section id="top" style={{
      position: 'relative',
      height: '100vh', minHeight: 720,
      width: '100%', overflow: 'hidden',
      background: '#000', color: '#fff',
      fontFamily: '"Open Sans", system-ui, sans-serif',
    }}>
      {/* =================== BACKGROUND · slideshow Ken Burns =================== */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {HERO_FRAMES.map((f, i) => (
          <div key={f.src} style={{
            position: 'absolute', inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1500ms ease-in-out',
          }}>
            <img src={f.src} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: (!isMobile && i === idx) ? 'scale(1.08)' : 'scale(1)',
              transition: isMobile ? 'none' : `transform ${cycleMs + 1500}ms linear`,
              filter: 'grayscale(0.1) contrast(1.05)',
              display: 'block',
            }} />
          </div>
        ))}
      </div>

      {/* =================== Véu escuro (overlay) =================== */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: blockAlignRight
          ? `linear-gradient(90deg, rgba(0,0,0,${overlay * 0.45}) 0%, rgba(0,0,0,${overlay * 0.55}) 40%, rgba(0,0,0,${overlay + 0.18}) 100%)`
          : `linear-gradient(270deg, rgba(0,0,0,${overlay * 0.45}) 0%, rgba(0,0,0,${overlay * 0.55}) 40%, rgba(0,0,0,${overlay + 0.18}) 100%)`,
      }} />
      {/* Vinheta sutil pra cravar o título */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
        pointerEvents: 'none',
      }} />

      {/* =================== Conteúdo · bloco com folga lateral =================== */}
      <div style={{
        position: 'relative', zIndex: 5,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        gap: isMobile ? 0 : 'clamp(24px, 3vw, 56px)',
        padding: '120px 0 80px',
        maxWidth: 1540,
        margin: '0 auto',
        // Folga lateral pra o título não colar na borda
        paddingLeft:  isMobile ? '20px' : 'clamp(36px, 4vw, 80px)',
        paddingRight: isMobile ? '20px' : 'clamp(36px, 4vw, 80px)',
      }}>
        <div style={{
          maxWidth: 510, width: '100%',
          textAlign: 'left',
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: accent, fontSize: 14, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            <span style={{ width: 32, height: 1, background: accent, display: 'inline-block' }} />
            Desde 2009 · Londrina · PR
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(42px, 4.8vw, 76px)', lineHeight: 0.94,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
            color: '#fff',
            textShadow: '0 4px 30px rgba(0,0,0,0.45)',
            textWrap: 'balance',
          }}>
            Engenharia<br/>
            especializada em<br/>
            <span style={{ color: accent }}>estruturas metálicas.</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 17.5, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.88)',
            marginTop: 28, marginBottom: 40,
            maxWidth: 580,
            textShadow: '0 2px 14px rgba(0,0,0,0.5)',
          }}>
            Projetamos, fabricamos e montamos estruturas metálicas para supermercados,
            indústrias e grandes empreendimentos — do modelo BIM à peça
            instalada em obra.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="Contato.html" style={{
              background: accent, color: '#000',
              padding: '18px 32px', fontSize: 13.5, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
              transition: 'transform 180ms ease, background 180ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Solicitar Orçamento <span aria-hidden="true">→</span>
            </a>

            {ctaSecondary === 'whatsapp' ? (
              <a href="#" style={{
                background: '#25D366', color: '#fff',
                padding: '18px 32px', fontSize: 13.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>WhatsApp Direto</a>
            ) : (
              <a href="Obras.html" style={{
                background: 'transparent', color: '#fff',
                padding: '17px 32px',
                border: '1.5px solid rgba(255,255,255,0.55)',
                fontSize: 13.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
                transition: 'border-color 180ms ease, background 180ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; }}
              >Ver Obras</a>
            )}
          </div>

          {/* Pílula "Assistir vídeo institucional" — abre o vídeo em tela grande */}
          <button
            onClick={() => setVideoOpen(true)}
            style={{
              marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 13,
              background: 'rgba(6,25,34,0.5)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40,
              padding: '9px 20px 9px 9px', cursor: 'pointer',
              transition: 'background 180ms ease, border-color 180ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,25,34,0.72)'; e.currentTarget.style.borderColor = 'rgba(71,182,241,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,25,34,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          >
            <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: '50%', background: accent, alignItems: 'center', justifyContent: 'center', color: '#061922', fontSize: 13, paddingLeft: 2 }}>▶</span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textAlign: 'left' }}>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff' }}>Assistir vídeo institucional</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>Conheça a Berti em 1:42</span>
            </span>
          </button>

          {/* Stats compactos */}
          <div style={{
            display: 'flex', gap: isMobile ? 28 : 48, marginTop: isMobile ? 40 : 64,
            paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.18)',
            maxWidth: 540,
          }}>
            {[
              { v: '17', u: 'anos', l: 'no mercado' },
              { v: '+30', u: 'mil t', l: 'de aço entregue' },
              { v: 'BIM', u: '', l: 'projeto digital' },
            ].map((s) => (
              <div key={s.l}>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 800, fontSize: 36, lineHeight: 1,
                  letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'baseline', gap: 4,
                }}>
                  {s.v}
                  {s.u && <span style={{ fontSize: 18, color: accent }}>{s.u}</span>}
                </div>
                <div style={{
                  marginTop: 6, fontSize: 11.5,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =================== Indicadores de slide + legenda =================== */}
      <div style={{
        position: 'absolute', left: isMobile ? '20px' : 64, bottom: 32, zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 18,
        color: 'rgba(255,255,255,0.75)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {HERO_FRAMES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
              width: i === idx ? 28 : 14, height: 3,
              background: i === idx ? accent : 'rgba(255,255,255,0.35)',
              border: 'none', padding: 0, cursor: 'pointer',
              transition: 'width 240ms ease, background 240ms ease',
            }} />
          ))}
        </div>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>{HERO_FRAMES[idx].label}</span>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', right: 32, bottom: 32, zIndex: 6,
        color: 'rgba(255,255,255,0.6)', fontSize: 10.5,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 10,
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600,
      }}>
        Role para ver <span style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.4)' }} />
      </div>

      {videoOpen && <HeroVideoModal accent={accent} onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

window.HomeHero = HomeHero;
