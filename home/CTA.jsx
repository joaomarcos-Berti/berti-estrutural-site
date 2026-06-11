/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · 08 · CTA — SOLICITAR ORÇAMENTO
// Faixa de fechamento antes do rodapé, com chamada forte e botões de ação.
// ============================================================================

function HomeCTA() {
  const isMobile = useMobile();
  const blue = HOME_BRAND.blue;
  const ink = HOME_BRAND.ink;

  return (
    <section id="orcamento" style={{
      position: 'relative',
      background: ink,
      color: '#fff',
      fontFamily: '"Open Sans", sans-serif',
      padding: isMobile ? '64px 20px' : '110px 40px',
      overflow: 'hidden',
    }}>
      {/* Grade técnica sutil ao fundo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(71,182,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(71,182,241,0.06) 1px, transparent 1px)',
        backgroundSize: '48px 48px', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 14,
          letterSpacing: '0.28em', textTransform: 'uppercase', color: blue, marginBottom: 20,
        }}>Vamos construir juntos</div>

        <h2 style={{
          margin: '0 auto 22px', maxWidth: 820,
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: isMobile ? 38 : 60, lineHeight: 0.96, letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          Tire seu projeto do papel<br/>com a <span style={{ color: blue }}>Berti Estrutural</span>
        </h2>

        <p style={{
          margin: '0 auto 40px', maxWidth: 600, fontSize: 17, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.82)',
        }}>
          Envie os dados do seu empreendimento e nossa equipe técnica prepara um
          orçamento sob medida — do projeto BIM à montagem em obra.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="Contato.html" style={{
            background: blue, color: '#000', padding: '18px 36px', fontSize: 13.5, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.14em', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform 180ms ease, background 180ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = blue; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Solicitar Orçamento <span aria-hidden="true">→</span></a>

          <a href="https://wa.me/5543999999999" target="_blank" rel="noopener" style={{
            background: 'transparent', color: '#fff', padding: '17px 36px', fontSize: 13.5, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.14em', textDecoration: 'none',
            border: '1.5px solid rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: 10,
            transition: 'border-color 180ms ease, background 180ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >WhatsApp Direto</a>
        </div>
      </div>
    </section>
  );
}

window.HomeCTA = HomeCTA;
