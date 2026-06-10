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

function HomeParceiros({ speedSec = 44 }) {
  const looped = [...PARCEIROS, ...PARCEIROS];

  return (
    <section id="parceiros" style={{
      background: '#fff',
      borderTop: '1px solid rgba(10,10,10,0.07)',
      borderBottom: '1px solid rgba(10,10,10,0.07)',
      padding: '14px 0 16px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Label discreta */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 600, fontSize: 11, lineHeight: 1,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.28)',
        }}>
          Quem já construiu com a Berti
        </span>
      </div>

      {/* Faixa do carrossel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maskImage: 'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
      }}>
        <div style={{
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
              width: 130, height: 56,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 18px',
              borderRight: '1px solid rgba(10,10,10,0.05)',
            }}>
              <img src={p.logo} alt={p.name} title={p.name} style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain',
                opacity: 0.5,
                filter: 'grayscale(100%)',
                transition: 'opacity 280ms ease, filter 280ms ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.filter = 'grayscale(0%)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.filter = 'grayscale(100%)'; }}
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
