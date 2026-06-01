/* global React, HOME_BRAND */
// ============================================================================
// EMPRESA · COMO TRABALHAMOS · 5 etapas do processo
// Layout em colunas com gradiente de azul (escuro → claro) e ícones
// circulares no topo, inspirado no infográfico fornecido pelo cliente.
// ============================================================================

const PROCESSO_STEPS = [
  {
    num: 1,
    title: 'Avaliação de Projeto',
    body: 'Recebemos o projeto e nossa equipe técnica faz a análise inicial — verificando viabilidade estrutural e enquadramento no nosso padrão de execução, para já indicar o caminho mais eficiente.',
    bg: '#1F3D6E',   // mais escuro
  },
  {
    num: 2,
    title: 'Orçamento',
    body: 'Desenvolvemos um estudo técnico com modelagem BIM 3D da estrutura. Apresentamos ao cliente o projeto visual, os materiais, os valores e as soluções otimizadas para redução de custo.',
    bg: '#2D5C95',
  },
  {
    num: 3,
    title: 'Concepção de Projeto',
    body: 'Nossa equipe de engenheiros realiza os cálculos estruturais e a modelagem final em BIM. Cada peça é detalhada e as listas de fabricação são preparadas com precisão — garantindo encaixe perfeito na montagem.',
    bg: '#3F7DB0',
  },
  {
    num: 4,
    title: 'Fabricação',
    body: 'As listas são encaminhadas para fabricação com controle total de qualidade — peças estruturais e cobertura produzidas conforme o projeto, com rastreabilidade e certificação de cada material.',
    bg: '#5DA8D3',
  },
  {
    num: 5,
    title: 'Montagem',
    body: 'As peças chegam numeradas e prontas para encaixar — montagem 100% parafusada em obra, sem solda, com equipe especializada. Rapidez, segurança e zero retrabalho.',
    bg: '#8AC8E8',   // mais claro
  },
];

