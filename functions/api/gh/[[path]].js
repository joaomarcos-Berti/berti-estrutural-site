// Intermediario do painel /admin: o navegador manda a SENHA GERAL do painel e este codigo,
// rodando no servidor da Cloudflare, usa a chave do GitHub (guardada em segredo) para ler/gravar.
//
// Variaveis de ambiente (Cloudflare Pages > Settings > Variables and Secrets):
//   ADMIN_PASSWORD  senha geral do painel
//   GITHUB_TOKEN    chave do GitHub com permissao de escrita SO neste repositorio
//   GITHUB_REPO     (opcional) padrao: joaomarcos-Berti/berti-estrutural-site

const REPO_PADRAO = 'joaomarcos-Berti/berti-estrutural-site';

// O painel so precisa destes caminhos. Qualquer outro (ex.: .github/workflows) e recusado.
const CAMINHO_PERMITIDO = /^(content\/(obras|blog)\.json|assets\/photos\/[a-z0-9][a-z0-9._-]*)$/;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

function resposta(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });
}

async function hash(texto) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return new Uint8Array(buf);
}

async function senhaConfere(enviada, correta) {
  const a = await hash(enviada || '');
  const b = await hash(correta || '');
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function onRequest({ request, env, params }) {
  if (!env.ADMIN_PASSWORD || !env.GITHUB_TOKEN) {
    return resposta(500, { message: 'Painel ainda nao configurado no servidor (faltam ADMIN_PASSWORD e/ou GITHUB_TOKEN).' });
  }
  if (request.method !== 'GET' && request.method !== 'PUT') {
    return resposta(405, { message: 'Metodo nao permitido.' });
  }

  const enviada = request.headers.get('X-Admin-Password');
  if (!(await senhaConfere(enviada, env.ADMIN_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 1000)); // freia tentativa de adivinhar a senha
    return resposta(401, { message: 'Senha incorreta.' });
  }

  const partes = Array.isArray(params.path) ? params.path : [params.path || ''];
  let caminho;
  try { caminho = partes.map(decodeURIComponent).join('/'); } catch (e) { return resposta(400, { message: 'Caminho invalido.' }); }
  if (caminho.includes('..') || !CAMINHO_PERMITIDO.test(caminho)) {
    return resposta(403, { message: 'Caminho nao permitido.' });
  }

  const repo = env.GITHUB_REPO || REPO_PADRAO;
  const origem = new URL(request.url);
  const consulta = request.method === 'GET' ? origem.search : '';
  const url = 'https://api.github.com/repos/' + repo + '/contents/' + caminho.split('/').map(encodeURIComponent).join('/') + consulta;

  const init = {
    method: request.method,
    headers: {
      'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'berti-admin-proxy',
    },
  };
  if (request.method === 'PUT') {
    init.headers['Content-Type'] = 'application/json';
    init.body = await request.text();
  }

  const gh = await fetch(url, init);
  return new Response(await gh.text(), { status: gh.status, headers: JSON_HEADERS });
}
