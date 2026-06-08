/* global React, HOME_BRAND, useMobile */
// ============================================================================
// HOME · DEPOIMENTOS · dados reais
// ============================================================================

const DEPOIMENTOS = [
  {
    quote: 'Sistema prático, funcional, com bom custo-benefício. Gostamos muito do trabalho, tanto do Gustavo quanto do Carlos, pessoas honestas e sérias.',
    name:  'Valdenir G. de Sales',
    role:  'Diretor Presidente · Nipponflex',
    photo: 'assets/depoimentos/1.jpg?v=2',
  },
  {
    quote: 'Parceria com a Berti garantiu rápida execução com qualidade e retorno financeiro consequentemente melhor.',
    name:  'Raul Fulgêncio',
    role:  'Raul Fulgêncio Negócios Imobiliários',
    photo: 'assets/depoimentos/2.jpg?v=2',
  },
  {
    quote: 'A obra foi bem econômica e eficiente, o que permitiu economizar e até antecipar a inauguração, o que foi muito importante para nós, e estamos muito satisfeitos com essa parceria.',
    name:  'Arlei Luiz Camilo',
    role:  'Proprietário · GCA Alimentos',
    photo: 'assets/depoimentos/3.jpg?v=2',
  },
  {
    quote: 'O projeto tinha uma estrutura muito diferenciada, onde só a Berti poderia executar isso para nós.',
    name:  'Claudio Haruo Mukai',
    role:  'Diretor de Engenharia · SISA Construções',
    photo: 'assets/depoimentos/4.jpg?v=2',
  },
];

function HomeDepoimentos() {
  const isMobile = useMobile();
  return (
    <section id="depoimentos" style={{
      background: '#f6f7f8',
      padding: isMobile ? '56px 20px 48px' : '110px 64px 100px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? 20 : 64,
          alignItems: 'end', marginBottom: isMobile ? 40 : 56,
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
              Depoimentos<br/>
            </h2>
          </div>
          <p style={{
            fontSize: 17, lineHeight: 1.6,
            color: 'rgba(10,10,10,0.65)',
            maxWidth: 540, justifySelf: isMobile ? undefined : 'end', margin: 0,
          }}>
            A confiança dos nossos clientes é a métrica mais importante. Cada projeto
            entregue é uma parceria que continua — ouça quem já construiu com a Berti.
          </p>
        </div>

        {/* Grid 2×2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 16 : 28,
        }}>
          {DEPOIMENTOS.map((t, i) => (
            <article key={i} style={{
              background: '#fff',
              padding: isMobile ? '28px 20px' : '40px 44px',
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
                fontSize: 17, lineHeight: 1.6,
                color: 'rgba(10,10,10,0.82)',
                margin: '0 0 28px',
                fontStyle: 'italic',
              }}>"{t.quote}"</p>

              <div style={{
                paddingTop: 22,
                borderTop: '1px solid rgba(10,10,10,0.08)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  style={{
                    width: 56, height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: `2px solid ${HOME_BRAND.blue}`,
                  }}
                />
                <div>
                  <div style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700, fontSize: 18, textTransform: 'uppercase',
                    letterSpacing: '0.02em', color: HOME_BRAND.ink,
                  }}>{t.name}</div>
                  <div style={{
                    fontSize: 12.5, color: 'rgba(10,10,10,0.6)',
                    letterSpacing: '0.04em', marginTop: 2,
                  }}>{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

window.HomeDepoimentos = HomeDepoimentos;
