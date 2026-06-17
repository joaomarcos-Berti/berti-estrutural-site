/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · 02 · ESTRUTURA 3D INTERATIVA
// Modelo real (palladium.glb) flutuando sobre fundo claro, com legendas à
// caneta, foto "a mesma obra pronta" e dica "arraste pra girar".
// Réplica do protótipo feito no Claude Designer.
// ============================================================================

function HomeEstrutura3D() {
  const isMobile = useMobile();
  // Só captura mouse/scroll depois de clicado; antes só rotaciona e a página rola normal.
  const [ativo, setAtivo] = React.useState(false);
  const blue = HOME_BRAND.blue;        // #47b6f1
  const blueDark = HOME_BRAND.blueDark; // #077fbf
  const ink = '#061922';

  const underline = { boxShadow: 'inset 0 -0.28em 0 0 rgba(71,182,241,0.55)', borderRadius: 2 };

  return (
    <section id="estrutura-3d" style={{
      background: '#ffffff',
      fontFamily: '"Open Sans", sans-serif',
      color: ink,
      padding: isMobile ? '56px 20px 64px' : '88px 40px 96px',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ width: 30, height: 1, background: blueDark, display: 'inline-block' }} />
          <span style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 14,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: blueDark,
          }}>Galpões em aço · modelo 3D</span>
        </div>

        {/* Título */}
        <h2 style={{
          margin: '0 0 6px', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 900,
          fontSize: isMobile ? 40 : 56, lineHeight: 0.9, letterSpacing: '-0.01em',
          textTransform: 'uppercase', color: ink,
        }}>A estrutura<br/>por dentro.</h2>

        {/* ===================== STAGE (somente desktop — 3D não carrega no mobile) ===================== */}
        {!isMobile && (
        <div style={{ position: 'relative', width: '100%', height: 620, marginTop: 8 }}>

          {/* Sombra no chão */}
          <div style={{
            position: 'absolute', left: '50%', bottom: 70, width: isMobile ? '90%' : 720, height: 110,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(6,25,34,0.13) 0%, rgba(6,25,34,0) 70%)',
            filter: 'blur(6px)', zIndex: 0,
          }} />

          {/* Modelo 3D real — só interage (arraste/zoom) após clique; antes só gira */}
          <model-viewer
            src="assets/3d/palladium.glb"
            alt="Estrutura metálica Palladium — Berti Estrutural"
            camera-controls={ativo ? '' : undefined}
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="18deg"
            interaction-prompt="none"
            field-of-view="30deg"
            camera-orbit="35deg 75deg 72%"
            shadow-intensity="0.6"
            shadow-softness="1"
            exposure="1.15"
            tone-mapping="neutral"
            environment-image="legacy"
            onMouseLeave={() => setAtivo(false)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1,
              touchAction: 'pan-y',
              background: 'transparent', '--progress-bar-color': blue, '--progress-bar-height': '3px',
            }}
          />

          {/* Camada de ativação — antes do clique a página rola normal; ao clicar libera arraste/zoom */}
          {!ativo && (
            <div
              onClick={() => setAtivo(true)}
              style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer', background: 'transparent' }}
            />
          )}

          {/* Foto colada · obra pronta (desktop) */}
          {!isMobile && (
            <div style={{ position: 'absolute', right: -6, top: 0, zIndex: 5, transform: 'rotate(2.5deg)', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', left: 14, top: -13, width: 78, height: 26, background: 'rgba(71,182,241,0.32)', transform: 'rotate(-25deg)', boxShadow: '0 1px 3px rgba(6,25,34,0.14)' }} />
              <div style={{ position: 'absolute', right: 12, top: -13, width: 78, height: 26, background: 'rgba(71,182,241,0.32)', transform: 'rotate(23deg)', boxShadow: '0 1px 3px rgba(6,25,34,0.14)' }} />
              <div style={{ background: '#fff', padding: '11px 11px 9px', borderRadius: 2, boxShadow: '0 16px 32px rgba(6,25,34,0.22)' }}>
                <img src="assets/photos/palladium-aerea.jpg" alt="A mesma estrutura, já construída" loading="lazy"
                  style={{ width: 256, height: 156, objectFit: 'cover', display: 'block' }} />
                <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 27, color: ink, textAlign: 'center', marginTop: 7, lineHeight: 1 }}>
                  A mesma obra, <span style={{ color: blueDark }}>pronta</span>
                </div>
              </div>
            </div>
          )}

          {/* Setas + legendas à caneta (desktop) */}
          {!isMobile && (
            <React.Fragment>
              <svg width="104" height="78" viewBox="0 0 132 98" fill="none"
                style={{ position: 'absolute', left: 214, top: 172, zIndex: 2, pointerEvents: 'none', overflow: 'visible', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.95))' }}>
                <path d="M6 10 C50 22 80 44 114 80" stroke={blue} strokeWidth="6.5" strokeLinecap="round" />
                <path d="M114 80 L94 78 M114 80 L110 58" stroke={blue} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="104" height="78" viewBox="0 0 132 98" fill="none"
                style={{ position: 'absolute', right: 196, bottom: 150, zIndex: 2, pointerEvents: 'none', overflow: 'visible', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.95))' }}>
                <path d="M126 88 C82 76 52 54 18 18" stroke={blue} strokeWidth="6.5" strokeLinecap="round" />
                <path d="M18 18 L38 20 M18 18 L22 40" stroke={blue} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div style={{ position: 'absolute', left: 0, top: 50, width: 340, zIndex: 3, pointerEvents: 'none' }}>
                <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 40, lineHeight: 1.08, color: ink }}>
                  <span style={underline}>Sem solda</span>, montagem <span style={underline}>rápida</span>
                </div>
                <div style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 15, color: '#5b6b75', marginTop: 7, maxWidth: 300 }}>
                  100% parafusada · execução completa em 120 dias
                </div>
              </div>

              <div style={{ position: 'absolute', right: 0, bottom: 56, width: 280, textAlign: 'right', zIndex: 3, pointerEvents: 'none' }}>
                <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 40, lineHeight: 1.04, color: ink }}>
                  Mezaninos <span style={{ boxShadow: 'inset 0 -0.30em 0 0 rgba(71,182,241,0.55)', borderRadius: 2 }}>mais leves</span>
                </div>
                <div style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 15, color: '#5b6b75', marginTop: 6, marginLeft: 'auto', maxWidth: 260 }}>
                  estrutura metálica, muito menos peso na obra
                </div>
              </div>

              {/* Seta + legenda à caneta — esquerda-baixo (terceira vantagem) */}
              <svg width="104" height="78" viewBox="0 0 132 98" fill="none"
                style={{ position: 'absolute', left: 196, bottom: 150, zIndex: 2, pointerEvents: 'none', overflow: 'visible', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.95))' }}>
                <path d="M6 88 C50 76 80 54 114 18" stroke={blue} strokeWidth="6.5" strokeLinecap="round" />
                <path d="M114 18 L94 20 M114 18 L110 40" stroke={blue} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div style={{ position: 'absolute', left: 0, bottom: 56, width: 300, zIndex: 3, pointerEvents: 'none' }}>
                <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 40, lineHeight: 1.08, color: ink }}>
                  Estrutura <span style={underline}>100% em BIM</span>
                </div>
                <div style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 15, color: '#5b6b75', marginTop: 7, maxWidth: 280 }}>
                  cada peça calculada e detalhada antes de fabricar
                </div>
              </div>
            </React.Fragment>
          )}

          {/* Dica arraste */}
          <div style={{
            position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', zIndex: 4,
            display: 'flex', alignItems: 'center', gap: 9, padding: '9px 18px', background: '#fff',
            border: '1.5px solid rgba(7,127,191,0.25)', borderRadius: 999, boxShadow: '0 6px 18px rgba(6,25,34,0.08)', pointerEvents: 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke={blueDark} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M20 4v4h-4" stroke={blueDark} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 24, color: blueDark, lineHeight: 1 }}>{ativo ? 'arraste pra girar' : 'clique para interagir'}</span>
          </div>

        </div>
        )}

        {/* ===================== MOBILE: cards de vantagem (3D oculto) ===================== */}
        {isMobile && (
          <div style={{ marginTop: 18 }}>
            {[
              { icon: 'bolt', t: 'Sem solda, montagem rápida', d: '100% parafusada · execução completa em 120 dias' },
              { icon: 'bim',  t: 'Estrutura 100% em BIM',      d: 'cada peça calculada e detalhada antes de fabricar' },
              { icon: 'leve', t: 'Mezaninos mais leves',       d: 'estrutura metálica, muito menos peso na obra' },
            ].map(function (v, k) {
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 0', borderBottom: k < 2 ? '1px solid #e3eaf1' : 'none' }}>
                  <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 11, background: 'rgba(71,182,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Vant3DIcon kind={v.icon} />
                  </span>
                  <div>
                    <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.01em', color: ink, lineHeight: 1.1, marginBottom: 4 }}>{v.t}</div>
                    <div style={{ fontSize: 14, color: '#5b6b75', lineHeight: 1.5 }}>{v.d}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: 'center', marginTop: 22, padding: '13px 14px', border: '1.5px solid rgba(7,127,191,0.4)', borderRadius: 8, color: blueDark, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Modelo 3D interativo disponível no computador
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Vant3DIcon({ kind }) {
  const c = '#077fbf';
  if (kind === 'bolt') return (<svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" /></svg>);
  if (kind === 'bim') return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" /><path d="M3 7 L12 12 L21 7" /><path d="M12 12 V22" /></svg>);
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 Z" /><path d="M2 13 L12 18 L22 13" /></svg>);
}

window.HomeEstrutura3D = HomeEstrutura3D;
