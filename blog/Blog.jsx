/* global React, HOME_BRAND, BLOG_CATS, BLOG_POSTS, BlogArtigo */
// ============================================================================
// BLOG · HERO + DESTAQUE + FILTRO + GRADE DE ARTIGOS
// ============================================================================
const { useState, useEffect } = React;

function BlogIndex() {
  const accent = HOME_BRAND.blue;
  const [filter, setFilter] = useState('todas');
  const [openId, setOpenId] = useState(null);

  const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter((p) => p !== featured);
  const visible = rest.filter((p) => filter === 'todas' || p.cat === filter);
  const openPost = openId ? BLOG_POSTS.find((p) => p.id === openId) : null;

  // Deep-link: Blog.html?post=<id> abre o artigo; back/forward e abrir/fechar sincronizam a URL
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(window.location.search).get('post');
      setOpenId(id && BLOG_POSTS.some((p) => p.id === id) ? id : null);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const abrirPost = (id) => {
    setOpenId(id);
    const u = new URL(window.location.href);
    u.searchParams.set('post', id);
    window.history.pushState({ post: id }, '', u);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const fecharPost = () => {
    setOpenId(null);
    const u = new URL(window.location.href);
    u.searchParams.delete('post');
    window.history.pushState({}, '', u.pathname + (u.search || ''));
  };

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{
        background: HOME_BRAND.ink, color: '#fff',
        padding: '150px clamp(40px, 8vw, 140px) 60px',
        fontFamily: '"Open Sans", system-ui, sans-serif',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif', color: accent,
            fontSize: 13, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            <span style={{ width: 30, height: 1, background: accent }} />
            Blog · Conhecimento em aço
          </div>
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(46px, 7vw, 104px)', lineHeight: 0.9,
            letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 0 20px',
          }}>A engenharia<br/><span style={{ color: accent }}>por escrito.</span></h1>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)',
            maxWidth: 560, margin: 0,
          }}>
            Artigos práticos sobre estruturas metálicas, tecnologia BIM, materiais
            e gestão de obra — direto de quem projeta, fabrica e monta.
          </p>
        </div>
      </section>

      {/* ── CONTEÚDO (claro) ───────────────────────────────────────────── */}
      <section style={{
        background: '#fff', color: HOME_BRAND.rule,
        padding: 'clamp(48px, 6vw, 88px) clamp(40px, 8vw, 140px) clamp(72px, 8vw, 120px)',
        fontFamily: '"Open Sans", system-ui, sans-serif',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>

          {/* Post em destaque */}
          <article onClick={() => abrirPost(featured.id)} style={{
            display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 0,
            cursor: 'pointer', marginBottom: 72,
            border: '1px solid rgba(10,10,10,0.1)',
            transition: 'box-shadow 280ms ease, transform 280ms ease',
          }}
            className="blog-featured"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 28px 60px -28px rgba(7,61,87,0.32)';
              const im = e.currentTarget.querySelector('img'); if (im) im.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              const im = e.currentTarget.querySelector('img'); if (im) im.style.transform = 'scale(1)';
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 360, background: '#000' }}>
              <img src={featured.cover} alt={featured.title} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 760ms cubic-bezier(.2,.8,.2,1)',
              }} />
              <div style={{
                position: 'absolute', top: 18, left: 18,
                background: accent, color: '#05080c',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '6px 12px',
              }}>Destaque</div>
            </div>
            <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{
                display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: HOME_BRAND.blueDark, marginBottom: 16,
              }}>
                <span>{featured.catLabel}</span>
                <span style={{ color: 'rgba(10,10,10,0.25)' }}>•</span>
                <span>{featured.date}</span>
                <span style={{ color: 'rgba(10,10,10,0.25)' }}>•</span>
                <span>{featured.read}</span>
              </div>
              <h2 style={{
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
                fontSize: 'clamp(26px, 2.6vw, 36px)', lineHeight: 1.06,
                letterSpacing: '-0.01em', color: HOME_BRAND.ink, margin: '0 0 16px',
                textWrap: 'balance',
              }}>{featured.title}</h2>
              <p style={{
                fontSize: 16, lineHeight: 1.62, color: 'rgba(10,10,10,0.66)',
                margin: '0 0 24px', textWrap: 'pretty',
              }}>{featured.excerpt}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: HOME_BRAND.ink,
              }}>Ler artigo <span style={{ color: accent }}>→</span></span>
            </div>
          </article>

          {/* Filtro de categorias */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
            paddingBottom: 28, marginBottom: 40,
            borderBottom: '1px solid rgba(10,10,10,0.1)',
          }}>
            {BLOG_CATS.map((c) => {
              const on = filter === c.key;
              return (
                <button key={c.key} onClick={() => setFilter(c.key)} style={{
                  padding: '9px 18px', cursor: 'pointer',
                  border: `1px solid ${on ? HOME_BRAND.ink : 'rgba(10,10,10,0.18)'}`,
                  background: on ? HOME_BRAND.ink : 'transparent',
                  color: on ? '#fff' : 'rgba(10,10,10,0.7)',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'all 180ms ease',
                }}
                  onMouseEnter={(e) => { if (!on) { e.currentTarget.style.borderColor = HOME_BRAND.ink; e.currentTarget.style.color = HOME_BRAND.ink; } }}
                  onMouseLeave={(e) => { if (!on) { e.currentTarget.style.borderColor = 'rgba(10,10,10,0.18)'; e.currentTarget.style.color = 'rgba(10,10,10,0.7)'; } }}
                >{c.label}</button>
              );
            })}
          </div>

          {/* Grade de artigos */}
          <div className="blog-grid">
            {visible.map((p) => (
              <BlogCard key={p.id} post={p} accent={accent} onClick={() => abrirPost(p.id)} />
            ))}
          </div>
        </div>
      </section>

      <BlogArtigo post={openPost} onClose={fecharPost} />

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 1000px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 620px)  { .blog-grid { grid-template-columns: 1fr; } }
        @media (max-width: 820px)  { .blog-featured { grid-template-columns: 1fr !important; } }
        @media (max-width: 820px)  { .blog-featured > div:first-child { min-height: 240px !important; } }
      `}</style>
    </>
  );
}

// ── Card de artigo ─────────────────────────────────────────────────────────
function BlogCard({ post, accent, onClick }) {
  return (
    <article onClick={onClick} style={{
      cursor: 'pointer', background: '#fff',
      border: '1px solid rgba(10,10,10,0.1)',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 260ms ease, transform 260ms ease',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 24px 50px -26px rgba(7,61,87,0.3)';
        const im = e.currentTarget.querySelector('img'); if (im) im.style.transform = 'scale(1.06)';
        const ar = e.currentTarget.querySelector('[data-ar]'); if (ar) ar.style.transform = 'translateX(6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        const im = e.currentTarget.querySelector('img'); if (im) im.style.transform = 'scale(1)';
        const ar = e.currentTarget.querySelector('[data-ar]'); if (ar) ar.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#000' }}>
        <img src={post.cover} alt={post.title} loading="lazy" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', transition: 'transform 700ms cubic-bezier(.2,.8,.2,1)',
        }} />
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(4,8,12,0.72)', color: accent,
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
          padding: '5px 10px',
        }}>{post.catLabel}</div>
      </div>

      <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
          fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.5)', marginBottom: 12,
        }}>
          <span>{post.date}</span>
          <span style={{ color: 'rgba(10,10,10,0.22)' }}>•</span>
          <span>{post.read}</span>
        </div>
        <h3 style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: 23, lineHeight: 1.04, letterSpacing: '-0.01em',
          color: HOME_BRAND.ink, margin: '0 0 12px', textWrap: 'balance',
        }}>{post.title}</h3>
        <p style={{
          fontSize: 14.5, lineHeight: 1.6, color: 'rgba(10,10,10,0.62)',
          margin: '0 0 20px', textWrap: 'pretty',
        }}>{post.excerpt}</p>
        <span data-ar style={{
          marginTop: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
          fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: HOME_BRAND.ink,
          transition: 'transform 240ms ease',
        }}>Ler artigo <span style={{ color: accent }}>→</span></span>
      </div>
    </article>
  );
}

window.BlogIndex = BlogIndex;
