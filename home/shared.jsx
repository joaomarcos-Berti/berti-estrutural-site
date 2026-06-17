/* global React */
// ============================================================================
// HOME · TOKENS + CHROME COMPARTILHADO
// ============================================================================
const { useState, useEffect, useRef } = React;

function useMobile(bp = 768) {
  const [mob, setMob] = React.useState(typeof window !== 'undefined' && window.innerWidth < bp);
  React.useEffect(() => {
    const fn = () => setMob(window.innerWidth < bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return mob;
}
window.useMobile = useMobile;

const HOME_BRAND = {
  blue:     '#47b6f1',
  blueDark: '#077fbf',
  blueDeep: '#0a3d57',
  black:    '#0a0a0a',
  ink:      '#111418',
  white:    '#ffffff',
  paper:    '#f4f1ea',
  rule:     '#1a1a1a',
  muted:    '#9aa3aa',
};

const HOME_PHOTO = {
  aerial:              'assets/photos/aerial.jpg',
  interiorTruss:       'assets/photos/interior-truss.jpg',
  canopy:              'assets/photos/canopy.jpg',
  supermarketCeiling:  'assets/photos/supermarket-ceiling.jpg',
  supermarketBanners:  'assets/photos/supermarket-banners.jpg',
  factoryInterior:     'assets/photos/factory-interior.jpg',
};

const HOME_LOGO_BE    = 'assets/logo-be-mark.png';

// ============================================================================
// NAVBAR · transparente sobre o hero, sólida ao rolar
// ============================================================================
function HomeNavBar({ overlay = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const solid = !overlay || scrolled || menuOpen;

  const NAV_LINKS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Empresa', href: 'Empresa.html' },
    { label: 'Obras', href: 'Obras.html' },
    { label: 'Blog', href: 'Blog.html' },
    { label: 'Contato', href: 'Contato.html' },
  ];

  return (
    <header style={{
      position: overlay ? 'fixed' : 'relative',
      top: 0, left: 0, right: 0, zIndex: 100,
      background: solid ? 'rgba(8,10,12,0.96)' : 'transparent',
      backdropFilter: solid ? 'blur(8px)' : 'none',
      WebkitBackdropFilter: solid ? 'blur(8px)' : 'none',
      borderBottom: solid ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      padding: isMobile ? '14px 20px' : '18px 64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      color: '#fff',
      transition: 'background 240ms ease, border-color 240ms ease',
      fontFamily: '"Open Sans", system-ui, sans-serif',
    }}>
      {/* Logo */}
      <a href="index.html" style={{
        display: 'flex', alignItems: 'center', gap: 0,
        textDecoration: 'none', color: 'inherit',
        position: 'relative',
      }}
        onMouseEnter={(e) => {
          if (isMobile) return;
          const txt = e.currentTarget.querySelector('[data-berti-wordmark]');
          if (txt) { txt.style.width = '210px'; txt.style.opacity = '1'; txt.style.marginLeft = '14px'; }
        }}
        onMouseLeave={(e) => {
          if (isMobile) return;
          const txt = e.currentTarget.querySelector('[data-berti-wordmark]');
          if (txt) { txt.style.width = '0px'; txt.style.opacity = '0'; txt.style.marginLeft = '0px'; }
        }}
      >
        <img src={HOME_LOGO_BE} alt="Berti Estrutural" style={{
          height: isMobile ? 36 : 44, display: 'block', flexShrink: 0,
        }} />
        {isMobile ? (
          <span style={{
            display: 'inline-block',
            marginLeft: 12,
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#fff', lineHeight: 1,
          }}>
            BERTI <span style={{ color: HOME_BRAND.blue }}>ESTRUTURAL</span>
          </span>
        ) : (
          <span data-berti-wordmark style={{
            display: 'inline-block',
            width: 0, opacity: 0, marginLeft: 0,
            overflow: 'hidden', whiteSpace: 'nowrap',
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#fff',
            transition: 'width 280ms ease, opacity 220ms ease 60ms, margin-left 280ms ease',
            lineHeight: 1,
          }}>
            BERTI <span style={{ color: HOME_BRAND.blue }}>ESTRUTURAL</span>
          </span>
        )}
      </a>

      {/* Desktop nav */}
      {!isMobile && (
        <nav style={{ display: 'flex', gap: 36, fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {NAV_LINKS.map((x) => (
            <a key={x.label} href={x.href} style={{
              color: 'rgba(255,255,255,0.82)', textDecoration: 'none',
              transition: 'color 180ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.82)'}
            >{x.label}</a>
          ))}
          <a href="Contato.html" style={{
            background: HOME_BRAND.blue, color: '#000',
            padding: '10px 20px', fontSize: 12, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            textDecoration: 'none',
            transition: 'background 180ms ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.background = HOME_BRAND.blue}
          >Solicitar Orçamento</a>
        </nav>
      )}

      {/* Hamburger button (mobile only) */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', gap: 5,
            width: 40, height: 40,
          }}
        >
          <span style={{
            display: 'block', width: 24, height: 2, background: '#fff',
            transition: 'transform 260ms ease, opacity 200ms ease',
            transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: 24, height: 2, background: '#fff',
            transition: 'opacity 200ms ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: 24, height: 2, background: '#fff',
            transition: 'transform 260ms ease, opacity 200ms ease',
            transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      )}

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(8,10,12,0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 20px 28px',
          display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 200,
        }}>
          {NAV_LINKS.map((x) => (
            <a key={x.label} href={x.href} style={{
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontSize: 16, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'block',
            }}>{x.label}</a>
          ))}
          <a href="Contato.html" style={{
            background: HOME_BRAND.blue, color: '#000',
            padding: '16px 24px', fontSize: 13, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            textDecoration: 'none', display: 'block', textAlign: 'center',
            marginTop: 16,
          }}>Solicitar Orçamento</a>
        </div>
      )}
    </header>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function HomeFooter() {
  const isMobile = useMobile();
  const social = [
    { name: 'Instagram', url: 'https://www.instagram.com/bertiestrutural/', icon: 'instagram' },
    { name: 'Facebook',  url: 'https://www.facebook.com/bertiengenharia/',  icon: 'facebook'  },
    { name: 'LinkedIn',  url: 'https://br.linkedin.com/company/berti-estrutural-engenharia', icon: 'linkedin' },
    { name: 'YouTube',   url: 'https://www.youtube.com/@Bertiestruturalengenharia', icon: 'youtube' },
  ];

  return (
    <footer style={{
      background: '#050607', color: 'rgba(255,255,255,0.62)',
      padding: isMobile ? '48px 20px 20px' : '72px clamp(64px, 8vw, 140px) 28px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      fontFamily: '"Open Sans", system-ui, sans-serif',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1fr 1.4fr', gap: isMobile ? 32 : 48, marginBottom: isMobile ? 32 : 48 }}>
        {/* Marca + endereço */}
        <div>
          <img src={HOME_LOGO_BE} alt="Berti Estrutural" style={{
            height: 72, display: 'block',
          }} />
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 22,
            color: '#fff', marginTop: 22, lineHeight: 1.2, textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}>A estrutura por trás<br/>de grandes obras.</div>
          <div style={{ marginTop: 26, fontSize: 13.5, lineHeight: 1.65 }}>
            <div style={{ color: HOME_BRAND.blue, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Endereço</div>
            Condomínio Torre Montello<br/>
            Av. Ayrton Senna da Silva, 550 — Sala 103<br/>
            Palhano · Londrina — PR · 86055-630
          </div>
        </div>

        {/* Navegação */}
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            marginBottom: 18, color: HOME_BRAND.blue, fontWeight: 700,
          }}>Navegação</div>
          {['Home', 'Empresa', 'Obras', 'Blog', 'Contato'].map((it) => (
            <a key={it} href={it === 'Home' ? 'index.html' : it === 'Empresa' ? 'Empresa.html' : it === 'Obras' ? 'Obras.html' : it === 'Blog' ? 'Blog.html' : it === 'Contato' ? 'Contato.html' : `#${it.toLowerCase()}`} style={{
              display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              fontSize: 13.5, padding: '6px 0',
            }}>{it}</a>
          ))}
        </div>

        {/* Segmentos */}
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            marginBottom: 18, color: HOME_BRAND.blue, fontWeight: 700,
          }}>Segmentos</div>
          {['Supermercados', 'Comercial', 'Industrial'].map((it) => (
            <a key={it} href="Obras.html" style={{
              display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              fontSize: 13.5, padding: '6px 0',
            }}>{it}</a>
          ))}
        </div>

        {/* Contato + sociais */}
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            marginBottom: 18, color: HOME_BRAND.blue, fontWeight: 700,
          }}>Contato</div>
          <a href="tel:+554333048040" style={{
            display: 'block', color: '#fff', textDecoration: 'none',
            fontSize: 22, fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700, letterSpacing: '0.02em',
            marginBottom: 4,
          }}>(43) 3304-8040</a>
          <a href="mailto:berti@eberti.com.br" style={{
            display: 'inline-block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
            fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.2)',
            paddingBottom: 2,
          }}>berti@eberti.com.br</a>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Redes Sociais</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                   title={s.name}
                   style={{
                     width: 42, height: 42,
                     display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                     border: '1px solid rgba(255,255,255,0.2)',
                     color: 'rgba(255,255,255,0.85)',
                     transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
                   }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = HOME_BRAND.blue; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = HOME_BRAND.blue; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  <SocialIcon kind={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        fontSize: 11.5, opacity: 0.6,
        borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, letterSpacing: '0.04em',
      }}>
        <span>© 2026 Berti Estrutural Engenharia Ltda · CNPJ 10.835.867/0001-10</span>
        <span>Londrina · PR · Brasil</span>
      </div>
    </footer>
  );
}

// —— Ícones SVG inline para redes sociais —————————————————————————————————
function SocialIcon({ kind }) {
  const s = { width: 18, height: 18, fill: 'currentColor' };
  if (kind === 'instagram') return (
    <svg viewBox="0 0 24 24" {...s}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
  );
  if (kind === 'facebook') return (
    <svg viewBox="0 0 24 24" {...s}><path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69V11.1h3.13V8.41c0-3.1 1.9-4.79 4.66-4.79 1.32 0 2.46.1 2.8.14v3.24h-1.92c-1.5 0-1.8.72-1.8 1.77V11.1h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z"/></svg>
  );
  if (kind === 'linkedin') return (
    <svg viewBox="0 0 24 24" {...s}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.84c3.6 0 4.26 2.37 4.26 5.45v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.31a2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
  );
  if (kind === 'youtube') return (
    <svg viewBox="0 0 24 24" {...s}><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8zM9.6 15.6V8.4l6.24 3.6L9.6 15.6z"/></svg>
  );
  return null;
}

// Tornar acessível aos outros scripts babel
Object.assign(window, {
  HOME_BRAND, HOME_PHOTO, HOME_LOGO_BE,
  HomeNavBar, HomeFooter, useMobile,
});
