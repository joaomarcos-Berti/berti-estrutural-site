/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · 07 · BLOG / NOTÍCIAS
// Puxa os posts de content/blog.json (mesma fonte do admin) e mostra os 3
// mais recentes como cards, com link para a página de Blog.
// ============================================================================
const { useState: useStateBlog, useEffect: useEffectBlog } = React;

const HOME_BLOG_FALLBACK = 'assets/photos/hero-01.jpg';

function HomeBlog() {
  const [posts, setPosts] = useStateBlog([]);
  const isMobile = useMobile();
  const blue = HOME_BRAND.blue;
  const blueDark = HOME_BRAND.blueDark;
  const ink = HOME_BRAND.ink;

  useEffectBlog(() => {
    fetch('content/blog.json?t=' + Date.now())
      .then((r) => r.json())
      .then((d) => setPosts((d.posts || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section id="blog" style={{
      background: HOME_BRAND.paper,
      fontFamily: '"Open Sans", sans-serif',
      color: ink,
      padding: isMobile ? '56px 20px 64px' : '88px 40px 96px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row',
          gap: 16, marginBottom: 36,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <span style={{ width: 30, height: 1, background: blueDark, display: 'inline-block' }} />
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '0.28em', textTransform: 'uppercase', color: blueDark }}>
                Blog · Notícias
              </span>
            </div>
            <h2 style={{ margin: 0, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: isMobile ? 34 : 46, lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase', color: ink }}>
              Conteúdo técnico<br/>sobre estruturas metálicas
            </h2>
          </div>
          <a href="Blog.html" style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 14,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: blueDark, textDecoration: 'none',
            whiteSpace: 'nowrap', borderBottom: '2px solid ' + blue, paddingBottom: 4,
          }}>Ver todas →</a>
        </div>

        {/* Grid de cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {posts.map((p) => (
            <a key={p.id} href="Blog.html" style={{
              display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit',
              background: '#fff', borderRadius: 4, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(6,25,34,0.08)', transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(6,25,34,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(6,25,34,0.08)'; }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#dfe6ec', overflow: 'hidden' }}>
                <img src={p.cover || HOME_BLOG_FALLBACK} alt={p.title}
                  onError={(e) => { if (e.currentTarget.src.indexOf(HOME_BLOG_FALLBACK) < 0) e.currentTarget.src = HOME_BLOG_FALLBACK; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{
                  position: 'absolute', left: 12, top: 12, background: blue, color: '#06222e',
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 11.5,
                  letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px',
                }}>{p.catLabel || p.cat}</span>
              </div>
              <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div style={{ fontSize: 12, color: '#7b8a93', letterSpacing: '0.04em' }}>
                  {p.date}{p.read ? ' · ' + p.read : ''}
                </div>
                <h3 style={{ margin: 0, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 21, lineHeight: 1.1, color: ink }}>
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#5b6b75', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.excerpt}
                  </p>
                )}
                <span style={{ marginTop: 'auto', paddingTop: 8, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: blueDark }}>
                  Ler artigo →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

window.HomeBlog = HomeBlog;
