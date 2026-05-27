/* global React, HOME_BRAND */
// ============================================================================
// HOME · PARCEIROS · carrossel infinito de logos de obras já entregues
// ============================================================================

const PARCEIROS = [
  { name: 'Viação Garcia',     logo: 'assets/parceiros/garcia.png' },
  { name: 'A. Yoshii',          logo: 'assets/parceiros/ayoshii.png' },
  { name: 'Super Muffato',     logo: 'assets/parceiros/muffato.png' },
  { name: 'Vectra',             logo: 'assets/parceiros/vectra.png' },
  { name: 'Balaroti',           logo: 'assets/parceiros/balaroti.png' },
  { name: 'Raul Fulgencio',    logo: 'assets/parceiros/raul-fulgencio.png' },
  { name: 'Camilo Atacadista', logo: 'assets/parceiros/camilo.png' },
  { name: 'Comercial Ivaiporã',logo: 'assets/parceiros/comercial-ivaipora.png' },
  { name: 'Super Golff',       logo: 'assets/parceiros/super-golff.png' },
  { name: 'Plaenge',            logo: 'assets/parceiros/plaenge.png' },
];

function HomeParceiros({ speedSec = 38 }) {
  const looped = [...PARCEIROS, ...PARCEIROS];

  return (
    <section id="parceiros" style={{
      background: '#fff',
      borderTop: '1px solid rgba(10,10,10,0.06)',
      borderBottom: '1px solid rgba(10,10,10,0.06)',
      padding: '52px 0 60px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Cabeçalho dentro do container estreito */}
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: HOME_BRAND.blueDark, fontSize: 11.5, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            <span style={{ width: 22, height: 1, background: HOME_BRAND.blueDark }} />
            Obras entregues
            <span style={{ width: 22, height: 1, background: HOME_BRAND.blueDark }} />
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700, fontSize: 'clamp(17px, 1.5vw, 22px)', lineHeight: 1.15,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            margin: 0, color: 'rgba(10,10,10,0.62)',
          }}>
            Quem já construiu com a Berti
          </h2>
        </div>
      </div>

      {/* Faixa do carrossel — FULL-WIDTH (extende até as laterais) */}
      <div style={{
        position: 'relative',
        width: '100%',
        maskImage: 'linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%)',
      }}>
        <div className="berti-marquee" style={{
          display: 'flex', gap: 0,
          width: 'fit-content',
          animation: `berti-marquee ${speedSec}s linear infinite`,
        }}
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          {looped.map((p, i) => (
            <div key={`${p.name}-${i}`} style={{
              flex: '0 0 auto',
              width: 180, height: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 20px',
              borderRight: '1px solid rgba(10,10,10,0.06)',
            }}>
              <img src={p.logo} alt={p.name} title={p.name} style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain',
                filter: 'grayscale(1)',
                opacity: 0.55,
                transition: 'filter 280ms ease, opacity 280ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(1)'; e.currentTarget.style.opacity = '0.55'; }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes berti-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

window.HomeParceiros = HomeParceiros;
