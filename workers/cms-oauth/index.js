/**
 * Cloudflare Worker — GitHub OAuth proxy para Decap CMS
 *
 * Variáveis de ambiente necessárias (configure em Workers > Settings > Variables):
 *   GITHUB_CLIENT_ID     — Client ID do seu GitHub OAuth App
 *   GITHUB_CLIENT_SECRET — Client Secret do seu GitHub OAuth App
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS (necessário para o popup do Decap CMS)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── Passo 1: redireciona o usuário para o GitHub ──
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        state: crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    // ── Passo 2: GitHub redireciona de volta com o código ──
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return new Response('Parâmetro "code" ausente.', { status: 400 });
      }

      // Troca o código pelo access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.error) {
        return new Response(
          `Erro de autenticação: ${tokenData.error_description}`,
          { status: 400 }
        );
      }

      // Envia o token de volta para o Decap CMS via postMessage
      const message = JSON.stringify({
        token: tokenData.access_token,
        provider: 'github',
      });

      const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/></head>
<body>
<script>
(function () {
  var msg = "authorization:github:success:" + ${JSON.stringify(message)};
  function receiveMessage(e) {
    window.opener.postMessage(msg, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
<p>Autenticado! Pode fechar esta janela.</p>
</body>
</html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
