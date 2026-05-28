/* global React, HOME_BRAND */
// ============================================================================
// HOME Â· DEPOIMENTOS Â· dados reais
// ============================================================================

const DEPOIMENTOS = [
  {
    quote: 'Sistema prÃ¡tico, funcional, com bom custo-benefÃ­cio. Gostamos muito do trabalho, tanto do Gustavo quanto do Carlos, pessoas honestas e sÃ©rias.',
    name:  'Valdenir G. de Sales',
    role:  'Diretor Presidente Â· Nipponflex',
    photo: 'assets/depoimentos/1.jpg?v=2',
  },
  {
    quote: 'Parceria com a Berti garantiu rÃ¡pida execuÃ§Ã£o com qualidade e retorno financeiro consequentemente melhor.',
    name:  'Raul FulgÃªncio',
    role:  'Raul FulgÃªncio NegÃ³cios ImobiliÃ¡rios',
    photo: 'assets/depoimentos/2.jpg?v=2',
  },
  {
    quote: 'A obra foi bem econÃ´mica e eficiente, o que permitiu economizar e atÃ© antecipar a inauguraÃ§Ã£o, o que foi muito importante para nÃ³s, e estamos muito satisfeitos com essa parceria.',
    name:  'Arlei Luiz Camilo',
    role:  'ProprietÃ¡rio Â· GCA Alimentos',
    photo: 'assets/depoimentos/3.jpg?v=2',
  },
  {
    quote: 'O projeto tinha uma estrutura muito diferenciada, onde sÃ³ a Berti poderia executar isso para nÃ³s.',
    name:  'Claudio Haruo Mukai',
    role:  'Diretor de Engenharia Â· SISA ConstruÃ§Ãµes',
    photo: 'assets/depoimentos/4.jpg?v=2',
  },
];

function HomeDepoimentos() {
  return (
    <section id="depoimentos" style={{
      background: '#f6f7f8',
      padding: '110px 64px 100px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* CabeÃ§alho */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64,
          alignItems: 'end', marginBottom: 56,
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
            A confianÃ§a dos nossos clientes Ã© a mÃ©trica mais importante. Cada projeto
            entregue Ã© uma parceria que continua â ouÃ§a quem jÃ¡ construiu com a Berti.
          </p>
        </div>

        {/* Grid 2Ã2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28,
        }}>
          {DEPOIMENTOS.map((t, i) => (
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
