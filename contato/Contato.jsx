/* global React, HOME_BRAND */
// ============================================================================
// CONTATO · canais rápidos (WhatsApp · E-mail · Formulário) + ficha + form
// O formulário monta a mensagem com os campos e abre o canal escolhido
// (WhatsApp ou e-mail) — funciona sem back-end.
// ============================================================================
const { useState } = React;

const FONE_DISPLAY = '(43) 3304-8040';
const WHATS_NUM    = '554333048040';          // ← trocar pelo nº de WhatsApp real
const EMAIL        = 'berti@eberti.com.br';
const ENDERECO     = ['Condomínio Torre Montello', 'Av. Ayrton Senna da Silva, 550 — Sala 103', 'Palhano · Londrina — PR · 86055-630'];

function ContatoPage() {
  const accent = HOME_BRAND.blue;

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{
        background: HOME_BRAND.ink, color: '#fff',
        padding: '150px clamp(40px, 8vw, 140px) 56px',
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
            Contato
          </div>
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(46px, 7vw, 104px)', lineHeight: 0.9,
            letterSpacing: '-0.02em', textTransform: 'uppercase', margin: '0 0 20px',
          }}>Vamos construir<br/><span style={{ color: accent }}>a sua obra.</span></h1>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)',
            maxWidth: 560, margin: 0,
          }}>
            Conte seu projeto pelo canal que preferir. Respondemos rápido — e já
            com um time de engenheiros pronto para orientar a melhor solução.
          </p>

          {/* Canais rápidos */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            marginTop: 48,
          }} className="contato-canais">
            <CanalCard
              kind="whatsapp" accent={accent}
              label="WhatsApp" value="Resposta imediata"
              href={`https://wa.me/${WHATS_NUM}?text=${encodeURIComponent('Olá, Berti! Gostaria de falar sobre um projeto em estrutura metálica.')}`}
            />
            <CanalCard
              kind="email" accent={accent}
              label="E-mail" value={EMAIL}
              href={`mailto:${EMAIL}?subject=${encodeURIComponent('Contato pelo site — Berti Estrutural')}`}
            />
            <CanalCard
              kind="phone" accent={accent}
              label="Telefone" value={FONE_DISPLAY}
              href="tel:+554333048040"
            />
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO + FICHA ─────────────────────────────────────────── */}
      <section style={{
        background: '#fff', color: HOME_BRAND.rule,
        padding: 'clamp(56px, 6vw, 96px) clamp(40px, 8vw, 140px) clamp(72px, 8vw, 120px)',
        fontFamily: '"Open Sans", system-ui, sans-serif',
      }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 'clamp(40px, 6vw, 88px)',
        }} className="contato-corpo">
          <ContatoForm accent={accent} />
          <ContatoFicha accent={accent} />
        </div>
      </section>

      <style>{`
        @media (max-width: 820px) {
          .contato-canais { grid-template-columns: 1fr !important; }
          .contato-corpo  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// ── Card de canal (hero) ─────────────────────────────────────────────────────
function CanalCard({ kind, label, value, href, accent }) {
  const isWhats = kind === 'whatsapp';
  return (
    <a href={href} target={isWhats ? '_blank' : undefined} rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '20px 22px', textDecoration: 'none',
      background: isWhats ? accent : 'transparent',
      border: `1px solid ${isWhats ? accent : 'rgba(255,255,255,0.2)'}`,
      color: isWhats ? '#05080c' : '#fff',
      transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; if (!isWhats) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = 'rgba(71,182,241,0.08)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (!isWhats) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent'; } }}
    >
      <span style={{
        width: 48, height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isWhats ? 'rgba(5,8,12,0.12)' : 'rgba(71,182,241,0.12)',
        border: isWhats ? '1px solid rgba(5,8,12,0.2)' : `1px solid ${accent}`,
        color: isWhats ? '#05080c' : accent,
      }}><ContatoIcon kind={kind} /></span>
      <span>
        <span style={{
          display: 'block', fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 19, fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1,
        }}>{label}</span>
        <span style={{
          display: 'block', fontSize: 13.5, marginTop: 4,
          color: isWhats ? 'rgba(5,8,12,0.7)' : 'rgba(255,255,255,0.7)',
        }}>{value}</span>
      </span>
    </a>
  );
}

// ── Formulário ────────────────────────────────────────────────────────────
function ContatoForm({ accent }) {
  const [channel, setChannel] = useState('whatsapp');
  const [f, setF] = useState({ nome: '', email: '', tel: '', seg: 'Comercial', msg: '' });
  const [err, setErr] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.nome.trim() || !f.msg.trim() || (channel === 'email' && !f.email.trim())) { setErr(true); return; }
    setErr(false);
    const texto =
      `Olá, Berti! Meu nome é ${f.nome}.\n` +
      `Segmento: ${f.seg}\n` +
      (f.email ? `E-mail: ${f.email}\n` : '') +
      (f.tel ? `Telefone: ${f.tel}\n` : '') +
      `\n${f.msg}`;
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${WHATS_NUM}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Contato pelo site — ' + f.nome)}&body=${encodeURIComponent(texto)}`;
    }
  };

  const field = {
    width: '100%', padding: '14px 16px', fontSize: 15,
    fontFamily: '"Open Sans", system-ui, sans-serif',
    border: '1px solid rgba(10,10,10,0.18)', background: '#fff', color: HOME_BRAND.ink,
    outline: 'none', transition: 'border-color 160ms ease',
  };
  const label = {
    display: 'block', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
    fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'rgba(10,10,10,0.6)', marginBottom: 8,
  };
  const focus = (e) => { e.target.style.borderColor = accent; };
  const blur  = (e) => { e.target.style.borderColor = 'rgba(10,10,10,0.18)'; };

  return (
    <div>
      <h2 style={{
        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
        fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1, letterSpacing: '-0.01em',
        color: HOME_BRAND.ink, margin: '0 0 10px', textTransform: 'uppercase',
      }}>Envie pelo site</h2>
      <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(10,10,10,0.6)', margin: '0 0 28px' }}>
        Preencha os campos e escolha como prefere enviar. Montamos a mensagem para você.
      </p>

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label style={label}>Nome *</label>
            <input style={field} value={f.nome} onChange={set('nome')} onFocus={focus} onBlur={blur} placeholder="Seu nome" />
          </div>
          <div>
            <label style={label}>Segmento</label>
            <select style={field} value={f.seg} onChange={set('seg')} onFocus={focus} onBlur={blur}>
              <option>Comercial</option>
              <option>Mercado / Supermercado</option>
              <option>Industrial</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label style={label}>E-mail {channel === 'email' ? '*' : ''}</label>
            <input style={field} type="email" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} placeholder="voce@email.com" />
          </div>
          <div>
            <label style={label}>Telefone</label>
            <input style={field} value={f.tel} onChange={set('tel')} onFocus={focus} onBlur={blur} placeholder="(00) 00000-0000" />
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={label}>Mensagem *</label>
          <textarea style={{ ...field, resize: 'vertical', minHeight: 130 }} value={f.msg} onChange={set('msg')} onFocus={focus} onBlur={blur} placeholder="Conte sobre seu projeto: tipo de obra, área aproximada, prazo..." />
        </div>

        {/* Escolha de canal */}
        <div style={{ marginBottom: 22 }}>
          <label style={label}>Enviar por</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ k: 'whatsapp', t: 'WhatsApp' }, { k: 'email', t: 'E-mail' }].map((c) => {
              const on = channel === c.k;
              return (
                <button type="button" key={c.k} onClick={() => setChannel(c.k)} style={{
                  flex: 1, padding: '12px 14px', cursor: 'pointer',
                  border: `1px solid ${on ? HOME_BRAND.ink : 'rgba(10,10,10,0.18)'}`,
                  background: on ? HOME_BRAND.ink : 'transparent',
                  color: on ? '#fff' : 'rgba(10,10,10,0.7)',
                  fontFamily: '"Barlow Condensed", sans-serif', fontSize: 16, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 160ms ease',
                }}>
                  <ContatoIcon kind={c.k} small color={on ? '#fff' : 'rgba(10,10,10,0.55)'} />
                  {c.t}
                </button>
              );
            })}
          </div>
        </div>

        {err && (
          <div style={{
            fontSize: 13.5, color: '#b3261e', marginBottom: 16, fontWeight: 600,
          }}>Preencha pelo menos nome, mensagem{channel === 'email' ? ' e e-mail' : ''}.</div>
        )}

        <button type="submit" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: accent, color: '#000', border: 'none', cursor: 'pointer',
          padding: '16px 32px', fontSize: 13, fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          fontFamily: '"Open Sans", system-ui, sans-serif',
          transition: 'background 180ms ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = HOME_BRAND.blueDark}
          onMouseLeave={(e) => e.currentTarget.style.background = accent}
        >Enviar mensagem <span>→</span></button>
      </form>
    </div>
  );
}

