/* global React, HOME_BRAND, HOME_PHOTO, useMobile */
// ============================================================================
// HOME · CATEGORIAS DE OBRAS
// Três blocos lado a lado: Supermercados · Comercial · Industrial
// ============================================================================

const HOME_CATEGORIES = [
  {
    key: 'supermercado',
    num: '01',
    title: 'Supermercados',
    body: 'Coberturas de grande vão livre, mezaninos e estruturas para varejo de alto fluxo. Obra rápida, com a loja já operando.',
    photo:      'assets/portfolio/supermercado-1.webp',
    photoHover: 'assets/portfolio/supermercado-2.webp',
  },
  {
    key: 'comercial',
    num: '02',
    title: 'Comercial',
    body: 'Showrooms, concessionárias, lojas de materiais e centros logísticos urbanos. Pé-direito generoso e fachada limpa.',
    photo:      'assets/portfolio/comercial-1.webp',
    photoHover: 'assets/portfolio/comercial-2.webp',
  },
  {
    key: 'industrial',
    num: '03',
    title: 'Industrial',
    body: 'Galpões fabris, plantas industriais e pavilhões logísticos de grande porte. Engenharia para cargas pesadas e operação 24/7.',
    photo:      'assets/portfolio/industrial-1.webp',
    photoHover: 'assets/portfolio/industrial-2.webp',
  },
];

function HomeCategorias({ accent = HOME_BRAND.blue, bg = HOME_BRAND.paper }) {
  const isMobile = useMobile();
  return (
    <section id="obras" style={{
      background: bg,
      padding: isMobile ? '64px 20px 56px' : '120px clamp(64px, 8vw, 140px) 100px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
      position: 'relative',
    }}>
      {/* Linha guia decorativa */}
      <div style={{
        position: 'absolute', top: 0, left: 64, right: 64, height: 1,
        background: 'rgba(10,10,10,0.08)',
      }} />

      {/* Cabeçalho */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? 24 : 64,
        alignItems: 'end', marginBottom: isMobile ? 40 : 64,
        maxWidth: 1440, margin: isMobile ? '0 auto 40px' : '0 auto 64px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: HOME_BRAND.blueDark, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            <span style={{ width: 28, height: 1, background: HOME_BRAND.blueDark }} />
            Segmentos de atuação
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800, fontSize: 'clamp(34px, 3.6vw, 52px)', lineHeight: 0.95,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            margin: 0, color: HOME_BRAND.ink,
          }}>
            Veja Nossas Obras
          </h2>
        </div>
        <p style={{
          fontSize: 17, lineHeight: 1.6,
          color: 'rgba(10,10,10,0.68)',
          maxWidth: 520, justifySelf: isMobile ? undefined : 'end', margin: 0,
        }}>
          Soluções personalizadas, com segurança, certificação e excelente custo-benefício.
          Supermercados, comercial e industrial — três frentes atendidas com o mesmo padrão
          de engenharia BIM, fabricação certificada e montagem 100% parafusada.
        </p>
      </div>

      {/* Grid de categorias */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 28,
        maxWidth: 1440, margin: '0 auto',
      }}>
        {HOME_CATEGORIES.map((cat) => (
          <a key={cat.key} href={`Obras.html#${cat.key}`} style={{
            position: 'relative', display: 'block',
            textDecoration: 'none', color: 'inherit',
            background: '#fff',
            overflow: 'hidden',
            transition: 'transform 280ms ease, box-shadow 280ms ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 24px 60px -20px rgba(7,61,87,0.35)';
            const base  = e.currentTarget.querySelector('[data-photo-base]');
            const hover = e.currentTarget.querySelector('[data-photo-hover]');
            if (base)  { base.style.opacity  = '0'; base.style.transform  = 'scale(1.06)'; }
            if (hover) { hover.style.opacity = '1'; hover.style.transform = 'scale(1.06)'; }
            const arr = e.currentTarget.querySelector('[data-arrow]');
            if (arr) arr.style.transform = 'translateX(8px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
            const base  = e.currentTarget.querySelector('[data-photo-base]');
            const hover = e.currentTarget.querySelector('[data-photo-hover]');
            if (base)  { base.style.opacity  = '1'; base.style.transform  = 'scale(1)'; }
            if (hover) { hover.style.opacity = '0'; hover.style.transform = 'scale(1)'; }
            const arr = e.currentTarget.querySelector('[data-arrow]');
            if (arr) arr.style.transform = 'translateX(0)';
          }}
          >
            {/* Foto · 2 camadas que fazem cross-fade no hover */}
            <div style={{ position: 'relative', height: 320, overflow: 'hidden', background: '#000' }}>
              <img data-photo-base src={cat.photo} alt={cat.title} style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block',
                opacity: 1,
                transition: 'opacity 500ms ease, transform 700ms ease',
              }} />
              <img data-photo-hover src={cat.photoHover} alt="" aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block',
                opacity: 0,
                transition: 'opacity 500ms ease, transform 700ms ease',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)',
              }} />
              <div style={{
                position: 'absolute', left: 22, top: 22,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 14, fontWeight: 700, letterSpacing: '0.22em',
                color: accent, textTransform: 'uppercase',
              }}>{cat.num}</div>
              <div style={{
                position: 'absolute', left: 22, right: 22, bottom: 22,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800, fontSize: 38, lineHeight: 0.95,
                letterSpacing: '-0.01em', textTransform: 'uppercase',
                color: '#fff',
              }}>{cat.title}</div>
            </div>

            {/* Corpo */}
            <div style={{ padding: '26px 26px 30px' }}>
              <p style={{
                fontSize: 14.5, lineHeight: 1.6, margin: 0,
                color: 'rgba(10,10,10,0.7)',
                minHeight: 88,
              }}>{cat.body}</p>

              <div style={{
                marginTop: 22, paddingTop: 18,
                borderTop: '1px solid rgba(10,10,10,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 13.5, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: HOME_BRAND.ink,
                }}>Ver obras</span>
                <span data-arrow style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 38,
                  background: accent, color: '#000',
                  transition: 'transform 240ms ease',
                  fontSize: 16, fontWeight: 700,
                }}>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Link para portfólio completo */}
      <div style={{ marginTop: 56, textAlign: 'center', maxWidth: 1440, margin: '56px auto 0' }}>
        <a href="Obras.html" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: 'transparent', color: HOME_BRAND.ink,
          padding: '16px 32px',
          border: `1.5px solid ${HOME_BRAND.ink}`,
          fontSize: 13, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.16em',
          textDecoration: 'none',
          fontFamily: '"Open Sans", system-ui, sans-serif',
        }}>
          Ver portfólio completo <span>→</span>
        </a>
      </div>
    </section>
  );
}

window.HomeCategorias = HomeCategorias;