function EmpresaProcesso() {
  return (
    <section id="processo" style={{
      background: '#fff',
      padding: '110px 64px 100px',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      color: HOME_BRAND.rule,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
            color: HOME_BRAND.blueDark, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            <span style={{ width: 28, height: 1, background: HOME_BRAND.blueDark }} />
            Como trabalhamos
            <span style={{ width: 28, height: 1, background: HOME_BRAND.blueDark }} />
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.96,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            margin: '0 0 14px', color: HOME_BRAND.ink,
          }}>
            Do primeiro contato<br/>à última peça instalada.
          </h2>
          <p style={{
            maxWidth: 640, margin: '0 auto',
            fontSize: 16, lineHeight: 1.55,
            color: 'rgba(10,10,10,0.62)',
          }}>
            Da primeira conversa à montagem em obra — cada etapa orquestrada por
            engenheiros, com tecnologia BIM e controle total sobre prazo e qualidade.
          </p>
        </div>

        {/* Grid das 5 etapas */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18,
        }}>
          {PROCESSO_STEPS.map((s, i) => (
            <div key={s.num} style={{
              position: 'relative',
              paddingTop: 56,
              transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.04)';
              e.currentTarget.style.zIndex = '5';
              const card = e.currentTarget.querySelector('[data-step-card]');
              if (card) card.style.boxShadow = '0 24px 48px -18px rgba(7,61,87,0.45)';
              const ic = e.currentTarget.querySelector('[data-step-icon]');
              if (ic) ic.style.transform = 'translateX(-50%) scale(1.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.zIndex = '1';
              const card = e.currentTarget.querySelector('[data-step-card]');
              if (card) card.style.boxShadow = '0 8px 24px -16px rgba(10,10,10,0.18)';
              const ic = e.currentTarget.querySelector('[data-step-icon]');
              if (ic) ic.style.transform = 'translateX(-50%) scale(1)';
            }}
            >
              {/* Ícone circular suspenso sobre o card */}
              <div data-step-icon style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 104, height: 104,
                background: '#f1f2f4', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 3,
                boxShadow: '0 2px 6px rgba(10,10,10,0.06)',
                transition: 'transform 360ms cubic-bezier(.2,.8,.2,1)',
              }}>
                <ProcessIcon kind={s.num} />
              </div>

              {/* Card · cabeçalho colorido + corpo */}
              <div data-step-card style={{
                position: 'relative',
                background: '#fff',
                paddingTop: 60,
                boxShadow: '0 8px 24px -16px rgba(10,10,10,0.18)',
                minHeight: 520,
                transition: 'box-shadow 320ms ease',
              }}>
                {/* Cabeçalho colorido com borda ondulada inferior */}
                <div style={{
                  background: s.bg,
                  color: '#fff',
                  padding: '32px 18px 40px',
                  textAlign: 'center',
                  position: 'relative',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 800, fontSize: 19,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  lineHeight: 1.15,
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), 92% 100%, 75% calc(100% - 8px), 50% 100%, 25% calc(100% - 8px), 8% 100%, 0 calc(100% - 14px))',
                }}>
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
                    color: 'rgba(255,255,255,0.55)',
                  }}>0{s.num}</div>
                  {s.title}
                </div>
                {/* Corpo */}
                <div style={{
                  padding: '28px 24px 34px',
                  background: '#f6f8fa',
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'rgba(10,10,10,0.78)',
                  textAlign: 'center',
                  minHeight: 380,
                }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Ícones line-style — espelham o set fornecido pelo cliente ──────────────
function ProcessIcon({ kind }) {
  const C = '#Ia1a2a';
  const W = 56;
  const SW = 1.8;
  if (kind === 1) return (
    // Avaliação: prancheta com checklist + engrenagem (canto sup-esq) + lápis
    <svg width={W} height={W} viewBox="0 0 64 64" fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      {/* Documento/prancheta */}
      <path d="M20 12h22v40H20z" />
      {/* Itens do checklist (caixa + check + linha) */}
      <rect x="24" y="22" width="5" height="5" rx="0.8" />
      <path d="M25 24.5l1.2 1.2L28 24" />
      <path d="M32 24.5h7" />
      <rect x="24" y="31" width="5" height="5" rx="0.8" />
      <path d="M25 33.5l1.2 1.2L28 33" />
      <path d="M32 33.5h7" />
      <rect x="24" y="40" width="5" height="5" rx="0.8" />
      <path d="M25 42.5l1.2 1.2L28 42" />
      <path d="M32 42.5h7" />
      {/* Engrenagem no topo do documento */}
      <circle cx="29" cy="13" r="4" fill="#f1f2f4" />
      <circle cx="29" cy="13" r="2" />
      <path d="M29 7.5v2M29 16.5v2M23.5 13h2M32.5 13h2M25.4 9.4l1.4 1.4M31.2 14.6l1.4 1.4M25.4 16.6l1.4-1.4M31.2 11.4l1.4-1.4" />
      {/* Lápis escrevendo na lateral */}
      <path d="M42 30l8 8 4-4-8-8z" />
      <path d="M42 30l-2.5 6.5 6.5-2.5z" />
      <path d="M39.5 36.5l-1 2.5 2.5-1z" fill={C} />
    </svg>
  );
  if (kind === 2) return (
    // Orçamento: prancheta com itens + moeda ($) + lápis
    <svg width={W} height={W} viewBox="0 0 64 64" fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 10h26v40H16z" />
      <rect x="21" y="9" width="12" height="5" rx="1.2" fill={C} stroke="none" />
      <path d="M21 22h16" />
      <path d="M21 28h16" />
      <path d="M21 34h10" />
      {/* Moeda com cifrão */}
      <circle cx="44" cy="44" r="10" fill="#f1f2f4" />
      <circle cx="44" cy="44" r="10" />
      <path d="M47.5 39.5c-1-.9-2.2-1.4-3.5-1.4-2.3 0-3.5 1.2-3.5 2.6 0 1.7 1.8 2.2 3.5 2.6 1.7.4 3.5.9 3.5 2.6 0 1.4-1.2 2.6-3.5 2.6-1.6 0-2.9-.6-3.9-1.6" />
      <path d="M44 36v2.7M44 49.3V52" />
      {/* Lápis */}
      <path d="M30 38l9 9 3.5-3.5-9-9z" />
      <path d="M30 38l-2.5 6.5 6.5-2.5z" />
    </svg>
  );
  if (kind === 3) return (
    // Concepção: engrenagem + pessoa + prancheta + relógio (cluster de análise)
    <svg width={W} height={W} viewBox="0 0 64 64" fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      {/* Engrenagem grande (esquerda) */}
      <circle cx="20" cy="34" r="6.5" />
      <circle cx="20" cy="34" r="2.6" />
      <path d="M20 25.5v3M20 39.5v3M11.5 34h3M25.5 34h3M14.2 28.2l2 2M23.8 37.8l2 2M14.2 39.8l2-2M23.8 30.2l2-2" />
      {/* Pessoa (centro) */}
      <circle cx="38" cy="22" r="4" />
      <path d="M31 38c0-4 3.2-7 7-7s7 3 7 7" />
      {/* Prancheta (direita) */}
      <rect x="40" y="34" width="16" height="20" rx="1.2" />
      <path d="M44 40h8M44 45h8M44 50h5" />
      {/* Relógio pequeno (topo direito) */}
      <circle cx="51" cy="22" r="4.5" fill="#f1f2f4" />
      <circle cx="51" cy="22" r="4.5" />
      <path d="M51 19v3l2 1.4" />
    </svg>
  );
  if (kind === 4) return (
    // Fabricação: braço robótico + esteira com caixas
    <svg width={W} height={W} viewBox="0 0 64 64" fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      {/* Braço robótico */}
      <rect x="20" y="6" width="14" height="6" rx="0.6" />
      <path d="M27 12v6" />
      <path d="M27 18l-9 8" />
      <rect x="14" y="24" width="10" height="6" rx="0.6" />
      {/* Esteira */}
      <rect x="8" y="40" width="48" height="6" rx="1" />
      <circle cx="13" cy="50" r="2.5" />
      <circle cx="22" cy="50" r="2.5" />
      <circle cx="32" cy="50" r="2.5" />
      <circle cx="42" cy="50" r="2.5" />
      <circle cx="51" cy="50" r="2.5" />
      {/* Caixas em cima da esteira */}
      <rect x="18" y="32" width="8" height="8" rx="0.6" />
      <rect x="30" y="32" width="8" height="8" rx="0.6" />
      <rect x="42" y="32" width="8" height="8" rx="0.6" />
    </svg>
  );
  if (kind === 5) return (
    // Montagem: pessoa montando quebra-cabeça
    <svg width={W} height={W} viewBox="0 0 64 64" fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      {/* Pessoa silhueta */}
      <circle cx="20" cy="12" r="4" fill={C} stroke="none" />
      <path d="M14 36l2-14c.4-2.5 2-4 4-4s3.6 1.5 4 4l2 14" fill={C} stroke="none" />
      <path d="M16 36v18h3v-9h2v9h3V36" fill={C} stroke="none" />
      {/* Braço estendido segurando peça */}
      <path d="M22 24l8-4" stroke={C} strokeWidth="3.5" />
      {/* Peça de quebra-cabeça sendo encaixada (segurada) */}
      <path d="M30 16h6v3c0 1 .7 1.8 1.6 1.8s1.6-.8 1.6-1.8V16h0" fill="none" />
      <path d="M30 16v6c0 .5-.4 1-1 1s-1-.5-1-1v-3l-1-2z" fill={C} stroke="none" />
      {/* Quebra-cabeça (3 peças encaixadas à direita) */}
      <path d="M40 28h6v3c0 1 .8 1.7 1.7 1.7s1.7-.7 1.7-1.7v-3h6v6h-3c-1 0-1.7.8-1.7 1.7s.7 1.7 1.7 1.7h3v6h-6v-3c0-1-.8-1.7-1.7-1.7s-1.7.7-1.7 1.7v3h-6v-6h3c1 0 1.7-.8 1.7-1.7s-.7-1.7-1.7-1.7h-3z" />
    </svg>
  );
  return null;
}

window.EmpresaProcesso = EmpresaProcesso;