// ── Ficha lateral ───────────────────────────────────────────────────────────
function ContatoFicha({ accent }) {
  const social = [
    { name: 'Instagram', url: 'https://www.instagram.com/bertiestrutural/', icon: 'instagram' },
    { name: 'Facebook',  url: 'https://www.facebook.com/bertiengenharia/',  icon: 'facebook' },
    { name: 'LinkedIn',  url: 'https://br.linkedin.com/company/berti-estrutural-engenharia', icon: 'linkedin' },
    { name: 'YouTube',   url: 'https://www.youtube.com/@Bertiestruturalengenharia', icon: 'youtube' },
  ];
  const block = { marginBottom: 30 };
  const cap = {
    fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
    fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: accent, marginBottom: 10,
  };
  return (
    <div style={{ background: HOME_BRAND.ink, color: '#fff', padding: 'clamp(28px, 3vw, 44px)' }}>
      <h3 style={{
        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
        fontSize: 26, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.01em',
        margin: '0 0 28px',
      }}>Onde nos encontrar</h3>

      <div style={block}>
        <div style={cap}>Endereço</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>
          {ENDERECO.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>

      <div style={block}>
        <div style={cap}>Telefone</div>
        <a href="tel:+554333048040" style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 24,
          color: '#fff', textDecoration: 'none', letterSpacing: '0.02em',
        }}>{FONE_DISPLAY}</a>
      </div>

      <div style={block}>
        <div style={cap}>E-mail</div>
        <a href={`mailto:${EMAIL}`} style={{
          fontSize: 15, color: 'rgba(255,255,255,0.82)', textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: 2,
        }}>{EMAIL}</a>
      </div>

      <div style={block}>
        <div style={cap}>Atendimento</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>
          Segunda a sexta · 8h às 18h
        </div>
      </div>

      <div>
        <div style={cap}>Redes sociais</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {social.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} style={{
              width: 42, height: 42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)',
              transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            ><ContatoSocial kind={s.icon} /></a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Ícones ──────────────────────────────────────────────────────────────────
function ContatoIcon({ kind, small, color }) {
  const sz = small ? 16 : 22;
  const st = { width: sz, height: sz, fill: 'none', stroke: color || 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'whatsapp') return (
    <svg viewBox="0 0 24 24" width={sz} height={sz} fill={color || 'currentColor'}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.6-5.9c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.6 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z"/>
    </svg>
  );
  if (kind === 'email') return (
    <svg viewBox="0 0 24 24" {...st}><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M4 7l8 6 8-6"/></svg>
  );
  if (kind === 'phone') return (
    <svg viewBox="0 0 24 24" {...st}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
  );
  return null;
}

function ContatoSocial({ kind }) {
  const s = { width: 18, height: 18, fill: 'currentColor' };
  if (kind === 'instagram') return (<svg viewBox="0 0 24 24" {...s}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0z"/><path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>);
  if (kind === 'facebook') return (<svg viewBox="0 0 24 24" {...s}><path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69V11.1h3.13V8.41c0-3.1 1.9-4.79 4.66-4.79 1.32 0 2.46.1 2.8.14v3.24h-1.92c-1.5 0-1.8.72-1.8 1.77V11.1h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z"/></svg>);
  if (kind === 'linkedin') return (<svg viewBox="0 0 24 24" {...s}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.84c3.6 0 4.26 2.37 4.26 5.45v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.31a2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>);
  if (kind === 'youtube') return (<svg viewBox="0 0 24 24" {...s}><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8zM9.6 15.6V8.4l6.24 3.6L9.6 15.6z"/></svg>);
  return null;
}

window.ContatoPage = ContatoPage;
