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
      borderBottom: '1px solid rgba(10,10,10,0.06)',
      padding: '22px 0 24px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Cabeçalho compacto */}
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16, padding: '0 32px' }}>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 600, fontSize: 'clamp(11px, 1vw, 13px)', lineHeight: 1.2,
            letterSpacing: '0.20em', textTransform: 'uppercase',
            margin: 0, color: 'rgba(10,10,10,0.45)',
          }}>
            Quem já construiu com a Berti
          </h2>
        </div>
      </div>

      {/* Faixa do carrossel — FULL-WIDTH */}
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
              width: 180, height: 90,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 20px',
              borderRight: '1px solid rgba(10,10,10,0.06)',
            }}>
              <img src={p.logo} alt={p.name} title={p.name} style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain',
                filter: 'none',
                opacity: 0.85,
                transition: 'opacity 280ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}
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
