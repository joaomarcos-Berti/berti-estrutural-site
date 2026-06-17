/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · YOUTUBE
// 1 vídeo principal + 3 vídeos do canal ao lado. Clicar nos secundários
// troca o principal. Embeds só carregam após o primeiro play (poster click)
// para a página continuar leve.
// ============================================================================
const { useState: useStateYT } = React;

// Vídeo destaque + sugestões do canal.
// IDs do YouTube — substitua os 3 secundários conforme o canal evolui.
const VIDEO_DESTAQUE = {
  id: 'otXMdsi8LIY',
  title: 'Carba Mall – Londrina PR | Estrutura Metálica em BIM',
  meta: 'Vídeo destaque do canal',
  poster: 'assets/photos/aerial.jpg',
};
const VIDEOS_SECUNDARIOS = [
  { id: 'Pj-tA7g7X1w', title: 'Millenium Open Mall – Londrina | Berti Estrutural',          meta: 'há 13 dias',   placeholder: false },
  { id: '4qlqqPA_6hs', title: 'Super Muffato – Medianeira PR | Berti Estrutural',            meta: 'há 2 semanas', placeholder: false },
  { id: 'noonzrTGMuY', title: 'Super Muffato – Francisco Beltrão PR | Berti Estrutural',     meta: 'há 3 semanas', placeholder: false },
  { id: 'LqoWuLdZlNI', title: 'Supermercado Bavaresco – Paranaguá PR | Berti Estrutural',   meta: 'há 1 mês',     placeholder: false },
];

const CHANNEL_URL = 'https://www.youtube.com/@Bertiestruturalengenharia';
const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

function HomeYoutube() {
  const [current, setCurrent] = useStateYT(VIDEO_DESTAQUE);
  const [playing, setPlaying] = useStateYT(false);
  const isMobile = useMobile();

  const swap = (v) => {
    setCurrent(v);
    setPlaying(false);   // volta ao poster até o usuário clicar play de novo
  };

  return (
    <section id="canal" style={{
      background: '#fff',
      padding: isMobile ? '56px 20px 48px' : '100px 64px 90px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
      borderTop: '1px solid rgba(10,10,10,0.06)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {/* Cabeçalho */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap', marginBottom: 40,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#FF0000', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              <YouTubeBadge /> @bertiestruturalengenharia
            </div>
            <h2 style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 0.98,
              letterSpacing: '-0.02em', textTransform: 'uppercase',
              margin: 0, color: HOME_BRAND.ink,
            }}>
              Berti em movimento.
            </h2>
          </div>

          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={{
            background: '#FF0000', color: '#fff',
            padding: '13px 22px',
            fontSize: 12.5, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
            transition: 'background 180ms ease, transform 180ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#cc0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <YouTubeBadge size={14} />
            Inscrever-se
          </a>
        </div>

        {/* Grid: principal + 3 secundários */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? 20 : 28,
        }}>
          {/* Vídeo principal */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '16/9',
              background: '#000',
              overflow: 'hidden',
              boxShadow: '0 18px 40px -16px rgba(10,10,10,0.35)',
            }}>
              {playing ? (
                <iframe
                  src={`https://www.youtube.com/embed/${current.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  style={{
                    position: 'absolute', inset: 0, padding: 0, border: 'none',
                    cursor: 'pointer', background: 'transparent',
                  }}
                  aria-label={`Reproduzir ${current.title}`}
                >
                  <img src={current.poster || thumbUrl(current.id)} alt={current.title} loading="lazy" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)',
                  }} />
                  <PlayButton />
                  <div style={{
                    position: 'absolute', left: 24, right: 24, bottom: 22,
                    color: '#fff', textAlign: 'left',
                  }}>
                    <div style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontWeight: 800, fontSize: 'clamp(20px, 2vw, 28px)',
                      textTransform: 'uppercase', letterSpacing: '-0.005em',
                      lineHeight: 1.1,
                    }}>{current.title}</div>
                    <div style={{
                      marginTop: 6, fontSize: 12,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.7)',
                    }}>{current.meta}</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {isMobile && (
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: 14, background: '#FF0000', color: '#fff', borderRadius: 6,
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
              fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              <YouTubeBadge size={15} /> Ver todos os vídeos no YouTube
            </a>
          )}

          {/* Vídeos secundários (4) — coluna que enche a altura do principal */}
          <div style={{
            display: isMobile ? 'none' : 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12,
            height: '100%',
          }}>
            {VIDEOS_SECUNDARIOS.map((v, i) => {
              const isCurrent = v.id === current.id && v.title === current.title;
              return (
                <button
                  key={i}
                  onClick={() => swap(v)}
                  style={{
                    padding: 0, border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14,
                    alignItems: 'flex-start',
                    transition: 'opacity 200ms ease',
                    opacity: isCurrent ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.opacity = '1'; }}
                >
                  <div style={{
                    position: 'relative', aspectRatio: '16/9',
                    background: '#000', overflow: 'hidden',
                    border: isCurrent ? `2px solid ${HOME_BRAND.blue}` : '2px solid transparent',
                    transition: 'border-color 200ms ease',
                  }}>
                    <img src={thumbUrl(v.id)} alt={v.title} loading="lazy" style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.25)',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="12" height="14" viewBox="0 0 12 14">
                          <polygon points="1,1 11,7 1,13" fill="#fff" />
                        </svg>
                      </div>
                    </div>
                    {v.placeholder && (
                      <div style={{
                        position: 'absolute', top: 4, left: 4,
                        background: 'rgba(0,0,0,0.7)', color: '#fff',
                        fontSize: 8.5, padding: '2px 5px',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontWeight: 600,
                      }}>placeholder</div>
                    )}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontSize: 16, fontWeight: 700, lineHeight: 1.15,
                      textTransform: 'uppercase', letterSpacing: '-0.005em',
                      color: HOME_BRAND.ink,
                      marginBottom: 4,
                    }}>{v.title}</div>
                    <div style={{
                      fontSize: 11.5, color: 'rgba(10,10,10,0.55)',
                      letterSpacing: '0.04em',
                    }}>{v.meta}</div>
                  </div>
                </button>
              );
            })}

            {/* Vídeos preenchem toda a coluna; sem nota lateral. */}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── ícone YouTube ─────────────────────────────────────────────────────────
function YouTubeBadge({ size = 16 }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 24 17" style={{ flexShrink: 0 }}>
      <path d="M23.5 2.6a3.02 3.02 0 0 0-2.12-2.14C19.5 0 12 0 12 0S4.5 0 2.62.46A3.02 3.02 0 0 0 .5 2.6C0 4.47 0 8.4 0 8.4s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14C4.5 16.9 12 16.9 12 16.9s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8z" fill="#FF0000"/>
      <polygon points="9.6,12 15.84,8.4 9.6,4.8" fill="#fff"/>
    </svg>
  );
}

// ── botão de play do vídeo principal ──────────────────────────────────────
function PlayButton() {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 88, height: 88, borderRadius: '50%',
      background: '#FF0000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 12px rgba(255,0,0,0.2), 0 8px 24px rgba(0,0,0,0.5)',
      transition: 'transform 200ms ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.06)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
    >
      <svg width="30" height="34" viewBox="0 0 30 34"><polygon points="2,2 28,17 2,32" fill="#fff" /></svg>
    </div>
  );
}

window.HomeYoutube = HomeYoutube;
