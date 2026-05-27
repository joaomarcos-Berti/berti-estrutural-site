/* global React, HOME_BRAND */
// ============================================================================
// HOME · DEPOIMENTOS · placeholder esperando conteúdo real
// ============================================================================

function HomeDepoimentos({ items }) {
  // Se não receber depoimentos reais, mostra slots placeholder pra o cliente preencher
  const useItems = items && items.length ? items : [
    { quote: 'Aguardando depoimento do cliente — substituir aqui.',
      name: 'Nome do cliente', role: 'Cargo · Empresa', logo: null },
    { quote: 'Aguardando depoimento do cliente — substituir aqui.',
      name: 'Nome do cliente', role: 'Cargo · Empresa', logo: null },
  ];

  return (
    <section id="depoimentos" style={{
      background: '#f6f7f8',
      padding: '110px 64px 100px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64,
        alignItems: 'end', marginBottom: 56,
        maxWidth: 1440, margin: '0 auto 56px',
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
            Quem confia na Berti
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800, fontSize: 'clamp(30px, 3.2vw, 44px)', lineHeight: 0.98,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            margin: 0, color: HOME_BRAND.ink,
          }}>
            Depoimentos<br/>de quem construiu.
          </h2>
        </div>
        <p style={{
          fontSize: 17, lineHeight: 1.6,
          color: 'rgba(10,10,10,0.65)',
          maxWidth: 540, justifySelf: 'end', margin: 0,
        }}>
          A confiança dos nossos clientes é a métrica mais importante. Cada projeto
          entregue é uma parceria que continua — ouça quem já construiu com a Berti.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28,
        maxWidth: 1440, margin: '0 auto',
      }}>
        {useItems.map((t, i) => (
          <article key={i} style={{
            background: '#fff',
            padding: '40px 44px',
            position: 'relative',
            borderLeft: `3px solid ${HOME_BRAND.blue}`,
          }}>
            {/* Aspas decorativas */}
            <div style={{
              position: 'absolute', top: 18, right: 26,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 96, lineHeight: 1, fontWeight: 800,
              color: HOME_BRAND.blue, opacity: 0.18,
              pointerEvents: 'none', userSelect: 'none',
            }}>"</div>

            <p style={{
              fontSize: 18, lineHeight: 1.55,
              color: 'rgba(10,10,10,0.82)',
              margin: 0, minHeight: 110,
              fontStyle: items && items.length ? 'normal' : 'italic',
              opacity: items && items.length ? 1 : 0.5,
            }}>"{t.quote}"</p>

            <div style={{
              marginTop: 28, paddingTop: 22,
              borderTop: '1px solid rgba(10,10,10,0.08)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {t.logo ? (
                <img src={t.logo} alt={t.name} style={{
                  height: 44, maxWidth: 110, objectFit: 'contain',
                }} />
              ) : (
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: HOME_BRAND.paper,
                  border: '1px dashed rgba(10,10,10,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'rgba(10,10,10,0.4)',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>logo</div>
              )}
              <div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700, fontSize: 18, textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  color: HOME_BRAND.ink,
                }}>{t.name}</div>
                <div style={{
                  fontSize: 12.5, color: 'rgba(10,10,10,0.6)',
                  letterSpacing: '0.04em',
                }}>{t.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {(!items || !items.length) && (
        <div style={{
          marginTop: 32, textAlign: 'center',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
        }}>
          ◇ Aguardando os depoimentos reais do cliente para substituir os placeholders
        </div>
      )}
    </section>
  );
}

window.HomeDepoimentos = HomeDepoimentos;
