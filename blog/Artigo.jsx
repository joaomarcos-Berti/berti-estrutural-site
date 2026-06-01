/* global React, HOME_BRAND */
// ============================================================================
// BLOG · LEITOR DE ARTIGO (overlay)
// Painel de leitura limpo com capa, meta e corpo do texto.
// ============================================================================
const { useEffect } = React;

function BlogArtigo({ post, onClose }) {
  const accent = HOME_BRAND.blue;

  useEffect(() => {
    if (!post) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(4,8,12,0.72)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'center',
      padding: 'clamp(0px, 4vw, 48px)',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      animation: 'blogFade 220ms ease', overflowY: 'auto',
    }}>
      <article onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', width: '100%', maxWidth: 820,
        alignSelf: 'flex-start', position: 'relative',
        boxShadow: '0 40px 120px -30px rgba(0,0,0,0.6)',
        animation: 'blogRise 320ms cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Fechar */}
        <button onClick={onClose} aria-label="Fechar" style={{
          position: 'absolute', top: 18, right: 18, zIndex: 3,
          width: 44, height: 44, border: 'none', cursor: 'pointer',
          background: 'rgba(4,8,12,0.55)', color: '#fff', fontSize: 20,
          backdropFilter: 'blur(4px)',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(4,8,12,0.55)'; e.currentTarget.style.color = '#fff'; }}
        >✕</button>

        {/* Capa */}
        <div style={{ position: 'relative', height: 'clamp(220px, 38vh, 380px)', background: '#000' }}>
          <img src={post.cover} alt={post.title} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }} />
          <div style={{
            position: 'absolute', top: 18, left: 18,
            background: accent, color: '#05080c',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            padding: '6px 12px',
          }}>{post.catLabel}</div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: 'clamp(28px, 5vw, 60px)' }}>
          <div style={{
            display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
            fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: HOME_BRAND.blueDark, fontWeight: 700, marginBottom: 18,
            fontFamily: '"Barlow Condensed", sans-serif',
          }}>
            <span>{post.date}</span>
            <span style={{ color: 'rgba(10,10,10,0.25)' }}>•</span>
            <span>{post.read} de leitura</span>
            <span style={{ color: 'rgba(10,10,10,0.25)' }}>•</span>
            <span>{post.author}</span>
          </div>

          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.0,
            letterSpacing: '-0.01em', color: HOME_BRAND.ink,
            margin: '0 0 28px', textWrap: 'balance',
          }}>{post.title}</h1>

          <div style={{ width: 56, height: 3, background: accent, marginBottom: 28 }} />

          {post.body.map((para, i) => (
            <p key={i} style={{
              fontSize: 17.5, lineHeight: 1.72, color: 'rgba(10,10,10,0.82)',
              margin: '0 0 22px', textWrap: 'pretty',
            }}>{para}</p>
          ))}

          {/* CTA final */}
          <div style={{
            marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(10,10,10,0.1)',
            display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
              fontSize: 22, color: HOME_BRAND.ink, textTransform: 'uppercase', lineHeight: 1.1,
            }}>Tem um projeto em mente?</div>
            <a href="Home%20Berti.html#orcamento" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: accent, color: '#000', padding: '14px 26px',
              fontSize: 12.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Falar com a Berti <span>→</span></a>
          </div>
        </div>
      </article>

      <style>{`
        @keyframes blogFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes blogRise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}

window.BlogArtigo = BlogArtigo;
