# ============================================================================
# Berti Estrutural — Gerador de site estático (zero-dependência, PowerShell)
# Lê content/*.json e gera HTML completo (conteúdo no HTML, pronto p/ Google/IA).
# Uso:  powershell -ExecutionPolicy Bypass -File build.ps1
# ============================================================================
$ErrorActionPreference = 'Stop'
$SITE = 'https://www.bertiestrutural.com.br'
$root = if (Test-Path (Join-Path $PSScriptRoot 'content')) { $PSScriptRoot } else { Join-Path $PSScriptRoot 'repo' }
$enc  = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sem BOM

# ---- helpers ----------------------------------------------------------------
function HtmlEnc([string]$s){ if($null -eq $s){return ''}; $s -replace '&','&amp;' -replace '<','&lt;' -replace '>','&gt;' }
function AttrEnc([string]$s){ (HtmlEnc $s) -replace '"','&quot;' }
function JsonStr([string]$s){ if($null -eq $s){return ''}; $s -replace '\\','\\' -replace '"','\"' -replace "`r",'' -replace "`n",' ' }
function Fill([string]$tpl,[hashtable]$map){ foreach($k in $map.Keys){ $tpl = $tpl.Replace('{{'+$k+'}}', [string]$map[$k]) }; $tpl }
function Slug([string]$s){
  if($null -eq $s){ return '' }
  $n = $s.Normalize([System.Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  foreach($ch in $n.ToCharArray()){
    if([System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [System.Globalization.UnicodeCategory]::NonSpacingMark){ [void]$sb.Append($ch) }
  }
  $r = [regex]::Replace($sb.ToString().ToLowerInvariant(), '[^a-z0-9]+', '-')
  return $r.Trim('-')
}

$months = @{'jan'='01';'fev'='02';'mar'='03';'abr'='04';'mai'='05';'jun'='06';'jul'='07';'ago'='08';'set'='09';'out'='10';'nov'='11';'dez'='12'}
function IsoDate([string]$d){
  if($d -match '(\d{1,2})\s+([A-Za-zçÇ]+)\.?\s+(\d{4})'){
    $day = '{0:00}' -f [int]$Matches[1]
    $key = $Matches[2].ToLower(); if($key.Length -gt 3){ $key = $key.Substring(0,3) }
    $mo = $months[$key]; $yr = $Matches[3]
    if($mo){ return "$yr-$mo-$day" }
  }
  return ''
}

# Converte o corpo do artigo (texto com marcadores [img:...]) em HTML.
# Corrige o bug: reconhece [img:...] mesmo grudado em texto.
function BodyHtml([string]$body,[string]$alt){
  if($null -eq $body){ return '' }
  $body = $body -replace "`r",''
  $parts = [regex]::Split($body, '\[img:(.+?)\]')   # captura: alterna texto / caminho
  $out = New-Object System.Text.StringBuilder
  for($i=0; $i -lt $parts.Count; $i++){
    if($i % 2 -eq 1){
      $src = $parts[$i].Trim()
      [void]$out.Append("<figure><img src=`"/$($src)`" alt=`"$(AttrEnc $alt)`" loading=`"lazy`" /></figure>`n")
    } else {
      $seg = $parts[$i]
      foreach($par in ($seg -split "`n{2,}")){
        $t = $par.Trim()
        if($t -ne ''){ [void]$out.Append("<p>$(HtmlEnc $t)</p>`n") }
      }
    }
  }
  $out.ToString()
}

# ---- CSS / chrome compartilhado --------------------------------------------
$CSS = @'
  :root{ --blue:#47b6f1; --blue-dark:#077fbf; --ink:#111418; }
  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; background:#fff; color:#1a1a1a; font-family:'Open Sans',system-ui,sans-serif; scroll-behavior:smooth; }
  ::selection{ background:var(--blue); color:#000; }
  a{ color:inherit; } img{ max-width:100%; }
  .nav{ position:fixed; top:0; left:0; right:0; z-index:100; color:#fff; display:flex; align-items:center; justify-content:space-between; padding:18px 64px; background:transparent; border-bottom:1px solid transparent; transition:background 240ms ease, border-color 240ms ease; }
  .nav.solid{ background:rgba(8,10,12,0.96); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border-bottom:1px solid rgba(255,255,255,0.06); }
  .nav__logo{ display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
  .nav__logo img{ height:44px; display:block; flex-shrink:0; }
  .nav__wordmark{ display:inline-block; overflow:hidden; white-space:nowrap; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:22px; letter-spacing:0.05em; text-transform:uppercase; color:#fff; line-height:1; width:0; opacity:0; margin-left:0; transition:width 280ms ease, opacity 220ms ease 60ms, margin-left 280ms ease; }
  .nav__wordmark b{ color:var(--blue); }
  .nav__logo:hover .nav__wordmark{ width:215px; opacity:1; margin-left:14px; }
  .nav__links{ display:flex; gap:36px; font-size:12.5px; letter-spacing:0.12em; text-transform:uppercase; }
  .nav__links a{ color:rgba(255,255,255,0.82); text-decoration:none; transition:color 180ms ease; }
  .nav__links a:hover{ color:#fff; }
  .nav__cta{ background:var(--blue); color:#000; padding:10px 20px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.14em; text-decoration:none; transition:background 180ms ease; }
  .nav__cta:hover{ background:#fff; }
  .nav__burger{ display:none; background:none; border:none; cursor:pointer; width:40px; height:40px; flex-direction:column; justify-content:center; align-items:center; gap:5px; padding:8px; }
  .nav__burger span{ display:block; width:24px; height:2px; background:#fff; transition:.25s ease; }
  .nav__mobile{ display:none; position:absolute; top:100%; left:0; right:0; background:rgba(8,10,12,0.98); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.08); padding:20px 20px 28px; flex-direction:column; gap:4px; }
  .nav__mobile a{ color:rgba(255,255,255,0.85); text-decoration:none; font-size:16px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
  .nav__mobile .nav__cta{ text-align:center; margin-top:16px; padding:16px 24px; font-size:13px; }
  @media(max-width:900px){
    .nav{ padding:14px 20px; } .nav__logo img{ height:36px; }
    .nav__wordmark{ width:auto !important; opacity:1 !important; margin-left:12px !important; font-size:19px; }
    .nav__links{ display:none; } .nav__burger{ display:flex; }
    .nav.open .nav__mobile{ display:flex; }
    .nav.open .nav__burger span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
    .nav.open .nav__burger span:nth-child(2){ opacity:0; }
    .nav.open .nav__burger span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
  }
  .ft{ background:#050607; color:rgba(255,255,255,0.62); padding:64px clamp(24px,8vw,140px) 28px; border-top:1px solid rgba(255,255,255,0.06); font-size:13.5px; }
  .ft__grid{ display:grid; grid-template-columns:2.2fr 1fr 1fr 1.4fr; gap:48px; margin-bottom:48px; }
  .ft__cap{ color:var(--blue); font-size:11px; letter-spacing:0.16em; text-transform:uppercase; font-weight:700; margin-bottom:14px; }
  .ft__brand{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:22px; color:#fff; margin-top:18px; line-height:1.2; text-transform:uppercase; }
  .ft a{ color:rgba(255,255,255,0.7); text-decoration:none; display:block; padding:5px 0; }
  .ft a:hover{ color:#fff; }
  .ft__phone{ color:#fff !important; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:22px; padding:0 !important; }
  .ft__bottom{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:11.5px; opacity:0.6; border-top:1px solid rgba(255,255,255,0.08); padding-top:24px; letter-spacing:0.04em; }
  @media(max-width:820px){ .ft__grid{ grid-template-columns:1fr; gap:30px; } .ft__bottom{ flex-direction:column; } }
'@

$NAV = @'
<header class="nav" id="nav">
  <a class="nav__logo" href="/"><img src="/assets/logo-be-mark.png" alt="Berti Estrutural" /><span class="nav__wordmark">BERTI <b>ESTRUTURAL</b></span></a>
  <nav class="nav__links">
    <a href="/">Home</a><a href="/empresa">Empresa</a><a href="/obras">Obras</a><a href="/blog">Blog</a><a href="/contato">Contato</a>
    <a class="nav__cta" href="/contato">Solicitar Orçamento</a>
  </nav>
  <button class="nav__burger" id="burger" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  <div class="nav__mobile">
    <a href="/">Home</a><a href="/empresa">Empresa</a><a href="/obras">Obras</a><a href="/blog">Blog</a><a href="/contato">Contato</a>
    <a class="nav__cta" href="/contato">Solicitar Orçamento</a>
  </div>
</header>
'@

$FOOTER = @'
<footer class="ft">
  <div class="ft__grid">
    <div>
      <img src="/assets/logo-be-mark.png" alt="Berti Estrutural" style="height:72px;display:block" />
      <div class="ft__brand">A estrutura por trás<br/>de grandes obras.</div>
      <div style="margin-top:24px;line-height:1.65">
        <div class="ft__cap">Endereço</div>
        Condomínio Torre Montello<br/>Av. Ayrton Senna da Silva, 550 — Sala 103<br/>Palhano · Londrina — PR · 86055-630
      </div>
    </div>
    <div>
      <div class="ft__cap">Navegação</div>
      <a href="/">Home</a><a href="/empresa">Empresa</a><a href="/obras">Obras</a><a href="/blog">Blog</a><a href="/contato">Contato</a>
    </div>
    <div>
      <div class="ft__cap">Segmentos</div>
      <a href="/obras">Supermercados</a><a href="/obras">Comercial</a><a href="/obras">Industrial</a>
    </div>
    <div>
      <div class="ft__cap">Contato</div>
      <a class="ft__phone" href="tel:+554333048040">(43) 3304-8040</a>
      <a href="mailto:berti@eberti.com.br" style="border-bottom:1px solid rgba(255,255,255,0.2);display:inline-block;padding-bottom:2px">berti@eberti.com.br</a>
    </div>
  </div>
  <div class="ft__bottom">
    <span>© 2026 Berti Estrutural Engenharia Ltda · CNPJ 10.835.867/0001-10</span>
    <span>Londrina · PR · Brasil</span>
  </div>
</footer>
<script>
(function(){var n=document.getElementById('nav'),b=document.getElementById('burger');
 if(!n)return;var s=function(){if(window.scrollY>60)n.classList.add('solid');else n.classList.remove('solid');};
 window.addEventListener('scroll',s,{passive:true});s();
 if(b)b.addEventListener('click',function(){var o=n.classList.toggle('open');n.classList.add('solid');b.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');});})();
</script>
'@

$FAVICON = @'
<link rel="icon" type="image/png" sizes="32x32" href="/arquivos%20site/favicons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/arquivos%20site/favicons/android-chrome-192x192.png" />
<link rel="apple-touch-icon" href="/arquivos%20site/favicons/android-chrome-192x192.png" />
<meta name="theme-color" content="#111418" />
'@

$FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />'

# ---- template de PÁGINA (shell) --------------------------------------------
$PAGE = @'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{{TITLE}}</title>
<meta name="description" content="{{DESC}}" />
<link rel="canonical" href="{{CANON}}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta property="og:type" content="{{OGTYPE}}" />
<meta property="og:site_name" content="Berti Estrutural" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:title" content="{{OGTITLE}}" />
<meta property="og:description" content="{{DESC}}" />
<meta property="og:url" content="{{CANON}}" />
<meta property="og:image" content="{{OGIMG}}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{OGTITLE}}" />
<meta name="twitter:description" content="{{DESC}}" />
<meta name="twitter:image" content="{{OGIMG}}" />
{{FAVICON}}
{{FONTS}}
{{EXTRAHEAD}}
<style>{{CSS}}</style>
</head>
<body>
{{NAV}}
{{MAIN}}
{{FOOTER}}
</body>
</html>
'@

function RenderPage([hashtable]$o){
  $ogtype  = if($o.ContainsKey('ogtype')){ $o.ogtype } else { 'website' }
  $ogtitle = if($o.ContainsKey('ogtitle')){ $o.ogtitle } else { $o.title }
  $extra   = if($o.ContainsKey('extrahead')){ $o.extrahead } else { '' }
  Fill $PAGE @{
    TITLE=(AttrEnc $o.title); DESC=(AttrEnc $o.desc); CANON=$o.canon; OGTYPE=(AttrEnc $ogtype);
    OGTITLE=(AttrEnc $ogtitle); OGIMG=$o.ogimg;
    FAVICON=$FAVICON; FONTS=$FONTS; EXTRAHEAD=$extra; CSS=$CSS; NAV=$NAV; MAIN=$o.main; FOOTER=$FOOTER
  }
}

# ============================================================================
# BLOG
# ============================================================================
$blog = Get-Content (Join-Path $root 'content/blog.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = $blog.posts
$count = 0

# ---- CSS extra do artigo + índice ----
$BLOG_CSS = @'
<style>
  .art{ max-width:820px; margin:0 auto; background:#fff; }
  .art__cover{ position:relative; height:clamp(280px,46vh,440px); background:#000; }
  .art__cover img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
  .art__badge{ position:absolute; top:90px; left:18px; background:var(--blue); color:#05080c; font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; padding:6px 12px; }
  .art__body{ padding:clamp(28px,5vw,60px); }
  .art__meta{ display:flex; gap:14px; align-items:center; flex-wrap:wrap; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue-dark); margin-bottom:18px; }
  .art__meta .dot{ color:rgba(10,10,10,0.25); }
  .art h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(30px,4vw,46px); line-height:1.0; letter-spacing:-0.01em; color:var(--ink); margin:0 0 28px; text-wrap:balance; }
  .art__rule{ width:56px; height:3px; background:var(--blue); margin-bottom:32px; }
  .art p{ font-size:17.5px; line-height:1.72; color:rgba(10,10,10,0.82); margin:0 0 22px; text-wrap:pretty; }
  .art figure{ margin:8px 0 26px; }
  .art figure img{ width:100%; max-height:520px; object-fit:cover; display:block; }
  .art__cta{ margin-top:36px; padding-top:28px; border-top:1px solid rgba(10,10,10,0.1); display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; }
  .art__cta strong{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:22px; color:var(--ink); text-transform:uppercase; line-height:1.1; }
  .art__cta a{ display:inline-flex; align-items:center; gap:10px; background:var(--blue); color:#000; padding:14px 26px; font-size:12.5px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; }
  .art__back{ display:inline-flex; gap:8px; margin-top:28px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:var(--blue-dark); text-decoration:none; }
  .bhero{ background:var(--ink); color:#fff; padding:150px clamp(40px,8vw,140px) 60px; }
  .bhero .kick{ display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:13px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; margin-bottom:18px; }
  .bhero .kick span{ width:30px; height:1px; background:var(--blue); }
  .bhero h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(46px,7vw,104px); line-height:0.9; letter-spacing:-0.02em; text-transform:uppercase; margin:0 0 20px; }
  .bhero p{ font-size:18px; line-height:1.6; color:rgba(255,255,255,0.7); max-width:560px; margin:0; }
  .bwrap{ background:#fff; padding:clamp(48px,6vw,88px) clamp(40px,8vw,140px) clamp(72px,8vw,120px); }
  .bwrap .inner{ max-width:1240px; margin:0 auto; }
  .bfeat{ display:grid; grid-template-columns:1.25fr 1fr; cursor:pointer; margin-bottom:56px; border:1px solid rgba(10,10,10,0.1); text-decoration:none; color:inherit; transition:box-shadow 280ms ease; }
  .bfeat:hover{ box-shadow:0 28px 60px -28px rgba(7,61,87,0.32); }
  .bfeat__img{ position:relative; overflow:hidden; min-height:360px; background:#000; }
  .bfeat__img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .bfeat__tag{ position:absolute; top:18px; left:18px; background:var(--blue); color:#05080c; font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; padding:6px 12px; }
  .bfeat__body{ padding:clamp(28px,3vw,48px); display:flex; flex-direction:column; justify-content:center; }
  .bmeta{ display:flex; gap:14px; align-items:center; flex-wrap:wrap; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue-dark); margin-bottom:16px; }
  .bmeta .dot{ color:rgba(10,10,10,0.25); }
  .bfeat__body h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(26px,2.6vw,36px); line-height:1.06; color:var(--ink); margin:0 0 16px; text-wrap:balance; }
  .bfeat__body p{ font-size:16px; line-height:1.62; color:rgba(10,10,10,0.66); margin:0 0 24px; }
  .blink{ display:inline-flex; align-items:center; gap:9px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); }
  .blink span{ color:var(--blue); }
  .bfilter{ display:flex; flex-wrap:wrap; gap:10px; padding-bottom:28px; margin-bottom:40px; border-bottom:1px solid rgba(10,10,10,0.1); }
  .bfilter button{ padding:9px 18px; cursor:pointer; border:1px solid rgba(10,10,10,0.18); background:transparent; color:rgba(10,10,10,0.7); font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; transition:all 180ms ease; }
  .bfilter button.on{ border-color:var(--ink); background:var(--ink); color:#fff; }
  .bgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
  .bcard{ background:#fff; border:1px solid rgba(10,10,10,0.1); display:flex; flex-direction:column; text-decoration:none; color:inherit; transition:box-shadow 260ms ease, transform 260ms ease; }
  .bcard:hover{ transform:translateY(-5px); box-shadow:0 24px 50px -26px rgba(7,61,87,0.3); }
  .bcard__img{ position:relative; height:200px; overflow:hidden; background:#000; }
  .bcard__img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .bcard__tag{ position:absolute; top:14px; left:14px; background:rgba(4,8,12,0.72); color:var(--blue); font-family:'Barlow Condensed',sans-serif; font-size:11.5px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; padding:5px 10px; }
  .bcard__body{ padding:24px 24px 26px; display:flex; flex-direction:column; flex:1; }
  .bcard__body h3{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:23px; line-height:1.04; color:var(--ink); margin:0 0 12px; text-wrap:balance; }
  .bcard__body p{ font-size:14.5px; line-height:1.6; color:rgba(10,10,10,0.62); margin:0 0 20px; }
  .bcard .blink{ margin-top:auto; font-size:13px; }
  @media(max-width:1000px){ .bgrid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:820px){ .bfeat{ grid-template-columns:1fr; } .bfeat__img{ min-height:240px; } }
  @media(max-width:620px){ .bgrid{ grid-template-columns:1fr; } }
</style>
'@

# ---- gera cada ARTIGO ----
foreach($p in $posts){
  $iso = IsoDate $p.date
  $canon = "$SITE/blog/$($p.id)"
  $ogimg = "$SITE/$($p.cover)"
  $jsonld = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting","headline":"$(JsonStr $p.title)","description":"$(JsonStr $p.excerpt)","image":"$ogimg","datePublished":"$iso","dateModified":"$iso","articleSection":"$(JsonStr $p.catLabel)","inLanguage":"pt-BR","author":{"@type":"Organization","name":"Berti Estrutural"},"publisher":{"@type":"Organization","name":"Berti Estrutural","logo":{"@type":"ImageObject","url":"$SITE/assets/logo-be-mark.png"}},"mainEntityOfPage":{"@type":"WebPage","@id":"$canon"}}
</script>
"@
  $main = @"
<main>
  <article class="art">
    <div class="art__cover">
      <img src="/$($p.cover)" alt="$(AttrEnc $p.title)" />
      <span class="art__badge">$(HtmlEnc $p.catLabel)</span>
    </div>
    <div class="art__body">
      <div class="art__meta"><span>$(HtmlEnc $p.date)</span><span class="dot">•</span><span>$(HtmlEnc $p.read) de leitura</span><span class="dot">•</span><span>$(HtmlEnc $p.author)</span></div>
      <h1>$(HtmlEnc $p.title)</h1>
      <div class="art__rule"></div>
      $(BodyHtml $p.body "$($p.catLabel) — Berti Estrutural")
      <div class="art__cta"><strong>Tem um projeto em mente?</strong><a href="/contato">Falar com a Berti <span>&rarr;</span></a></div>
      <a class="art__back" href="/blog">&larr; Voltar ao blog</a>
    </div>
  </article>
</main>
"@
  $html = RenderPage @{ title="$($p.title) — Berti Estrutural"; desc=$p.excerpt; canon=$canon; ogtype='article'; ogtitle=$p.title; ogimg=$ogimg; extrahead=($jsonld + $BLOG_CSS); main=$main }
  [System.IO.File]::WriteAllText((Join-Path $root "blog/$($p.id).html"), $html, $enc)
  $count++
}

# ---- gera o ÍNDICE do blog ----
$feat = $posts | Where-Object { $_.featured } | Select-Object -First 1
if(-not $feat){ $feat = $posts[0] }
$rest = $posts | Where-Object { $_.id -ne $feat.id }

$cardsHtml = New-Object System.Text.StringBuilder
foreach($p in $rest){
  [void]$cardsHtml.Append(@"
<a class="bcard" data-cat="$($p.cat)" href="/blog/$($p.id)">
  <div class="bcard__img"><img src="/$($p.cover)" alt="$(AttrEnc $p.title)" loading="lazy" /><span class="bcard__tag">$(HtmlEnc $p.catLabel)</span></div>
  <div class="bcard__body"><div class="bmeta"><span>$(HtmlEnc $p.date)</span><span class="dot">•</span><span>$(HtmlEnc $p.read)</span></div>
  <h3>$(HtmlEnc $p.title)</h3><p>$(HtmlEnc $p.excerpt)</p><span class="blink">Ler artigo <span>&rarr;</span></span></div>
</a>
"@)
}
$filterBtns = New-Object System.Text.StringBuilder
foreach($c in $blog.cats){
  $on = if($c.key -eq 'todas'){' on'}else{''}
  [void]$filterBtns.Append("<button class=`"$on`" data-f=`"$($c.key)`">$(HtmlEnc $c.label)</button>")
}
$blogJsonld = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Blog","name":"Blog — Berti Estrutural","url":"$SITE/blog","inLanguage":"pt-BR","publisher":{"@type":"Organization","name":"Berti Estrutural"}}
</script>
"@
$indexMain = @"
<main>
  <section class="bhero">
    <div style="max-width:1240px;margin:0 auto">
      <div class="kick"><span></span>Blog · Conhecimento em aço</div>
      <h1>A engenharia<br/><span style="color:var(--blue)">por escrito.</span></h1>
      <p>Artigos práticos sobre estruturas metálicas, tecnologia BIM, materiais e gestão de obra — direto de quem projeta, fabrica e monta.</p>
    </div>
  </section>
  <section class="bwrap"><div class="inner">
    <a class="bfeat" href="/blog/$($feat.id)">
      <div class="bfeat__img"><img src="/$($feat.cover)" alt="$(AttrEnc $feat.title)" /><span class="bfeat__tag">Destaque</span></div>
      <div class="bfeat__body">
        <div class="bmeta"><span>$(HtmlEnc $feat.catLabel)</span><span class="dot">•</span><span>$(HtmlEnc $feat.date)</span><span class="dot">•</span><span>$(HtmlEnc $feat.read)</span></div>
        <h2>$(HtmlEnc $feat.title)</h2><p>$(HtmlEnc $feat.excerpt)</p><span class="blink">Ler artigo <span>&rarr;</span></span>
      </div>
    </a>
    <div class="bfilter">$($filterBtns.ToString())</div>
    <div class="bgrid" id="bgrid">$($cardsHtml.ToString())</div>
  </div></section>
</main>
<script>
(function(){var btns=document.querySelectorAll('.bfilter button'),cards=document.querySelectorAll('#bgrid .bcard');
 btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('on')});b.classList.add('on');
   var f=b.getAttribute('data-f');cards.forEach(function(c){c.style.display=(f==='todas'||c.getAttribute('data-cat')===f)?'':'none';});});});})();
</script>
"@
$indexHtml = RenderPage @{ title='Blog — Berti Estrutural'; desc='Artigos sobre estruturas metálicas, tecnologia BIM, materiais e gestão de obra — de quem projeta, fabrica e monta.'; canon="$SITE/blog"; ogtype='website'; ogtitle='Blog — Berti Estrutural'; ogimg="$SITE/assets/photos/interior-truss.jpg"; extrahead=($blogJsonld + $BLOG_CSS); main=$indexMain }
[System.IO.File]::WriteAllText((Join-Path $root 'blog.html'), $indexHtml, $enc)

Write-Output "Blog gerado: $count artigos + indice (blog.html)"

# ============================================================================
# OBRAS
# ============================================================================
$obrasData = Get-Content (Join-Path $root 'content/obras.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$obras = $obrasData.obras
$ocount = 0

# slug unico por obra (dedup)
$used = @{}
foreach($o in $obras){
  $s = Slug $o.title
  if($s -eq ''){ $s = 'obra' }
  if($used.ContainsKey($s)){ $used[$s]++; $s = "$s-$($used[$s])" } else { $used[$s] = 1 }
  $o | Add-Member -NotePropertyName _slug -NotePropertyValue $s -Force
}

$OBRAS_CSS = @'
<style>
  .ohero{ position:relative; background:var(--ink); color:#fff; padding:160px clamp(40px,8vw,140px) 56px; overflow:hidden; }
  .ohero__bg{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.14; }
  .ohero__sh{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(17,20,24,0.7),rgba(17,20,24,0.95)); }
  .ohero__in{ position:relative; max-width:1340px; margin:0 auto; }
  .kick{ display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:13px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; margin-bottom:18px; }
  .kick span{ width:30px; height:1px; background:var(--blue); }
  .ohero h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(48px,8vw,120px); line-height:0.88; letter-spacing:-0.02em; text-transform:uppercase; margin:0 0 20px; }
  .ohero p{ font-size:18px; line-height:1.6; color:rgba(255,255,255,0.7); max-width:560px; margin:0; }
  .ofilter{ position:sticky; top:0; z-index:50; background:rgba(8,10,12,0.92); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border-bottom:1px solid rgba(255,255,255,0.08); padding:16px clamp(40px,8vw,140px); }
  .ofilter .in{ max-width:1340px; margin:0 auto; display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .ofilter button{ display:inline-flex; align-items:center; gap:9px; padding:11px 20px; cursor:pointer; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.82); font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; transition:all 200ms ease; }
  .ofilter button.on{ border-color:var(--blue); background:var(--blue); color:#05080c; }
  .ofilter button .n{ font-size:11px; font-family:'Open Sans',sans-serif; font-weight:700; padding:2px 7px; border-radius:20px; background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.7); }
  .ofilter button.on .n{ background:rgba(5,8,12,0.18); color:#05080c; }
  .ofilter .amd{ margin-left:auto; border-color:rgba(71,182,241,0.5); color:var(--blue); }
  .owrap{ background:var(--ink); padding:clamp(28px,4vw,56px) clamp(40px,8vw,140px) clamp(72px,8vw,120px); }
  .ogrid{ max-width:1340px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .ocard{ position:relative; aspect-ratio:4/3; overflow:hidden; background:#05080c; color:#fff; text-decoration:none; display:block; }
  .ocard img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 760ms cubic-bezier(.2,.8,.2,1); }
  .ocard:hover img{ transform:scale(1.07); }
  .ocard__sh{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,0.82) 100%); }
  .ocard__ov{ position:absolute; inset:0; opacity:0; background:linear-gradient(180deg,rgba(7,127,191,0.12) 0%,rgba(7,127,191,0.32) 100%); transition:opacity 320ms ease; }
  .ocard:hover .ocard__ov{ opacity:1; }
  .ocard__go{ margin-top:12px; opacity:0; transform:translateY(8px); transition:opacity 300ms ease, transform 300ms ease; display:inline-flex; align-items:center; gap:8px; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:var(--blue); }
  .ocard:hover .ocard__go{ opacity:1; transform:translateY(0); }
  .ocard__top{ position:absolute; top:16px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .ocard__seg{ font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; background:rgba(4,8,12,0.62); color:var(--blue); padding:5px 10px; }
  .ocard__st{ font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#fff; display:inline-flex; align-items:center; gap:6px; }
  .ocard__st i{ width:7px; height:7px; border-radius:50%; background:currentColor; display:inline-block; }
  .ocard__bot{ position:absolute; left:18px; right:18px; bottom:16px; }
  .ocard__bot h3{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:26px; line-height:0.98; letter-spacing:-0.01em; text-transform:uppercase; margin:0 0 6px; }
  .ocard__bot .m{ font-size:12.5px; color:rgba(255,255,255,0.78); display:flex; gap:12px; flex-wrap:wrap; }
  @media(max-width:1000px){ .ogrid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:768px){ .ofilter{ position:static; } .ofilter .amd{ margin-left:0; } }
  @media(max-width:620px){ .ogrid{ grid-template-columns:1fr; } .ocard{ aspect-ratio:16/10; } }
  /* detalhe */
  .odhero{ position:relative; height:clamp(320px,60vh,560px); background:#000; }
  .odhero img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .odhero__sh{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.85) 100%); }
  .odhero__in{ position:absolute; left:0; right:0; bottom:0; padding:0 clamp(40px,8vw,140px) clamp(36px,5vw,64px); }
  .odhero__in .wrap{ max-width:1240px; margin:0 auto; color:#fff; }
  .odhero__seg{ font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--blue); }
  .odhero h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(40px,6vw,84px); line-height:0.9; letter-spacing:-0.02em; text-transform:uppercase; margin:10px 0 14px; }
  .odhero__meta{ display:flex; gap:18px; flex-wrap:wrap; font-size:15px; color:rgba(255,255,255,0.85); }
  .odhero__meta .st{ color:var(--blue); font-weight:700; }
  .odbody{ background:#fff; padding:clamp(40px,5vw,72px) clamp(40px,8vw,140px); }
  .odbody .wrap{ max-width:1100px; margin:0 auto; }
  .ofatos{ display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(10,10,10,0.1); border:1px solid rgba(10,10,10,0.1); margin-bottom:44px; }
  .ofatos div{ background:#fff; padding:20px 22px; }
  .ofatos .k{ font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--blue-dark); margin-bottom:6px; }
  .ofatos .v{ font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:800; color:var(--ink); line-height:1; }
  .oprose p{ font-size:17.5px; line-height:1.72; color:rgba(10,10,10,0.82); margin:0 0 22px; max-width:760px; }
  .ogal{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:36px; }
  .ogal img{ width:100%; aspect-ratio:4/3; object-fit:cover; display:block; cursor:pointer; background:#000; }
  .odcta{ margin-top:48px; padding-top:32px; border-top:1px solid rgba(10,10,10,0.1); display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; }
  .odcta strong{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:24px; color:var(--ink); text-transform:uppercase; }
  .odcta a{ display:inline-flex; align-items:center; gap:10px; background:var(--blue); color:#000; padding:15px 28px; font-size:12.5px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; }
  .odback{ display:inline-flex; gap:8px; margin-bottom:8px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:var(--blue); text-decoration:none; }
  .lbx{ position:fixed; inset:0; z-index:1000; background:rgba(4,8,12,0.92); display:none; align-items:center; justify-content:center; padding:24px; }
  .lbx.on{ display:flex; }
  .lbx img{ max-width:96%; max-height:92%; object-fit:contain; }
  .lbx__x{ position:absolute; top:18px; right:22px; width:46px; height:46px; border:none; background:rgba(255,255,255,0.12); color:#fff; font-size:22px; cursor:pointer; }
  @media(max-width:820px){ .ofatos{ grid-template-columns:repeat(2,1fr); } .ogal{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:560px){ .ogal{ grid-template-columns:1fr; } }
</style>
'@

# cor do status (pontinho) por tipo
function StatusColor([string]$st){ if($st -eq 'Em andamento' -or $st -eq 'Em obra'){ 'var(--blue)' } elseif($st -eq 'Em projeto'){ '#c9a227' } else { 'rgba(255,255,255,0.9)' } }

# ---- detalhe de cada OBRA ----
foreach($o in $obras){
  $slug = $o._slug
  $canon = "$SITE/obras/$slug"
  $cover = $o.cover
  $ogimg = "$SITE/$cover"
  $isAnd = ($o.status -eq 'Em andamento')

  # ficha
  $fatos = New-Object System.Text.StringBuilder
  [void]$fatos.Append("<div><div class=`"k`">Segmento</div><div class=`"v`">$(HtmlEnc $o.catLabel)</div></div>")
  if($o.city){ [void]$fatos.Append("<div><div class=`"k`">Local</div><div class=`"v`">$(HtmlEnc $o.city)</div></div>") }
  if($o.area){ [void]$fatos.Append("<div><div class=`"k`">Area</div><div class=`"v`">$(HtmlEnc $o.area)</div></div>") }
  if($o.status){ [void]$fatos.Append("<div><div class=`"k`">Status</div><div class=`"v`">$(HtmlEnc $o.status)</div></div>") }

  # descricao: usa a do JSON; se vazia, gera uma a partir dos fatos
  $descTxt = ''
  if($o.desc -and $o.desc.Trim() -ne ''){ $descTxt = $o.desc.Trim() }
  else {
    $seg = $o.catLabel.ToLower()
    $loc = if($o.city){ " em $($o.city)" } else { '' }
    $ar  = if($o.area){ " com $($o.area) de estrutura metálica" } else { '' }
    $st  = if($isAnd){ ' Obra atualmente em andamento.' } else { '' }
    $descTxt = "$($o.title) é uma obra do segmento $seg executada pela Berti Estrutural$loc$ar. Projeto, fabricação e montagem de estrutura metálica com ligações parafusadas e detalhamento em BIM.$st"
  }
  $descMeta = if($o.desc -and $o.desc.Trim() -ne ''){ ($o.desc.Trim() -replace '\s+',' ') } else { "$($o.title) — estrutura metálica $($o.catLabel.ToLower())$(if($o.city){ ' em ' + $o.city })$(if($o.area){ ' · ' + $o.area }). Projeto, fabricação e montagem pela Berti Estrutural." }
  if($descMeta.Length -gt 300){ $descMeta = $descMeta.Substring(0,297) + '...' }

  # galeria (capa + gallery, sem repetir a capa)
  $imgs = @($cover)
  if($o.gallery){ foreach($g in $o.gallery){ if($g -and ($imgs -notcontains $g)){ $imgs += $g } } }
  $galHtml = New-Object System.Text.StringBuilder
  if($imgs.Count -gt 1){
    foreach($im in $imgs){ [void]$galHtml.Append("<img src=`"/$im`" alt=`"$(AttrEnc $o.title) — Berti Estrutural`" loading=`"lazy`" onclick=`"lbx('/$im')`" />") }
  }
  $galSection = if($galHtml.Length -gt 0){ "<div class=`"ogal`">$($galHtml.ToString())</div>" } else { '' }

  # youtube (se houver) — facade simples
  $ytSection = ''
  if($o.youtube -and $o.youtube.Trim() -ne ''){
    $yt = $o.youtube.Trim()
    $ytSection = "<div style=`"margin-top:36px;aspect-ratio:16/9;max-width:900px`"><iframe style=`"width:100%;height:100%;border:0`" src=`"https://www.youtube-nocookie.com/embed/${yt}?rel=0`" title=`"$(AttrEnc $o.title)`" loading=`"lazy`" allowfullscreen></iframe></div>"
  }

  $jsonld = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CreativeWork","name":"$(JsonStr $o.title)","about":"Estrutura metálica $(JsonStr $o.catLabel)","creator":{"@type":"Organization","name":"Berti Estrutural"},"locationCreated":{"@type":"Place","name":"$(JsonStr $o.city)"},"image":"$ogimg","inLanguage":"pt-BR","url":"$canon"}
</script>
"@

  $main = @"
<main>
  <section class="odhero">
    <img src="/$cover" alt="$(AttrEnc $o.title)" />
    <div class="odhero__sh"></div>
    <div class="odhero__in"><div class="wrap">
      <a class="odback" href="/obras">&larr; Todas as obras</a>
      <div class="odhero__seg">$(HtmlEnc $o.catLabel)</div>
      <h1>$(HtmlEnc $o.title)</h1>
      <div class="odhero__meta">$(if($o.city){"<span>$(HtmlEnc $o.city)</span>"})$(if($o.area){"<span>$(HtmlEnc $o.area)</span>"})$(if($o.status){"<span class=`"st`">$(HtmlEnc $o.status)</span>"})</div>
    </div></div>
  </section>
  <section class="odbody"><div class="wrap">
    <div class="ofatos">$($fatos.ToString())</div>
    <div class="oprose"><p>$(HtmlEnc $descTxt)</p></div>
    $ytSection
    $galSection
    <div class="odcta"><strong>Tem um projeto parecido?</strong><a href="/contato">Solicitar orçamento <span>&rarr;</span></a></div>
  </div></section>
</main>
<div class="lbx" id="lbx" onclick="this.classList.remove('on')"><button class="lbx__x" aria-label="Fechar">&times;</button><img id="lbxi" src="" alt="" /></div>
<script>function lbx(s){var b=document.getElementById('lbx');document.getElementById('lbxi').src=s;b.classList.add('on');}</script>
"@
  $html = RenderPage @{ title="$($o.title) — Obra em estrutura metálica | Berti Estrutural"; desc=$descMeta; canon=$canon; ogtype='article'; ogtitle="$($o.title) — Berti Estrutural"; ogimg=$ogimg; extrahead=($jsonld + $OBRAS_CSS); main=$main }
  [System.IO.File]::WriteAllText((Join-Path $root "obras/$slug.html"), $html, $enc)
  $ocount++
}

# ---- indice de OBRAS ----
$cats = $obrasData.cats
$finalizadas = $obras | Where-Object { $_.status -ne 'Em andamento' }
$emand = $obras | Where-Object { $_.status -eq 'Em andamento' }
$ocounts = @{}
foreach($c in $cats){ if($c.key -eq 'todas'){ $ocounts['todas'] = $finalizadas.Count } else { $ocounts[$c.key] = ($finalizadas | Where-Object { $_.cat -eq $c.key }).Count } }

$ofilterBtns = New-Object System.Text.StringBuilder
foreach($c in $cats){
  $on = if($c.key -eq 'todas'){ ' on' } else { '' }
  [void]$ofilterBtns.Append("<button class=`"$on`" data-f=`"$($c.key)`">$(HtmlEnc $c.label)<span class=`"n`">$($ocounts[$c.key])</span></button>")
}
if($emand.Count -gt 0){
  [void]$ofilterBtns.Append("<button class=`"amd`" data-f=`"andamento`"><i style=`"width:8px;height:8px;border-radius:50%;background:var(--blue);display:inline-block`"></i>Em andamento<span class=`"n`">$($emand.Count)</span></button>")
}

$ocardsHtml = New-Object System.Text.StringBuilder
foreach($o in $obras){
  $isAnd = ($o.status -eq 'Em andamento')
  $stat = if($isAnd){ 'andamento' } else { 'feita' }
  $scol = StatusColor $o.status
  [void]$ocardsHtml.Append(@"
<a class="ocard" data-cat="$($o.cat)" data-status="$stat" data-k="$($o._slug)" href="/obras/$($o._slug)">
  <img src="/$($o.cover)" alt="$(AttrEnc $o.title)" loading="lazy" />
  <div class="ocard__sh"></div>
  <div class="ocard__ov"></div>
  <div class="ocard__top"><span class="ocard__seg">$(HtmlEnc $o.catLabel)</span><span class="ocard__st" style="color:$scol"><i></i>$(HtmlEnc $o.status)</span></div>
  <div class="ocard__bot"><h3>$(HtmlEnc $o.title)</h3><div class="m">$(if($o.city){"<span>$(HtmlEnc $o.city)</span>"})$(if($o.city -and $o.area){'<span style="opacity:.5">·</span>'})$(if($o.area){"<span>$(HtmlEnc $o.area)</span>"})</div><div class="ocard__go">Ver obra &rarr;</div></div>
</a>
"@)
}

$obrasJsonld = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CollectionPage","name":"Obras — Berti Estrutural","url":"$SITE/obras","inLanguage":"pt-BR","about":"Portfólio de obras em estrutura metálica","publisher":{"@type":"Organization","name":"Berti Estrutural"}}
</script>
"@
$oindexMain = @"
<main>
  <section class="ohero">
    <img class="ohero__bg" src="/assets/photos/aerial.jpg" alt="" aria-hidden="true" />
    <div class="ohero__sh"></div>
    <div class="ohero__in">
      <div class="kick"><span></span>Portfólio</div>
      <h1>Obras que<br/><span style="color:var(--blue)">sustentam.</span></h1>
      <p>Do varejo de grande fluxo às plantas industriais pesadas. Filtre por segmento e explore a engenharia por trás de cada projeto.</p>
    </div>
  </section>
  <div class="ofilter"><div class="in">$($ofilterBtns.ToString())</div></div>
  <section class="owrap"><div class="ogrid" id="ogrid">$($ocardsHtml.ToString())</div></section>
</main>
<script>
(function(){var btns=document.querySelectorAll('.ofilter button'),cards=Array.prototype.slice.call(document.querySelectorAll('#ogrid .ocard'));
 function shown(c,f){return (f==='todas')||(f==='andamento'?c.getAttribute('data-status')==='andamento':c.getAttribute('data-cat')===f);}
 function applyFilter(f){
   var first={}; cards.forEach(function(c){ if(c.style.display!=='none') first[c.getAttribute('data-k')]=c.getBoundingClientRect(); });
   cards.forEach(function(c){ c.style.display=shown(c,f)?'':'none'; });
   cards.forEach(function(c){ if(c.style.display==='none')return; var k=c.getAttribute('data-k'),last=c.getBoundingClientRect(),f0=first[k];
     if(f0){ var dx=f0.left-last.left, dy=f0.top-last.top; if(dx||dy){ c.style.transition='none'; c.style.transform='translate('+dx+'px,'+dy+'px)'; requestAnimationFrame(function(){ c.style.transition='transform 520ms cubic-bezier(.2,.85,.25,1)'; c.style.transform=''; }); } }
     else { c.style.transition='none'; c.style.opacity='0'; c.style.transform='scale(.94)'; requestAnimationFrame(function(){ c.style.transition='opacity 460ms ease, transform 460ms ease'; c.style.opacity='1'; c.style.transform=''; }); }
   });
 }
 btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.classList.remove('on')});b.classList.add('on');applyFilter(b.getAttribute('data-f'));});});
})();
</script>
"@
$oindexHtml = RenderPage @{ title='Obras — Estrutura metálica | Berti Estrutural'; desc='Portfólio de obras em estrutura metálica: supermercados, comercial e industrial. Veja a engenharia de cada projeto da Berti Estrutural.'; canon="$SITE/obras"; ogtype='website'; ogtitle='Obras — Berti Estrutural'; ogimg="$SITE/assets/photos/aerial.jpg"; extrahead=($obrasJsonld + $OBRAS_CSS); main=$oindexMain }
[System.IO.File]::WriteAllText((Join-Path $root 'obras.html'), $oindexHtml, $enc)

Write-Output "Obras geradas: $ocount paginas + indice (obras.html)"

# ============================================================================
# CONTATO
# ============================================================================
$WHATS      = '5543999864022'     # 55 + DDD 43 + 99986-4022
$WHATS_DISP = '(43) 99986-4022'
$EMAIL      = 'berti@eberti.com.br'
$FONE_DISP  = '(43) 3304-8040'

$CONTATO_CSS = @'
<style>
  .chero{ background:var(--ink); color:#fff; padding:150px clamp(40px,8vw,140px) 56px; }
  .chero .in{ max-width:1240px; margin:0 auto; }
  .kick{ display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:13px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; margin-bottom:18px; }
  .kick span{ width:30px; height:1px; background:var(--blue); }
  .chero h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(46px,7vw,104px); line-height:0.9; letter-spacing:-0.02em; text-transform:uppercase; margin:0 0 20px; }
  .chero h1 span{ color:var(--blue); }
  .chero p{ font-size:18px; line-height:1.6; color:rgba(255,255,255,0.7); max-width:560px; margin:0; }
  .ccanais{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:48px; }
  .ccanal{ display:flex; align-items:center; gap:16px; padding:20px 22px; text-decoration:none; border:1px solid rgba(255,255,255,0.2); color:#fff; transition:transform 200ms ease, border-color 200ms ease, background 200ms ease; }
  .ccanal:hover{ transform:translateY(-4px); border-color:var(--blue); background:rgba(71,182,241,0.08); }
  .ccanal.wa{ background:var(--blue); color:#05080c; border-color:var(--blue); }
  .ccanal.wa:hover{ background:var(--blue); }
  .ccanal .ic{ width:48px; height:48px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid var(--blue); color:var(--blue); }
  .ccanal.wa .ic{ border-color:rgba(5,8,12,0.2); color:#05080c; background:rgba(5,8,12,0.12); }
  .ccanal .lb{ display:block; font-family:'Barlow Condensed',sans-serif; font-size:19px; font-weight:800; letter-spacing:0.02em; text-transform:uppercase; line-height:1; }
  .ccanal .vl{ display:block; font-size:13.5px; margin-top:4px; color:rgba(255,255,255,0.7); }
  .ccanal.wa .vl{ color:rgba(5,8,12,0.7); }
  .cbody{ background:#fff; padding:clamp(56px,6vw,96px) clamp(40px,8vw,140px) clamp(72px,8vw,120px); }
  .cbody .in{ max-width:1240px; margin:0 auto; display:grid; grid-template-columns:1.35fr 1fr; gap:clamp(40px,6vw,88px); }
  .cform h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(28px,3vw,40px); line-height:1; color:var(--ink); margin:0 0 10px; text-transform:uppercase; }
  .cform > p{ font-size:15.5px; line-height:1.6; color:rgba(10,10,10,0.6); margin:0 0 28px; }
  .crow{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px; }
  .clabel{ display:block; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(10,10,10,0.6); margin-bottom:8px; }
  .cfield{ width:100%; padding:14px 16px; font-size:15px; font-family:'Open Sans',sans-serif; border:1px solid rgba(10,10,10,0.18); background:#fff; color:var(--ink); outline:none; }
  .cfield:focus{ border-color:var(--blue); }
  textarea.cfield{ resize:vertical; min-height:130px; }
  .cchan{ display:flex; gap:10px; }
  .cchan button{ flex:1; padding:12px 14px; cursor:pointer; border:1px solid rgba(10,10,10,0.18); background:transparent; color:rgba(10,10,10,0.7); font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; }
  .cchan button.on{ border-color:var(--ink); background:var(--ink); color:#fff; }
  .cerr{ font-size:13.5px; color:#b3261e; margin-bottom:16px; font-weight:600; display:none; }
  .csend{ display:inline-flex; align-items:center; gap:10px; background:var(--blue); color:#000; border:none; cursor:pointer; padding:16px 32px; font-size:13px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; }
  .csend:hover{ background:var(--blue-dark); }
  .cficha{ background:var(--ink); color:#fff; padding:clamp(28px,3vw,44px); }
  .cficha h3{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:26px; line-height:1; text-transform:uppercase; margin:0 0 28px; }
  .cblk{ margin-bottom:30px; }
  .ccap{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--blue); margin-bottom:10px; }
  .cficha a{ color:#fff; }
  .csoc{ display:flex; gap:10px; }
  .csoc a{ width:42px; height:42px; display:inline-flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.85); transition:all 180ms ease; }
  .csoc a:hover{ background:var(--blue); color:#000; border-color:var(--blue); }
  @media(max-width:820px){ .ccanais{ grid-template-columns:1fr; } .cbody .in{ grid-template-columns:1fr; } .crow{ grid-template-columns:1fr; } }
</style>
'@

$contatoMain = @"
<main>
  <section class="chero"><div class="in">
    <div class="kick"><span></span>Contato</div>
    <h1>Vamos construir<br/><span>a sua obra.</span></h1>
    <p>Conte seu projeto pelo canal que preferir. Respondemos rápido — e já com um time de engenheiros pronto para orientar a melhor solução.</p>
    <div class="ccanais">
      <a class="ccanal wa" href="https://wa.me/${WHATS}?text=$([uri]::EscapeDataString('Olá, Berti! Gostaria de falar sobre um projeto em estrutura metálica.'))" target="_blank" rel="noopener noreferrer">
        <span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/></svg></span>
        <span><span class="lb">WhatsApp</span><span class="vl">Resposta imediata</span></span>
      </a>
      <a class="ccanal" href="mailto:${EMAIL}?subject=$([uri]::EscapeDataString('Contato pelo site — Berti Estrutural'))">
        <span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M4 7l8 6 8-6"/></svg></span>
        <span><span class="lb">E-mail</span><span class="vl">$EMAIL</span></span>
      </a>
      <a class="ccanal" href="tel:+554333048040">
        <span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></span>
        <span><span class="lb">Telefone</span><span class="vl">$FONE_DISP</span></span>
      </a>
    </div>
  </div></section>

  <section class="cbody"><div class="in">
    <div class="cform">
      <h2>Envie pelo site</h2>
      <p>Preencha os campos e escolha como prefere enviar. Montamos a mensagem para você.</p>
      <form id="cform" onsubmit="return bertiSend(event)">
        <div class="crow">
          <div><label class="clabel">Nome *</label><input class="cfield" id="f_nome" placeholder="Seu nome" /></div>
          <div><label class="clabel">Segmento</label><select class="cfield" id="f_seg"><option>Comercial</option><option>Mercado / Supermercado</option><option>Industrial</option><option>Outro</option></select></div>
          <div><label class="clabel">E-mail <span id="f_emreq"></span></label><input class="cfield" id="f_email" type="email" placeholder="voce@email.com" /></div>
          <div><label class="clabel">Telefone</label><input class="cfield" id="f_tel" placeholder="(00) 00000-0000" /></div>
        </div>
        <div style="margin-bottom:22px"><label class="clabel">Mensagem *</label><textarea class="cfield" id="f_msg" placeholder="Conte sobre seu projeto: tipo de obra, área aproximada, prazo..."></textarea></div>
        <div style="margin-bottom:22px"><label class="clabel">Enviar por</label>
          <div class="cchan"><button type="button" class="on" id="ch_wa" onclick="bertiChan('whatsapp')">WhatsApp</button><button type="button" id="ch_em" onclick="bertiChan('email')">E-mail</button></div>
        </div>
        <div class="cerr" id="cerr">Preencha pelo menos nome e mensagem.</div>
        <button class="csend" type="submit">Enviar mensagem <span>&rarr;</span></button>
      </form>
    </div>
    <aside class="cficha">
      <h3>Onde nos encontrar</h3>
      <div class="cblk"><div class="ccap">Endereço</div><div style="line-height:1.6;color:rgba(255,255,255,0.78)">Condomínio Torre Montello<br/>Av. Ayrton Senna da Silva, 550 — Sala 103<br/>Palhano · Londrina — PR · 86055-630</div></div>
      <div class="cblk"><div class="ccap">Telefone</div><a href="tel:+554333048040" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:24px;text-decoration:none">$FONE_DISP</a></div>
      <div class="cblk"><div class="ccap">E-mail</div><a href="mailto:$EMAIL" style="color:rgba(255,255,255,0.82);text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.25)">$EMAIL</a></div>
      <div class="cblk"><div class="ccap">Atendimento</div><div style="color:rgba(255,255,255,0.78)">Segunda a sexta · 8h às 18h</div></div>
      <div><div class="ccap">Redes sociais</div><div class="csoc">
        <a href="https://www.instagram.com/bertiestrutural/" target="_blank" rel="noopener" title="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16z"/></svg></a>
        <a href="https://www.facebook.com/bertiengenharia/" target="_blank" rel="noopener" title="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69V11.1h3.13V8.41c0-3.1 1.9-4.79 4.66-4.79 1.32 0 2.46.1 2.8.14v3.24h-1.92c-1.5 0-1.8.72-1.8 1.77V11.1h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z"/></svg></a>
        <a href="https://br.linkedin.com/company/berti-estrutural-engenharia" target="_blank" rel="noopener" title="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.84c3.6 0 4.26 2.37 4.26 5.45v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.31a2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
        <a href="https://www.youtube.com/@Bertiestruturalengenharia" target="_blank" rel="noopener" title="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8zM9.6 15.6V8.4l6.24 3.6L9.6 15.6z"/></svg></a>
      </div></div>
    </aside>
  </div></section>
</main>
<script>
var bertiChannel='whatsapp';
function bertiChan(c){bertiChannel=c;document.getElementById('ch_wa').classList.toggle('on',c==='whatsapp');document.getElementById('ch_em').classList.toggle('on',c==='email');document.getElementById('f_emreq').textContent=(c==='email'?'*':'');}
function bertiSend(ev){ev.preventDefault();
  var nome=document.getElementById('f_nome').value.trim(),email=document.getElementById('f_email').value.trim(),tel=document.getElementById('f_tel').value.trim(),seg=document.getElementById('f_seg').value,msg=document.getElementById('f_msg').value.trim();
  if(!nome||!msg||(bertiChannel==='email'&&!email)){document.getElementById('cerr').style.display='block';return false;}
  document.getElementById('cerr').style.display='none';
  var texto='Olá, Berti! Meu nome é '+nome+'.\n'+'Segmento: '+seg+'\n'+(email?'E-mail: '+email+'\n':'')+(tel?'Telefone: '+tel+'\n':'')+'\n'+msg;
  if(bertiChannel==='whatsapp'){window.open('https://wa.me/${WHATS}?text='+encodeURIComponent(texto),'_blank','noopener');}
  else{window.location.href='mailto:${EMAIL}?subject='+encodeURIComponent('Contato pelo site — '+nome)+'&body='+encodeURIComponent(texto);}
  return false;}
</script>
"@
$contatoLd = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ContactPage","name":"Contato — Berti Estrutural","url":"$SITE/contato","inLanguage":"pt-BR"}
</script>
"@
$contatoHtml = RenderPage @{ title='Contato — Berti Estrutural'; desc='Fale com a Berti Estrutural e solicite seu orçamento de estrutura metálica. WhatsApp, e-mail ou telefone — atendimento em Londrina e região.'; canon="$SITE/contato"; ogtype='website'; ogtitle='Contato — Berti Estrutural'; ogimg="$SITE/assets/photos/hero-01.jpg"; extrahead=($contatoLd + $CONTATO_CSS); main=$contatoMain }
[System.IO.File]::WriteAllText((Join-Path $root 'contato.html'), $contatoHtml, $enc)
Write-Output "Contato gerado (contato.html)"

# ============================================================================
# 404
# ============================================================================
$nf = @"
<main style="background:var(--ink);color:#fff;min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:140px 24px 80px">
  <div style="max-width:560px">
    <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(90px,18vw,180px);line-height:0.9;color:var(--blue)">404</div>
    <h1 style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(26px,4vw,40px);text-transform:uppercase;margin:8px 0 16px">Página não encontrada</h1>
    <p style="color:rgba(255,255,255,0.7);font-size:17px;line-height:1.6;margin:0 0 28px">O endereço que você acessou não existe ou foi movido. Volte para a home ou veja nossas obras.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="/" style="background:var(--blue);color:#000;padding:14px 26px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;font-size:12.5px;text-decoration:none">Ir para a Home</a>
      <a href="/obras" style="border:1px solid rgba(255,255,255,0.3);color:#fff;padding:14px 26px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;font-size:12.5px;text-decoration:none">Ver obras</a>
    </div>
  </div>
</main>
"@
$html404 = RenderPage @{ title='Página não encontrada — Berti Estrutural'; desc='Página não encontrada.'; canon="$SITE/404"; ogtype='website'; ogtitle='Página não encontrada'; ogimg="$SITE/assets/photos/hero-01.jpg"; extrahead='<meta name="robots" content="noindex" />'; main=$nf }
[System.IO.File]::WriteAllText((Join-Path $root '404.html'), $html404, $enc)
Write-Output "404 gerado (404.html)"

# ============================================================================
# robots.txt + sitemap.xml
# ============================================================================
$robots = "User-agent: *`nAllow: /`nDisallow: /admin`n`nSitemap: $SITE/sitemap.xml`n"
[System.IO.File]::WriteAllText((Join-Path $root 'robots.txt'), $robots, $enc)

$today = (Get-Date -Format 'yyyy-MM-dd')
$sm = New-Object System.Text.StringBuilder
[void]$sm.Append('<?xml version="1.0" encoding="UTF-8"?>' + "`n" + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "`n")
function SmAdd([string]$loc,[string]$mod,[string]$pri){ [void]$sm.Append("  <url><loc>$loc</loc><lastmod>$mod</lastmod><priority>$pri</priority></url>`n") }
SmAdd "$SITE/" $today '1.0'
SmAdd "$SITE/empresa" $today '0.8'
SmAdd "$SITE/obras" $today '0.9'
SmAdd "$SITE/blog" $today '0.8'
SmAdd "$SITE/contato" $today '0.7'
foreach($o in $obras){ SmAdd "$SITE/obras/$($o._slug)" $today '0.7' }
foreach($p in $posts){ $d = IsoDate $p.date; if(-not $d){ $d = $today }; SmAdd "$SITE/blog/$($p.id)" $d '0.6' }
[void]$sm.Append('</urlset>')
[System.IO.File]::WriteAllText((Join-Path $root 'sitemap.xml'), $sm.ToString(), $enc)
Write-Output "SEO infra: robots.txt + sitemap.xml ($([regex]::Matches($sm.ToString(),'<url>').Count) URLs)"

# ============================================================================
# Partials reutilizaveis (Parceiros + fonte Caveat)
# ============================================================================
$FONTS_CAVEAT = '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet" />'

$parceirosList = @(
  @{n='Viação Garcia';l='assets/parceiros/garcia.png'}, @{n='A. Yoshii';l='assets/parceiros/ayoshii.png'},
  @{n='Super Muffato';l='assets/parceiros/muffato.png'}, @{n='Vectra';l='assets/parceiros/vectra.png'},
  @{n='Balaroti';l='assets/parceiros/balaroti.png'}, @{n='Raul Fulgencio';l='assets/parceiros/raul-fulgencio.png'},
  @{n='Camilo Atacadista';l='assets/parceiros/camilo.png'}, @{n='Comercial Ivaiporã';l='assets/parceiros/comercial-ivaipora.png'},
  @{n='Super Golff';l='assets/parceiros/super-golff.png'}, @{n='Plaenge';l='assets/parceiros/plaenge.png'}
)
$pcItems = New-Object System.Text.StringBuilder
foreach($x in ($parceirosList + $parceirosList)){ [void]$pcItems.Append("<div class=`"pc__i`"><img src=`"/$($x.l)`" alt=`"$(AttrEnc $x.n)`" title=`"$(AttrEnc $x.n)`" loading=`"lazy`" /></div>") }
$PARCEIROS = @"
<section class="pc">
  <div class="pc__lb">Quem já construiu com a Berti</div>
  <div class="pc__mask"><div class="pc__track">$($pcItems.ToString())</div></div>
</section>
"@
$PARCEIROS_CSS = @'
  .pc{ background:#fff; border-top:1px solid rgba(10,10,10,0.07); border-bottom:1px solid rgba(10,10,10,0.07); padding:14px 0 16px; overflow:hidden; }
  .pc__lb{ text-align:center; margin-bottom:10px; font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(10,10,10,0.28); }
  .pc__mask{ position:relative; width:100%; -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%); mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%); }
  .pc__track{ display:flex; width:fit-content; animation:pc-marquee 44s linear infinite; }
  .pc__track:hover{ animation-play-state:paused; }
  .pc__i{ flex:0 0 auto; width:130px; height:56px; display:flex; align-items:center; justify-content:center; padding:0 18px; border-right:1px solid rgba(10,10,10,0.05); }
  .pc__i img{ max-width:100%; max-height:100%; object-fit:contain; opacity:0.5; filter:grayscale(100%); transition:opacity 280ms ease, filter 280ms ease; }
  .pc__i img:hover{ opacity:0.85; filter:grayscale(0%); }
  @keyframes pc-marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
'@

# ============================================================================
# EMPRESA
# ============================================================================
$EMPRESA_CSS = @"
<style>
  .eh{ position:relative; height:clamp(440px,60vh,620px); overflow:hidden; background:#000; color:#fff; }
  .eh__f{ position:absolute; inset:0; opacity:0; transition:opacity 1400ms ease-in-out; }
  .eh__f.on{ opacity:1; }
  .eh__f img{ width:100%; height:100%; object-fit:cover; filter:grayscale(0.1) contrast(1.05); }
  .eh__veil{ position:absolute; inset:0; background:linear-gradient(270deg,rgba(0,0,0,0.28),rgba(0,0,0,0.34) 40%,rgba(0,0,0,0.8)); }
  .eh__in{ position:relative; z-index:5; height:100%; display:flex; align-items:center; max-width:1440px; margin:0 auto; padding:120px clamp(20px,10vw,180px) 60px; }
  .eh__crumb{ font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.55); margin-bottom:14px; }
  .eh__crumb a{ color:rgba(255,255,255,0.55); text-decoration:none; } .eh__crumb b{ color:var(--blue); font-weight:600; }
  .eh__eye{ display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:13.5px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; margin-bottom:18px; }
  .eh__eye span{ width:26px; height:1px; background:var(--blue); }
  .eh h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(38px,4.2vw,64px); line-height:0.94; letter-spacing:-0.02em; text-transform:uppercase; margin:0; text-shadow:0 4px 30px rgba(0,0,0,0.5); }
  .eh h1 span{ color:var(--blue); }
  .eh p{ font-size:16.5px; line-height:1.6; color:rgba(255,255,255,0.88); margin:22px 0 0; max-width:540px; text-shadow:0 2px 14px rgba(0,0,0,0.5); }
  .eh__dots{ position:absolute; left:clamp(20px,10vw,180px); bottom:24px; z-index:6; display:flex; gap:8px; }
  .eh__dots button{ width:12px; height:2px; background:rgba(255,255,255,0.35); border:none; padding:0; cursor:pointer; transition:width 240ms ease, background 240ms ease; }
  .eh__dots button.on{ width:24px; background:var(--blue); }
  /* processo */
  .pr{ background:#fbfcfe; background-image:linear-gradient(#d5e3f4 1px,transparent 1px),linear-gradient(90deg,#d5e3f4 1px,transparent 1px),linear-gradient(#eaf0f8 1px,transparent 1px),linear-gradient(90deg,#eaf0f8 1px,transparent 1px); background-size:120px 120px,120px 120px,24px 24px,24px 24px; color:#10212c; position:relative; }
  .pr__intro{ text-align:center; padding:clamp(48px,7vh,80px) clamp(24px,5vw,84px) clamp(24px,4vh,40px); }
  .pr__hand{ font-family:'Caveat',cursive; color:#1853b8; font-size:clamp(22px,2.4vw,34px); font-weight:700; display:inline-block; transform:rotate(-2deg); margin-bottom:14px; }
  .pr__intro h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; text-transform:uppercase; font-size:clamp(36px,4.8vw,68px); line-height:0.98; margin:0 0 16px; letter-spacing:-0.01em; }
  .pr__intro h2 em{ font-style:normal; color:#077fbf; }
  .pr__intro p{ max-width:52ch; margin:0 auto; font-size:clamp(16px,1.2vw,19px); line-height:1.6; color:#4a606e; }
  .pstep{ max-width:1320px; margin:0 auto; padding:clamp(28px,4vh,52px) clamp(24px,5vw,84px); min-height:72vh; display:grid; grid-template-columns:1fr 1fr; gap:clamp(36px,5vw,84px); align-items:center; }
  .pstep:nth-of-type(even) .ptext{ order:2; }
  .pstep:nth-of-type(even) .pmedia{ order:1; }
  .pr.anim .ptext{ opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1); }
  .pr.anim .pmedia{ opacity:0; transform:translateX(48px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
  .pr.anim .pstep:nth-of-type(even) .pmedia{ transform:translateX(-48px); }
  .pr.anim .pstep.in .ptext, .pr.anim .pstep.in .pmedia{ opacity:1; transform:none; }
  .ptext{ position:relative; display:flex; flex-direction:column; gap:18px; }
  .pghost{ position:absolute; top:-0.42em; left:-0.06em; z-index:0; font-family:'Barlow Condensed',sans-serif; font-weight:800; color:transparent; -webkit-text-stroke:2px rgba(24,83,184,0.16); letter-spacing:-0.02em; line-height:0.8; font-size:clamp(120px,15vw,230px); user-select:none; }
  .ptext > *{ position:relative; z-index:1; }
  .phead{ display:flex; align-items:center; gap:14px; }
  .pnum{ font-family:'Caveat',cursive; font-weight:700; font-size:26px; color:#1853b8; }
  .ptag{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.16em; font-weight:700; font-size:clamp(13px,1.05vw,16px); color:#077fbf; }
  .ptitle{ font-family:'Barlow Condensed',sans-serif; font-weight:800; text-transform:uppercase; line-height:0.98; color:#10212c; font-size:clamp(34px,4.4vw,60px); margin:0; }
  .prule{ width:120px; height:2px; background:rgba(24,83,184,0.4); }
  .pbody{ font-size:clamp(16px,1.18vw,19px); line-height:1.62; color:#4a606e; max-width:46ch; margin:0; }
  .pbody b{ color:#10212c; }
  .pnote{ font-family:'Caveat',cursive; color:#1853b8; font-weight:600; font-size:clamp(20px,2vw,28px); line-height:1; }
  .pframe{ position:relative; background:#fff; padding:14px 14px 16px; border-radius:3px; box-shadow:0 18px 44px -18px rgba(16,33,44,.45); }
  .pframe.bim{ background:#0e1b24; }
  .pframe img{ display:block; width:100%; height:min(56vh,500px); object-fit:cover; border-radius:1px; }
  .pframe.contain img{ height:auto; max-height:460px; object-fit:contain; }
  .ptape{ position:absolute; top:-14px; left:50%; transform:translateX(-50%) rotate(-2.5deg); width:118px; height:30px; background:rgba(71,182,241,.22); border-left:1px dashed rgba(7,127,191,.35); border-right:1px dashed rgba(7,127,191,.35); }
  .pcap{ font-family:'Caveat',cursive; color:#1853b8; font-weight:600; font-size:22px; line-height:1; padding-top:10px; display:flex; justify-content:space-between; align-items:flex-end; gap:12px; }
  .pcap.bim{ color:#47b6f1; }
  .pcap em{ font-family:'Barlow Condensed',sans-serif; font-style:normal; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:#9fb0c0; font-weight:600; }
  .pgal{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .pgal .pframe.full{ grid-column:1/-1; } .pgal .pframe img{ height:min(22vh,200px); }
  .pgal .pcap{ grid-column:1/-1; }
  .pfloat img{ width:100%; height:auto; display:block; filter:drop-shadow(0 24px 30px rgba(16,33,44,.22)); }
  .pfloat figcaption{ font-family:'Caveat',cursive; color:#1853b8; font-weight:600; font-size:22px; margin-top:14px; text-align:center; }
  .pr__out{ position:relative; z-index:2; display:flex; flex-direction:column; gap:22px; padding:clamp(48px,9vh,100px) clamp(24px,5vw,84px) clamp(72px,13vh,140px); }
  .pr__out .pr__hand{ font-size:clamp(26px,3vw,44px); margin:0; }
  .pr__out h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; text-transform:uppercase; font-size:clamp(30px,4vw,58px); line-height:1; color:#10212c; margin:0; max-width:18ch; }
  .pr__out h2 em{ font-style:normal; color:#077fbf; }
  .pr__out a{ display:inline-flex; align-items:center; gap:12px; align-self:flex-start; background:#077fbf; color:#fff; text-decoration:none; font-family:'Barlow Condensed',sans-serif; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; font-size:17px; padding:16px 28px; border-radius:3px; }
  /* diferenciais */
  .df{ background:var(--ink); color:#fff; position:relative; overflow:hidden; padding:clamp(80px,10vh,120px) clamp(24px,6vw,100px); }
  .df__top{ position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--blue),transparent); }
  .df__in{ position:relative; z-index:1; max-width:1280px; margin:0 auto; }
  .df__eye{ display:inline-flex; align-items:center; gap:12px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:13px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; margin-bottom:20px; }
  .df__eye span{ width:32px; height:1px; background:var(--blue); }
  .df h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(38px,4.4vw,64px); line-height:0.95; letter-spacing:-0.02em; text-transform:uppercase; margin:0 0 clamp(56px,7vh,80px); }
  .df h2 span{ color:var(--blue); }
  .df__grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.08); }
  .dfc{ position:relative; background:#0c1a27; padding:clamp(36px,5vh,56px) clamp(28px,3.5vw,48px); display:flex; flex-direction:column; gap:20px; overflow:hidden; transition:background .25s ease; }
  .dfc:hover{ background:rgba(71,182,241,0.06); }
  .dfc__ghost{ position:absolute; right:-16px; bottom:-40px; font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(160px,18vw,240px); line-height:0.8; color:rgba(255,255,255,0.04); letter-spacing:-0.04em; pointer-events:none; }
  .dfc__h{ display:flex; align-items:center; gap:14px; position:relative; z-index:1; }
  .dfc__n{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:14px; color:var(--blue); letter-spacing:0.1em; }
  .dfc__l{ width:24px; height:1px; background:rgba(255,255,255,0.2); }
  .dfc__t{ font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.4); }
  .dfc__rule{ width:40px; height:2px; background:var(--blue); position:relative; z-index:1; }
  .dfc h3{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(26px,2.4vw,36px); line-height:1; letter-spacing:-0.01em; text-transform:uppercase; margin:0; position:relative; z-index:1; }
  .dfc p{ font-size:clamp(14px,1.1vw,16px); line-height:1.65; color:rgba(255,255,255,0.62); margin:0; position:relative; z-index:1; }
  .df__stats{ margin-top:clamp(48px,6vh,72px); display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid rgba(255,255,255,0.12); border-bottom:1px solid rgba(255,255,255,0.12); }
  .df__stats div{ padding:clamp(24px,4vh,40px) clamp(20px,3vw,36px); }
  .df__stats div+div{ border-left:1px solid rgba(255,255,255,0.12); }
  .df__stats .n{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(40px,5vw,60px); line-height:0.9; color:var(--blue); letter-spacing:-0.02em; }
  .df__stats .k{ font-size:12px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-top:10px; font-weight:600; }
  $PARCEIROS_CSS
  @media(max-width:900px){
    .pstep{ grid-template-columns:1fr; gap:clamp(20px,3vw,40px); min-height:auto; } .pstep .ptext{ order:0 !important; } .pstep .pmedia{ order:1 !important; }
    .pframe img{ height:min(40vh,360px); }
    .df__grid{ grid-template-columns:1fr; }
    .df__stats{ grid-template-columns:1fr; }
    .df__stats div+div{ border-left:none; border-top:1px solid rgba(255,255,255,0.12); }
  }
</style>
"@

# dados das 5 etapas (portado de empresa/Processo.jsx)
$procSteps = @(
  @{n='01';tag='Avaliação de Projeto';title='Avaliação &amp; Recebimento';body='O cliente encaminha a proposta projetual e nossa equipe de engenheiros avalia se o projeto se enquadra nos padrões executados pela Berti — para dar início ao <b>estudo orçamentário</b> com segurança.';note='&rarr; viabilidade + padrão de execução';cap='projeto recebido';meta='Avaliação técnica';mode='frame';img='assets/process/avaliacao-tekla.jpg';alt='Projeto estrutural avaliado em software BIM (Tekla)'}
  @{n='02';tag='Orçamento';title='Estudo Técnico &amp; Orçamento';body='A partir de um estudo técnico detalhado, apresentamos ao cliente um <b>modelo inicial em realidade virtual</b> — com os valores, materiais e soluções otimizadas para a <b>redução de custos</b> do projeto.';note='&rarr; realidade virtual · materiais · custos';cap='cliente vê antes de existir';meta='Render · VR · 360°';mode='gallery';imgs=@('assets/process/render-aerea.jpg','assets/process/render-interior.jpg','assets/process/render-exterior.jpg')}
  @{n='03';tag='Concepção de Projeto';title='Cálculo &amp; Modelagem BIM';body='Nossa equipe técnica analisa minuciosamente o projeto com <b>softwares de engenharia avançados</b>. Após aprovação, inicia-se a <b>modelagem BIM final</b> — cada peça elaborada e suas listas de fabricação preparadas para encaixe perfeito.';note='&rarr; cálculo estrutural + modelagem BIM';cap='cada peça calculada';meta='Modelo BIM / IFC';mode='float';img='assets/process/bim-float.png';alt='Modelo estrutural BIM completo'}
  @{n='04';tag='Fabricação';title='Fabricação nas Melhores Fábricas';body='Encaminhamos as listas para as <b>principais fábricas de aço do país</b> — estrutura e cobertura (telhas incluídas). Garantia de qualidade dos materiais em cada etapa, com <b>durabilidade e alto desempenho</b>.';note='&rarr; fábricas certificadas · estrutura + cobertura';cap='peças prontas para a obra';meta='Produção e logística';mode='contain';img='assets/process/obra-aerea.jpg';alt='Peças estruturais entregues na obra'}
  @{n='05';tag='Montagem';title='Montagem 100% Parafusada';body='As peças chegam ao local da obra e são montadas como um <b>quebra-cabeça</b> — processo 100% parafusado, sem solda em campo. Isso <b>simplifica e agiliza</b> a construção, garantindo precisão e eficiência.';note='&rarr; sem solda · numerado · zero retrabalho';cap='estrutura montada em obra';meta='Montagem em obra';mode='frame';img='assets/process/estrutura-telhado.jpg';alt='Estrutura metálica montada em obra'}
)

$panels = New-Object System.Text.StringBuilder
$pi = 0
foreach($s in $procSteps){
  $media = ''
  if($s.mode -eq 'gallery'){
    $g = $s.imgs
    $media = "<div class=`"pgal`"><div class=`"pframe full`"><span class=`"ptape`"></span><img src=`"/$($g[0])`" alt=`"$(AttrEnc $s.cap)`" loading=`"lazy`" /></div><div class=`"pframe`"><img src=`"/$($g[1])`" alt=`"`" loading=`"lazy`" /></div><div class=`"pframe`"><img src=`"/$($g[2])`" alt=`"`" loading=`"lazy`" /></div><div class=`"pcap`">$($s.cap) <em>$($s.meta)</em></div></div>"
  } elseif($s.mode -eq 'float'){
    $media = "<figure class=`"pfloat`"><img src=`"/$($s.img)`" alt=`"$(AttrEnc $s.alt)`" loading=`"lazy`" /><figcaption>$($s.cap) <em style=`"font-family:'Barlow Condensed',sans-serif;font-style:normal;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#9fb0c0`">$($s.meta)</em></figcaption></figure>"
  } else {
    $cls = if($s.mode -eq 'contain'){ 'pframe contain' } else { 'pframe' }
    $media = "<div class=`"$cls`"><span class=`"ptape`"></span><img src=`"/$($s.img)`" alt=`"$(AttrEnc $s.alt)`" loading=`"lazy`" /><div class=`"pcap`">$($s.cap) <em>$($s.meta)</em></div></div>"
  }
  [void]$panels.Append(@"
<section class="pstep" id="proc-$pi">
  <div class="ptext">
    <span class="pghost" aria-hidden="true">$($s.n)</span>
    <div class="phead"><span class="pnum">$($s.n)</span><span class="ptag">$($s.tag)</span></div>
    <h2 class="ptitle">$($s.title)</h2>
    <div class="prule"></div>
    <p class="pbody">$($s.body)</p>
    <div class="pnote">$($s.note)</div>
  </div>
  <div class="pmedia">$media</div>
</section>
"@)
  $pi++
}

$empresaLd = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"AboutPage","name":"A Empresa — Berti Estrutural","url":"$SITE/empresa","inLanguage":"pt-BR","about":{"@type":"Organization","name":"Berti Estrutural"}}
</script>
"@
$empresaMain = @"
<main>
  <section class="eh" id="eh">
    <div class="eh__f on"><img src="/assets/photos/aerial.jpg" alt="Centro logístico em estrutura metálica — Londrina" /></div>
    <div class="eh__f"><img src="/assets/photos/interior-truss.jpg" alt="Showroom automotivo em estrutura metálica" /></div>
    <div class="eh__f"><img src="/assets/photos/supermarket-ceiling.jpg" alt="Atacarejo em estrutura metálica" /></div>
    <div class="eh__f"><img src="/assets/photos/factory-interior.jpg" alt="Indústria em estrutura metálica" /></div>
    <div class="eh__veil"></div>
    <div class="eh__in"><div style="max-width:700px">
      <div class="eh__crumb"><a href="/">Home</a> <span style="margin:0 10px;color:rgba(255,255,255,0.3)">/</span><b>A Empresa</b></div>
      <div class="eh__eye"><span></span>Desde 2009 · Londrina · PR</div>
      <h1>Por trás de cada obra,<br/><span>uma engenharia inteira.</span></h1>
      <p>Com corpo técnico de engenheiros experientes e parceria com os maiores fornecedores de aço do país — engenharia, fabricação e montagem coordenadas como uma máquina única há 17 anos.</p>
    </div></div>
    <div class="eh__dots" id="eh_dots">
      <button class="on" data-i="0" aria-label="Slide 1"></button><button data-i="1" aria-label="Slide 2"></button><button data-i="2" aria-label="Slide 3"></button><button data-i="3" aria-label="Slide 4"></button>
    </div>
  </section>

  <div class="pr">
    <div class="pr__intro">
      <div class="pr__hand">do projeto à obra entregue</div>
      <h2>Como <em>trabalhamos</em></h2>
      <p>Orientamos cada cliente do projeto à obra — com realidade virtual para transparência na decisão, BIM para precisão de fabricação e montagem 100% parafusada. Um único responsável em cinco etapas.</p>
    </div>
    $($panels.ToString())
    <div class="pr__out">
      <div class="pr__hand">e o resultado…</div>
      <h2>Estrutura <em>numerada, parafusada</em> e entregue no prazo.</h2>
      <a href="/contato">Solicitar orçamento &nbsp;&rarr;</a>
    </div>
  </div>

  <section class="df">
    <div class="df__top"></div>
    <div class="df__in">
      <div class="df__eye"><span></span>O que nos diferencia</div>
      <h2>Três motivos para <span>escolher a Berti.</span></h2>
      <div class="df__grid">
        <div class="dfc"><div class="dfc__ghost" aria-hidden="true">01</div><div class="dfc__h"><span class="dfc__n">01</span><span class="dfc__l"></span><span class="dfc__t">Engenharia certificada</span></div><div class="dfc__rule"></div><h3>Qualidade e Resistência</h3><p>Obras projetadas com ligações 100% parafusadas, produtos certificados, alta resistência e proteção galvanizada ou pintura de alta qualidade.</p></div>
        <div class="dfc"><div class="dfc__ghost" aria-hidden="true">02</div><div class="dfc__h"><span class="dfc__n">02</span><span class="dfc__l"></span><span class="dfc__t">BIM · VR · CNC</span></div><div class="dfc__rule"></div><h3>Soluções Tecnológicas</h3><p>Aplicada em cada obra para melhor aproveitamento dos recursos, com logística integrada, segurança e significativa redução dos prazos.</p></div>
        <div class="dfc"><div class="dfc__ghost" aria-hidden="true">03</div><div class="dfc__h"><span class="dfc__n">03</span><span class="dfc__l"></span><span class="dfc__t">Compromisso integral</span></div><div class="dfc__rule"></div><h3>Para Sua Obra</h3><p>Trazemos rentabilidade, dinamismo, segurança, sustentabilidade e rigor no cumprimento dos cronogramas para sua obra.</p></div>
      </div>
      <div class="df__stats">
        <div><div class="n">17+</div><div class="k">Anos de experiência</div></div>
        <div><div class="n">100%</div><div class="k">Ligações parafusadas</div></div>
        <div><div class="n">BIM</div><div class="k">Engenharia digital</div></div>
      </div>
    </div>
  </section>
  $PARCEIROS
</main>
<script>
(function(){var fr=document.querySelectorAll('.eh__f'),dt=document.querySelectorAll('#eh_dots button'),i=0;
 function go(n){i=n;fr.forEach(function(f,k){f.classList.toggle('on',k===i);});dt.forEach(function(d,k){d.classList.toggle('on',k===i);});}
 dt.forEach(function(d){d.addEventListener('click',function(){go(+d.getAttribute('data-i'));});});
 setInterval(function(){go((i+1)%fr.length);},6000);
 var pr=document.querySelector('.pr');
 if(pr && 'IntersectionObserver' in window){ pr.classList.add('anim');
   var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.18});
   document.querySelectorAll('.pstep').forEach(function(p){io.observe(p);});
 }
})();
</script>
"@
$empresaHtml = RenderPage @{ title='A Empresa — Engenharia em estrutura metálica | Berti Estrutural'; desc='A estrutura por trás de grandes obras. Engenharia, fabricação e montagem de estruturas metálicas — do modelo BIM à peça instalada. Desde 2009, em Londrina-PR.'; canon="$SITE/empresa"; ogtype='website'; ogtitle='A Empresa — Berti Estrutural'; ogimg="$SITE/assets/photos/hero-01.jpg"; extrahead=($empresaLd + $FONTS_CAVEAT + $EMPRESA_CSS); main=$empresaMain }
[System.IO.File]::WriteAllText((Join-Path $root 'empresa.html'), $empresaHtml, $enc)
Write-Output "Empresa gerada (empresa.html)"

# ============================================================================
# HOME (index.html)
# ============================================================================
function Num($v){ ([double]$v).ToString([System.Globalization.CultureInfo]::InvariantCulture) }

$HOME_CSS = @"
<style>
  /* HERO */
  .hh{ position:relative; min-height:100vh; overflow:hidden; background:#000; color:#fff; }
  .hh__f{ position:absolute; inset:0; opacity:0; transition:opacity 1500ms ease-in-out; }
  .hh__f.on{ opacity:1; }
  .hh__f img{ width:100%; height:100%; object-fit:cover; filter:grayscale(0.1) contrast(1.05); }
  .hh__veil{ position:absolute; inset:0; background:linear-gradient(270deg,rgba(0,0,0,0.28),rgba(0,0,0,0.34) 40%,rgba(0,0,0,0.8)); }
  .hh__vig{ position:absolute; inset:0; background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.45)); pointer-events:none; }
  .hh__in{ position:relative; z-index:5; min-height:100vh; display:flex; align-items:center; max-width:1540px; margin:0 auto; padding:120px clamp(20px,4vw,80px) 120px; }
  .hh__box{ max-width:560px; }
  .hh__eye{ display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; color:var(--blue); font-size:14px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; margin-bottom:28px; }
  .hh__eye span{ width:32px; height:1px; background:var(--blue); }
  .hh h1{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(42px,4.8vw,76px); line-height:0.94; letter-spacing:-0.02em; text-transform:uppercase; margin:0; text-shadow:0 4px 30px rgba(0,0,0,0.45); }
  .hh h1 span{ color:var(--blue); }
  .hh__sub{ font-size:17.5px; line-height:1.6; color:rgba(255,255,255,0.88); margin:28px 0 40px; max-width:580px; text-shadow:0 2px 14px rgba(0,0,0,0.5); }
  .hh__btns{ display:flex; gap:14px; flex-wrap:wrap; }
  .btn-primary{ background:var(--blue); color:#000; padding:18px 32px; font-size:13.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.14em; text-decoration:none; display:inline-flex; align-items:center; gap:10px; transition:transform 180ms ease, background 180ms ease; }
  .btn-primary:hover{ background:#fff; transform:translateY(-2px); }
  .btn-ghost{ background:transparent; color:#fff; padding:17px 32px; border:1.5px solid rgba(255,255,255,0.55); font-size:13.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.14em; text-decoration:none; display:inline-flex; align-items:center; gap:10px; transition:all 180ms ease; }
  .btn-ghost:hover{ border-color:#fff; background:rgba(255,255,255,0.08); }
  .hh__pill{ margin-top:28px; display:inline-flex; align-items:center; gap:13px; background:rgba(6,25,34,0.5); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.18); border-radius:40px; padding:9px 20px 9px 9px; cursor:pointer; color:#fff; }
  .hh__pill:hover{ background:rgba(6,25,34,0.72); border-color:rgba(71,182,241,0.6); }
  .hh__pill .pl{ width:38px; height:38px; border-radius:50%; background:var(--blue); display:inline-flex; align-items:center; justify-content:center; color:#061922; font-size:13px; }
  .hh__pill b{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.06em; text-transform:uppercase; display:block; }
  .hh__pill small{ font-size:11px; color:rgba(255,255,255,0.6); }
  .hh__stats{ display:flex; gap:48px; margin-top:64px; padding-top:28px; border-top:1px solid rgba(255,255,255,0.18); max-width:540px; }
  .hh__stats .v{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:36px; line-height:1; display:flex; align-items:baseline; gap:4px; }
  .hh__stats .v em{ font-style:normal; font-size:18px; color:var(--blue); }
  .hh__stats .l{ margin-top:6px; font-size:11.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.6); }
  .hh__dots{ position:absolute; left:clamp(20px,4vw,64px); bottom:32px; z-index:6; display:flex; align-items:center; gap:18px; color:rgba(255,255,255,0.75); }
  .hh__dots .row{ display:flex; gap:8px; }
  .hh__dots button{ width:14px; height:3px; background:rgba(255,255,255,0.35); border:none; padding:0; cursor:pointer; transition:width 240ms ease, background 240ms ease; }
  .hh__dots button.on{ width:28px; background:var(--blue); }
  .hh__cap{ font-family:'Barlow Condensed',sans-serif; font-size:14px; letter-spacing:0.16em; text-transform:uppercase; }
  /* video modal */
  .vmod{ position:fixed; inset:0; z-index:9999; background:rgba(4,20,28,0.92); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); }
  .vmod__p{ position:relative; width:100%; max-width:1120px; aspect-ratio:16/9; border-radius:10px; overflow:hidden; background:#000; box-shadow:0 30px 80px rgba(0,0,0,0.6); }
  .vmod__p iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }
  .vmod__x{ position:absolute; top:18px; right:20px; width:44px; height:44px; border-radius:50%; background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.25); color:#fff; font-size:18px; cursor:pointer; z-index:2; }
  /* generic section header */
  .sec{ padding:clamp(56px,8vh,100px) clamp(20px,5vw,84px); }
  .eye{ display:inline-flex; align-items:center; gap:12px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.22em; text-transform:uppercase; color:var(--blue-dark); margin-bottom:18px; }
  .eye span{ width:28px; height:1px; background:var(--blue-dark); }
  .h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(32px,3.6vw,52px); line-height:0.96; letter-spacing:-0.02em; text-transform:uppercase; margin:0; color:var(--ink); }
  /* ESTRUTURA 3D */
  .e3{ background:#fff; }
  .e3stage{ position:relative; width:100%; height:620px; margin-top:8px; }
  .e3stage model-viewer{ position:absolute; inset:0; width:100%; height:100%; z-index:1; background:transparent; --poster-color:transparent; }
  .e3shadow{ position:absolute; left:50%; bottom:70px; width:720px; max-width:90%; height:110px; transform:translateX(-50%); background:radial-gradient(ellipse at center, rgba(6,25,34,0.13), rgba(6,25,34,0)); filter:blur(6px); z-index:0; }
  .e3photo{ position:absolute; right:-6px; top:0; z-index:5; transform:rotate(2.5deg); pointer-events:none; }
  .e3photo .tape1{ position:absolute; left:14px; top:-13px; width:78px; height:26px; background:rgba(71,182,241,0.32); transform:rotate(-25deg); }
  .e3photo .tape2{ position:absolute; right:12px; top:-13px; width:78px; height:26px; background:rgba(71,182,241,0.32); transform:rotate(23deg); }
  .e3photo .fr{ background:#fff; padding:11px 11px 9px; border-radius:2px; box-shadow:0 16px 32px rgba(6,25,34,0.22); }
  .e3photo img{ width:256px; height:156px; object-fit:cover; display:block; }
  .e3photo .cap{ font-family:'Caveat',cursive; font-weight:700; font-size:27px; color:#061922; text-align:center; margin-top:7px; line-height:1; }
  .e3photo .cap b{ color:#077fbf; }
  .e3arrow{ position:absolute; z-index:2; pointer-events:none; overflow:visible; filter:drop-shadow(0 0 3px rgba(255,255,255,0.95)); }
  .e3ann{ position:absolute; z-index:3; pointer-events:none; }
  .e3ann .big{ font-family:'Caveat',cursive; font-weight:700; font-size:40px; line-height:1.08; color:#061922; }
  .e3ann .hl{ box-shadow:inset 0 -0.28em 0 0 rgba(71,182,241,0.55); border-radius:2px; }
  .e3ann .sub{ font-family:'Open Sans',sans-serif; font-size:15px; color:#5b6b75; margin-top:7px; }
  .e3ann.a1{ left:0; top:50px; width:340px; } .e3ann.a1 .sub{ max-width:300px; }
  .e3ann.a2{ right:0; bottom:56px; width:280px; text-align:right; } .e3ann.a2 .sub{ margin-left:auto; max-width:260px; }
  .e3ann.a3{ left:0; bottom:56px; width:300px; } .e3ann.a3 .sub{ max-width:280px; }
  .e3hint{ position:absolute; left:50%; bottom:6px; transform:translateX(-50%); z-index:4; display:inline-flex; align-items:center; gap:9px; padding:9px 18px; background:#fff; border:1.5px solid rgba(7,127,191,0.25); border-radius:999px; box-shadow:0 6px 18px rgba(6,25,34,0.08); pointer-events:none; }
  .e3hint span{ font-family:'Caveat',cursive; font-weight:700; font-size:24px; color:#077fbf; line-height:1; }
  .e3__adv{ display:none; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:24px; }
  .e3__c{ display:flex; gap:14px; align-items:flex-start; }
  .e3__c .ic{ flex-shrink:0; width:44px; height:44px; border-radius:11px; background:rgba(71,182,241,0.14); display:flex; align-items:center; justify-content:center; }
  .e3__c b{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:18px; text-transform:uppercase; color:var(--ink); display:block; line-height:1.1; margin-bottom:4px; }
  .e3__c span{ font-size:14px; color:#5b6b75; line-height:1.5; }
  .e3__note{ display:none; }
  /* MAPA */
  .mp{ background:#f4f1ea; }
  .mp__grid{ display:grid; grid-template-columns:380px 1fr; background:#fff; border:1px solid rgba(6,25,34,.1); border-radius:20px; overflow:hidden; box-shadow:0 24px 60px rgba(6,25,34,.12); margin-top:22px; }
  .mp__list{ padding:14px; display:flex; flex-direction:column; gap:10px; max-height:560px; overflow-y:auto; border-right:1px solid rgba(6,25,34,.08); }
  .mp__it{ display:flex; cursor:pointer; border-radius:12px; overflow:hidden; border:1.5px solid rgba(6,25,34,.12); text-decoration:none; color:inherit; }
  .mp__it:hover{ box-shadow:0 6px 16px rgba(6,25,34,.14); }
  .mp__it{ align-items:center; }
  .mp__it img{ flex:0 0 108px; width:108px; height:96px; object-fit:cover; background:#dfe6ec; }
  .mp__it .tx{ padding:10px 12px; display:flex; flex-direction:column; justify-content:center; }
  .mp__it .tag{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--blue-dark); margin-bottom:4px; }
  .mp__it h3{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:16px; text-transform:uppercase; color:var(--ink); margin:0; line-height:1.08; }
  #mp_map{ min-height:560px; background:#e7ebef; z-index:0; }
  /* COMO TRABALHAMOS */
  .ct{ background:#fbfcfe; background-image:linear-gradient(#d5e3f4 1px,transparent 1px),linear-gradient(90deg,#d5e3f4 1px,transparent 1px),linear-gradient(#eaf0f8 1px,transparent 1px),linear-gradient(90deg,#eaf0f8 1px,transparent 1px); background-size:120px 120px,120px 120px,24px 24px,24px 24px; text-align:center; }
  .ct__hand{ font-family:'Caveat',cursive; color:#1853b8; font-size:clamp(22px,2.4vw,34px); font-weight:700; transform:rotate(-2deg); display:inline-block; margin-bottom:14px; }
  .ct__grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:clamp(12px,2vw,28px); max-width:1280px; margin:48px auto 0; text-align:center; }
  .ct__s{ position:relative; display:flex; flex-direction:column; align-items:center; text-decoration:none; color:inherit; transition:transform 300ms cubic-bezier(.2,.8,.2,1); }
  .ct__s:hover{ transform:translateY(-8px); z-index:10; }
  .ct__n{ width:72px; height:72px; border-radius:50%; border:2px solid #c6d4e2; background:#fff; display:flex; align-items:center; justify-content:center; font-family:'Caveat',cursive; font-weight:700; font-size:26px; color:#1853b8; margin-bottom:16px; transition:all 280ms ease; }
  .ct__s:hover .ct__n{ background:#077fbf; color:#fff; border-color:#077fbf; box-shadow:0 12px 28px -10px rgba(7,127,191,0.5); }
  .ct__w{ font-family:'Barlow Condensed',sans-serif; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:13px; color:#077fbf; border-bottom:1px dashed rgba(7,127,191,0.5); padding-bottom:2px; margin-bottom:9px; }
  .ct__t{ font-family:'Barlow Condensed',sans-serif; font-weight:800; text-transform:uppercase; font-size:clamp(15px,1.3vw,19px); line-height:1.05; color:#10212c; margin-bottom:10px; }
  .ct__b{ font-size:14px; line-height:1.55; color:#4a606e; max-width:210px; opacity:0; max-height:0; overflow:hidden; transition:opacity .25s ease, max-height .3s ease; }
  .ct__s:hover .ct__b{ opacity:1; max-height:260px; }
  .ct__pop{ position:absolute; bottom:calc(100% + 12px); left:50%; transform:translateX(-50%) translateY(24px); opacity:0; pointer-events:none; width:220px; z-index:20; transition:opacity 260ms ease, transform 300ms cubic-bezier(.2,.8,.2,1); }
  .ct__s:hover .ct__pop{ opacity:1; transform:translateX(-50%) translateY(0); }
  .ct__pop .fr{ position:relative; background:#fff; padding:10px 10px 12px; border-radius:3px; box-shadow:0 20px 48px -14px rgba(16,33,44,.55); }
  .ct__pop .fr:before{ content:''; position:absolute; top:-12px; left:50%; transform:translateX(-50%) rotate(-2deg); width:90px; height:24px; background:rgba(71,182,241,.22); border-left:1px dashed rgba(7,127,191,.35); border-right:1px dashed rgba(7,127,191,.35); }
  .ct__pop .fr img{ display:block; width:100%; height:130px; object-fit:cover; border-radius:1px; }
  .ct__pop .nt{ font-family:'Caveat',cursive; color:#1853b8; font-weight:700; font-size:17px; text-align:center; padding-top:8px; line-height:1.25; }
  .ct__more{ opacity:0; max-height:0; overflow:hidden; transition:opacity .25s ease, max-height .3s ease; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:#077fbf; }
  .ct__s:hover .ct__more{ opacity:1; max-height:24px; margin-top:10px; }
  /* CATEGORIAS */
  .cg{ background:#f4f1ea; }
  .cg__head{ display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:end; max-width:1440px; margin:0 auto 48px; }
  .cg__head p{ font-size:17px; line-height:1.6; color:rgba(10,10,10,0.68); max-width:520px; margin:0; justify-self:end; }
  .cg__grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:28px; max-width:1440px; margin:0 auto; }
  .cg__c{ background:#fff; text-decoration:none; color:inherit; overflow:hidden; transition:transform 280ms ease, box-shadow 280ms ease; display:block; }
  .cg__c:hover{ transform:translateY(-6px); box-shadow:0 24px 60px -20px rgba(7,61,87,0.35); }
  .cg__img{ position:relative; height:320px; overflow:hidden; background:#000; }
  .cg__img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:opacity 500ms ease, transform 700ms ease; }
  .cg__img .hov{ opacity:0; }
  .cg__c:hover .cg__img .base{ opacity:0; transform:scale(1.06); }
  .cg__c:hover .cg__img .hov{ opacity:1; transform:scale(1.06); }
  .cg__go i{ transition:transform 240ms ease; }
  .cg__c:hover .cg__go i{ transform:translateX(6px); }
  .cg__sh{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,0.55)); }
  .cg__num{ position:absolute; left:22px; top:22px; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; letter-spacing:0.22em; color:var(--blue); text-transform:uppercase; }
  .cg__ti{ position:absolute; left:22px; right:22px; bottom:22px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:38px; line-height:0.95; text-transform:uppercase; color:#fff; }
  .cg__bd{ padding:26px 26px 30px; }
  .cg__bd p{ font-size:14.5px; line-height:1.6; margin:0; color:rgba(10,10,10,0.7); min-height:88px; }
  .cg__go{ margin-top:22px; padding-top:18px; border-top:1px solid rgba(10,10,10,0.1); display:flex; align-items:center; justify-content:space-between; }
  .cg__go b{ font-family:'Barlow Condensed',sans-serif; font-size:13.5px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink); }
  .cg__go i{ width:38px; height:38px; background:var(--blue); color:#000; display:inline-flex; align-items:center; justify-content:center; font-style:normal; }
  /* DEPOIMENTOS */
  .dp{ background:#f6f7f8; }
  .dp__grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:28px; max-width:1440px; margin:0 auto; }
  .dp__c{ background:#fff; padding:40px 44px; position:relative; border-left:3px solid var(--blue); }
  .dp__c .q{ font-size:17px; line-height:1.6; color:rgba(10,10,10,0.82); margin:0 0 28px; font-style:italic; }
  .dp__f{ padding-top:22px; border-top:1px solid rgba(10,10,10,0.08); display:flex; align-items:center; gap:16px; }
  .dp__f img{ width:56px; height:56px; border-radius:50%; object-fit:cover; border:2px solid var(--blue); }
  .dp__f b{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:18px; text-transform:uppercase; color:var(--ink); display:block; }
  .dp__f span{ font-size:12.5px; color:rgba(10,10,10,0.6); }
  /* YOUTUBE */
  .yt{ background:#fff; }
  .yt__head{ display:flex; align-items:flex-end; justify-content:space-between; gap:32px; flex-wrap:wrap; margin-bottom:40px; max-width:1440px; margin-left:auto; margin-right:auto; }
  .yt__sub{ background:#FF0000; color:#fff; padding:13px 22px; font-size:12.5px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; display:inline-flex; align-items:center; gap:10px; }
  .yt__grid{ display:grid; grid-template-columns:2fr 1fr; gap:28px; max-width:1440px; margin:0 auto; }
  .yt__main{ position:relative; aspect-ratio:16/9; background:#000; overflow:hidden; box-shadow:0 18px 40px -16px rgba(10,10,10,0.35); cursor:pointer; }
  .yt__main img{ width:100%; height:100%; object-fit:cover; }
  .yt__main iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }
  .yt__play{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:88px; height:88px; border-radius:50%; background:#FF0000; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 12px rgba(255,0,0,0.2); }
  .yt__caption{ position:absolute; left:24px; right:24px; bottom:22px; color:#fff; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(20px,2vw,28px); text-transform:uppercase; text-shadow:0 2px 12px rgba(0,0,0,0.6); }
  .yt__side{ display:flex; flex-direction:column; justify-content:space-between; gap:14px; height:100%; }
  .yt__t{ display:grid; grid-template-columns:140px 1fr; gap:14px; cursor:pointer; align-items:flex-start; background:none; border:none; padding:0; text-align:left; }
  .yt__t .th{ position:relative; aspect-ratio:16/9; overflow:hidden; background:#000; }
  .yt__t .th img{ width:100%; height:100%; object-fit:cover; }
  .yt__t b{ font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; line-height:1.15; text-transform:uppercase; color:var(--ink); }
  /* HOME BLOG */
  .hb{ background:#f4f1ea; }
  .hb__head{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:36px; max-width:1200px; margin-left:auto; margin-right:auto; }
  .hb__grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; max-width:1200px; margin:0 auto; }
  .hb__c{ display:flex; flex-direction:column; text-decoration:none; color:inherit; background:#fff; border-radius:4px; overflow:hidden; box-shadow:0 1px 3px rgba(6,25,34,0.08); transition:transform 180ms ease, box-shadow 180ms ease; }
  .hb__c:hover{ transform:translateY(-4px); box-shadow:0 12px 28px rgba(6,25,34,0.14); }
  .hb__im{ position:relative; aspect-ratio:16/10; overflow:hidden; background:#dfe6ec; }
  .hb__im img{ width:100%; height:100%; object-fit:cover; }
  .hb__im span{ position:absolute; left:12px; top:12px; background:var(--blue); color:#06222e; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11.5px; letter-spacing:0.12em; text-transform:uppercase; padding:5px 10px; }
  .hb__bd{ padding:20px 20px 24px; display:flex; flex-direction:column; gap:10px; flex:1; }
  .hb__bd .dt{ font-size:12px; color:#7b8a93; }
  .hb__bd h3{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:21px; line-height:1.1; color:var(--ink); margin:0; }
  .hb__bd p{ font-size:14.5px; line-height:1.55; color:#5b6b75; margin:0; }
  /* CTA */
  .cta{ position:relative; background:var(--ink); color:#fff; padding:clamp(64px,11vh,110px) 40px; text-align:center; overflow:hidden; }
  .cta__g{ position:absolute; inset:0; background-image:linear-gradient(rgba(71,182,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(71,182,241,0.06) 1px,transparent 1px); background-size:48px 48px; }
  .cta__in{ position:relative; max-width:1100px; margin:0 auto; }
  .cta__eye{ font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:14px; letter-spacing:0.28em; text-transform:uppercase; color:var(--blue); margin-bottom:20px; }
  .cta h2{ font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:clamp(38px,5vw,60px); line-height:0.96; letter-spacing:-0.02em; text-transform:uppercase; margin:0 auto 22px; max-width:820px; }
  .cta h2 span{ color:var(--blue); }
  .cta p{ margin:0 auto 40px; max-width:600px; font-size:17px; line-height:1.6; color:rgba(255,255,255,0.82); }
  .cta__btns{ display:flex; gap:14px; flex-wrap:wrap; justify-content:center; }
  $PARCEIROS_CSS
  @media(max-width:980px){
    .e3stage{ display:none; } .e3__adv{ display:grid; grid-template-columns:1fr; } .e3__note{ display:block; text-align:center; margin-top:18px; padding:13px 14px; border:1.5px solid rgba(7,127,191,0.4); border-radius:8px; color:var(--blue-dark); font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12.5px; letter-spacing:0.06em; text-transform:uppercase; }
    .mp__grid{ grid-template-columns:1fr; } .mp__list{ flex-direction:row; max-height:none; overflow-x:auto; border-right:none; } .mp__it{ flex:0 0 240px; }
    .ct__grid{ grid-template-columns:repeat(2,1fr); gap:32px 20px; } .ct__pop{ display:none; } .ct__b{ opacity:1; max-height:none; } .ct__more{ display:none; }
    .cg__head{ grid-template-columns:1fr; gap:20px; } .cg__head p{ justify-self:start; } .cg__grid{ grid-template-columns:1fr; }
    .dp__grid{ grid-template-columns:1fr; }
    .yt__grid{ grid-template-columns:1fr; } .yt__side{ display:none; }
    .hb__grid{ grid-template-columns:1fr; } .hb__head{ flex-direction:column; align-items:flex-start; }
    .hh__stats{ gap:28px; margin-top:40px; }
  }
  @media(max-width:560px){ .ct__grid{ grid-template-columns:1fr; } }
</style>
"@

# blog: 3 mais recentes
$hb = New-Object System.Text.StringBuilder
foreach($p in ($posts | Select-Object -First 3)){
  [void]$hb.Append("<a class=`"hb__c`" href=`"/blog/$($p.id)`"><div class=`"hb__im`"><img src=`"/$($p.cover)`" alt=`"$(AttrEnc $p.title)`" loading=`"lazy`" /><span>$(HtmlEnc $p.catLabel)</span></div><div class=`"hb__bd`"><div class=`"dt`">$(HtmlEnc $p.date) · $(HtmlEnc $p.read)</div><h3>$(HtmlEnc $p.title)</h3><p>$(HtmlEnc $p.excerpt)</p></div></a>")
}

# mapa: obras em andamento com coordenadas
$mapObras = $obras | Where-Object { $_.status -eq 'Em andamento' -and $_.lat -and $_.lng }
$mapList = New-Object System.Text.StringBuilder
$mapData = New-Object System.Text.StringBuilder
$mi = 0
foreach($o in $mapObras){
  [void]$mapList.Append("<a class=`"mp__it`" href=`"/obras/$($o._slug)`" data-i=`"$mi`"><img src=`"/$($o.cover)`" alt=`"$(AttrEnc $o.title)`" loading=`"lazy`" /><div class=`"tx`"><div class=`"tag`">&bull; Em andamento</div><h3>$(HtmlEnc $o.title)</h3></div></a>")
  $addr = if($o.address){ $o.address } else { $o.city }
  [void]$mapData.Append("{t:`"$(JsonStr $o.title)`",c:`"/$($o.cover)`",a:`"$(JsonStr $addr)`",lat:$(Num $o.lat),lng:$(Num $o.lng)},")
  $mi++
}

$homeLd = @"
<script type="application/ld+json">
{"@context":"https://schema.org","@type":["Organization","GeneralContractor"],"name":"Berti Estrutural Engenharia","alternateName":"Berti Estrutural","url":"$SITE/","logo":"$SITE/assets/logo-be-mark.png","image":"$SITE/assets/photos/hero-01.jpg","description":"Engenharia, fabricação e montagem de estruturas metálicas para supermercados, comércio e indústria. Projeto BIM, fabricação certificada e montagem 100% parafusada.","telephone":"+554333048040","email":"berti@eberti.com.br","foundingDate":"2009","address":{"@type":"PostalAddress","streetAddress":"Av. Ayrton Senna da Silva, 550 - Sala 103, Condomínio Torre Montello","addressLocality":"Londrina","addressRegion":"PR","postalCode":"86055-630","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":-23.3299,"longitude":-51.1816},"areaServed":{"@type":"State","name":"Paraná"},"sameAs":["https://www.instagram.com/bertiestrutural/","https://www.facebook.com/bertiengenharia/","https://br.linkedin.com/company/berti-estrutural-engenharia","https://www.youtube.com/@Bertiestruturalengenharia"]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Berti Estrutural","url":"$SITE/","inLanguage":"pt-BR"}
</script>
"@

$homeExtra = @"
<link rel="preload" as="image" href="/assets/photos/hero-01.jpg" fetchpriority="high" />
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"></script>
$FONTS_CAVEAT
$homeLd
$HOME_CSS
"@

$homeMain = @"
<main>
  <!-- HERO -->
  <section class="hh" id="hh">
    <div class="hh__f on"><img src="/assets/photos/hero-01.jpg" alt="Estrutura metálica Sky Mall — Londrina" fetchpriority="high" /></div>
    <div class="hh__f"><img src="/assets/photos/hero-02.jpg" alt="Estrutura metálica Nipponflex — Maringá" loading="lazy" /></div>
    <div class="hh__f"><img src="/assets/photos/hero-03.jpg" alt="Supermercado Camilo — Marialva" loading="lazy" /></div>
    <div class="hh__f"><img src="/assets/photos/hero-04.jpg" alt="Projeto comercial — Ivaiporã" loading="lazy" /></div>
    <div class="hh__f"><img src="/assets/photos/hero-05.jpg" alt="Supermercado Bavaresco — Pontal do Paraná" loading="lazy" /></div>
    <div class="hh__veil"></div><div class="hh__vig"></div>
    <div class="hh__in"><div class="hh__box">
      <div class="hh__eye"><span></span>Desde 2009 · Londrina · PR</div>
      <h1>Engenharia<br/>especializada em<br/><span>estruturas metálicas.</span></h1>
      <p class="hh__sub">Projetamos, fabricamos e montamos estruturas metálicas para supermercados, indústrias e grandes empreendimentos — do modelo BIM à peça instalada em obra.</p>
      <div class="hh__btns">
        <a class="btn-primary" href="/contato">Solicitar Orçamento <span aria-hidden="true">&rarr;</span></a>
        <a class="btn-ghost" href="/obras">Ver Obras</a>
      </div>
      <button class="hh__pill" id="hh_play"><span class="pl">&#9658;</span><span><b>Assistir vídeo institucional</b><small>Conheça a Berti em 1:42</small></span></button>
      <div class="hh__stats">
        <div><div class="v">17<em>anos</em></div><div class="l">no mercado</div></div>
        <div><div class="v">BIM</div><div class="l">projeto digital</div></div>
      </div>
    </div></div>
    <div class="hh__dots"><div class="row" id="hh_dots"><button class="on" data-i="0"></button><button data-i="1"></button><button data-i="2"></button><button data-i="3"></button><button data-i="4"></button></div><span class="hh__cap" id="hh_cap">Sky Mall · Londrina · PR</span></div>
  </section>

  <!-- ESTRUTURA 3D -->
  <section class="sec e3" id="estrutura-3d">
    <div style="max-width:1200px;margin:0 auto">
      <div class="eye"><span></span>Galpões em aço · modelo 3D</div>
      <h2 class="h2" style="font-weight:900;font-size:clamp(40px,5vw,56px)">A estrutura<br/>por dentro.</h2>
      <div class="e3stage">
        <div class="e3shadow"></div>
        <model-viewer src="/assets/3d/palladium.glb" alt="Estrutura metálica Palladium — Berti Estrutural" camera-controls disable-zoom auto-rotate auto-rotate-delay="0" rotation-per-second="18deg" interaction-prompt="none" field-of-view="30deg" camera-orbit="35deg 75deg 72%" shadow-intensity="0.6" exposure="1.15" tone-mapping="neutral" environment-image="legacy" loading="lazy"></model-viewer>
        <div class="e3photo"><span class="tape1"></span><span class="tape2"></span><div class="fr"><img src="/assets/photos/palladium-aerea.jpg" alt="A mesma estrutura, já construída" loading="lazy" /><div class="cap">A mesma obra, <b>pronta</b></div></div></div>
        <svg class="e3arrow" width="60" height="45" viewBox="0 0 132 98" fill="none" style="left:236px;top:200px"><path d="M6 10 C50 22 80 44 114 80" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round"/><path d="M114 80 L94 78 M114 80 L110 58" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="e3ann a1"><div class="big"><span class="hl">Sem solda</span>, montagem <span class="hl">rápida</span></div><div class="sub">100% parafusada · execução completa em 120 dias</div></div>
        <svg class="e3arrow" width="60" height="45" viewBox="0 0 132 98" fill="none" style="right:206px;bottom:208px"><path d="M126 88 C82 76 52 54 18 18" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round"/><path d="M18 18 L38 20 M18 18 L22 40" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="e3ann a2"><div class="big">Mezaninos <span class="hl">mais leves</span></div><div class="sub">estrutura metálica, muito menos peso na obra</div></div>
        <svg class="e3arrow" width="60" height="45" viewBox="0 0 132 98" fill="none" style="left:206px;bottom:208px"><path d="M6 88 C50 76 80 54 114 18" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round"/><path d="M114 18 L94 20 M114 18 L110 40" stroke="#47b6f1" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="e3ann a3"><div class="big">Estrutura <span class="hl">100% em BIM</span></div><div class="sub">cada peça calculada e detalhada antes de fabricar</div></div>
        <div class="e3hint"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="#077fbf" stroke-width="2.4" stroke-linecap="round"/><path d="M20 4v4h-4" stroke="#077fbf" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>arraste pra girar</span></div>
      </div>
      <div class="e3__adv">
        <div class="e3__c"><span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="#077fbf"><path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z"/></svg></span><div><b>Sem solda, montagem rápida</b><span>100% parafusada · execução completa em 120 dias</span></div></div>
        <div class="e3__c"><span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#077fbf" stroke-width="2" stroke-linejoin="round"><path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"/><path d="M3 7 L12 12 L21 7"/><path d="M12 12 V22"/></svg></span><div><b>Estrutura 100% em BIM</b><span>cada peça calculada e detalhada antes de fabricar</span></div></div>
        <div class="e3__c"><span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#077fbf" stroke-width="2" stroke-linejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 Z"/><path d="M2 13 L12 18 L22 13"/></svg></span><div><b>Mezaninos mais leves</b><span>estrutura metálica, muito menos peso na obra</span></div></div>
      </div>
      <div class="e3__note">Modelo 3D interativo disponível no computador</div>
    </div>
  </section>

  <!-- MAPA -->
  <section class="sec mp" id="obras-mapa">
    <div style="max-width:1320px;margin:0 auto">
      <div class="eye"><span></span>Obras em andamento · $($mapObras.Count) ativas</div>
      <h2 class="h2" style="font-size:clamp(24px,3vw,32px)">Onde estamos construindo agora</h2>
      <div class="mp__grid">
        <div class="mp__list">$($mapList.ToString())</div>
        <div id="mp_map"></div>
      </div>
    </div>
  </section>

  <!-- COMO TRABALHAMOS -->
  <section class="sec ct">
    <div class="ct__hand">do projeto à obra entregue</div>
    <h2 class="h2" style="text-align:center">Como <span style="color:#077fbf">trabalhamos</span></h2>
    <p style="max-width:540px;margin:16px auto 0;font-size:16px;line-height:1.58;color:#4a606e">Cinco etapas, um único responsável — do recebimento do projeto à montagem parafusada em obra.</p>
    <div class="ct__grid">
      <a class="ct__s" href="/empresa"><div class="ct__pop"><div class="fr"><img src="/assets/process/avaliacao-tekla.jpg" alt="" loading="lazy" /><div class="nt">viabilidade + padrão de execução</div></div></div><div class="ct__n">01</div><div class="ct__w">Avaliação</div><div class="ct__t">Avaliação &amp; Recebimento</div><div class="ct__b">O cliente encaminha a proposta e nossa equipe avalia se o projeto se enquadra nos padrões Berti.</div><div class="ct__more">ver etapa &rarr;</div></a>
      <a class="ct__s" href="/empresa"><div class="ct__pop"><div class="fr"><img src="/assets/process/render-aerea.jpg" alt="" loading="lazy" /><div class="nt">realidade virtual · materiais · custos</div></div></div><div class="ct__n">02</div><div class="ct__w">Orçamento</div><div class="ct__t">Estudo Técnico &amp; Orçamento</div><div class="ct__b">Modelo inicial em realidade virtual com valores, materiais e soluções para redução de custos.</div><div class="ct__more">ver etapa &rarr;</div></a>
      <a class="ct__s" href="/empresa"><div class="ct__pop"><div class="fr"><img src="/assets/process/bim-float.png" alt="" loading="lazy" /><div class="nt">cálculo estrutural + modelagem BIM</div></div></div><div class="ct__n">03</div><div class="ct__w">BIM</div><div class="ct__t">Cálculo &amp; Modelagem BIM</div><div class="ct__b">Softwares avançados calculam e modelam cada peça — listas de fabricação para encaixe perfeito.</div><div class="ct__more">ver etapa &rarr;</div></a>
      <a class="ct__s" href="/empresa"><div class="ct__pop"><div class="fr"><img src="/assets/process/obra-aerea.jpg" alt="" loading="lazy" /><div class="nt">fábricas certificadas · estrutura + cobertura</div></div></div><div class="ct__n">04</div><div class="ct__w">Fabricação</div><div class="ct__t">Melhores Fábricas</div><div class="ct__b">Principais fábricas de aço do país — estrutura e cobertura com qualidade e rastreabilidade.</div><div class="ct__more">ver etapa &rarr;</div></a>
      <a class="ct__s" href="/empresa"><div class="ct__pop"><div class="fr"><img src="/assets/process/estrutura-telhado.jpg" alt="" loading="lazy" /><div class="nt">sem solda · numerado · zero retrabalho</div></div></div><div class="ct__n">05</div><div class="ct__w">Montagem</div><div class="ct__t">Montagem 100% Parafusada</div><div class="ct__b">Peças montadas como um quebra-cabeça — sem solda em campo, com precisão e agilidade.</div><div class="ct__more">ver etapa &rarr;</div></a>
    </div>
    <div style="text-align:center;margin-top:48px"><a href="/empresa" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;font-size:14px;color:#077fbf;text-decoration:none;border-bottom:1.5px solid #077fbf;padding-bottom:2px">Ver processo completo &nbsp;&rarr;</a></div>
  </section>

  <!-- CATEGORIAS -->
  <section class="sec cg" id="obras">
    <div class="cg__head">
      <div><div class="eye"><span></span>Segmentos de atuação</div><h2 class="h2">Veja Nossas Obras</h2></div>
      <p>Soluções personalizadas, com segurança, certificação e excelente custo-benefício. Supermercados, comercial e industrial — três frentes com o mesmo padrão de engenharia BIM, fabricação certificada e montagem 100% parafusada.</p>
    </div>
    <div class="cg__grid">
      <a class="cg__c" href="/obras"><div class="cg__img"><img class="base" src="/assets/portfolio/supermercado-1.webp" alt="Supermercados em estrutura metálica" loading="lazy" /><img class="hov" src="/assets/portfolio/supermercado-2.webp" alt="" aria-hidden="true" loading="lazy" /><div class="cg__sh"></div><div class="cg__num">01</div><div class="cg__ti">Supermercados</div></div><div class="cg__bd"><p>Coberturas de grande vão livre, mezaninos e estruturas para varejo de alto fluxo. Obra rápida, com a loja já operando.</p><div class="cg__go"><b>Ver obras</b><i>&rarr;</i></div></div></a>
      <a class="cg__c" href="/obras"><div class="cg__img"><img class="base" src="/assets/portfolio/comercial-1.webp" alt="Obras comerciais em estrutura metálica" loading="lazy" /><img class="hov" src="/assets/portfolio/comercial-2.webp" alt="" aria-hidden="true" loading="lazy" /><div class="cg__sh"></div><div class="cg__num">02</div><div class="cg__ti">Comercial</div></div><div class="cg__bd"><p>Showrooms, concessionárias, lojas de materiais e centros logísticos urbanos. Pé-direito generoso e fachada limpa.</p><div class="cg__go"><b>Ver obras</b><i>&rarr;</i></div></div></a>
      <a class="cg__c" href="/obras"><div class="cg__img"><img class="base" src="/assets/portfolio/industrial-1.webp" alt="Obras industriais em estrutura metálica" loading="lazy" /><img class="hov" src="/assets/portfolio/industrial-2.webp" alt="" aria-hidden="true" loading="lazy" /><div class="cg__sh"></div><div class="cg__num">03</div><div class="cg__ti">Industrial</div></div><div class="cg__bd"><p>Galpões fabris, plantas industriais e pavilhões logísticos de grande porte. Engenharia para cargas pesadas e operação 24/7.</p><div class="cg__go"><b>Ver obras</b><i>&rarr;</i></div></div></a>
    </div>
    <div style="text-align:center;margin-top:56px"><a class="btn-ghost" style="color:var(--ink);border-color:var(--ink)" href="/obras">Ver portfólio completo <span>&rarr;</span></a></div>
  </section>

  <!-- DEPOIMENTOS -->
  <section class="sec dp" id="depoimentos">
    <div style="max-width:1440px;margin:0 auto 48px"><div class="eye"><span></span>Quem confia na Berti</div><h2 class="h2">Depoimentos</h2></div>
    <div class="dp__grid">
      <article class="dp__c"><p class="q">"Sistema prático, funcional, com bom custo-benefício. Gostamos muito do trabalho, tanto do Gustavo quanto do Carlos, pessoas honestas e sérias."</p><div class="dp__f"><img src="/assets/depoimentos/1.jpg" alt="Valdenir G. de Sales" loading="lazy" /><div><b>Valdenir G. de Sales</b><span>Diretor Presidente · Nipponflex</span></div></div></article>
      <article class="dp__c"><p class="q">"Parceria com a Berti garantiu rápida execução com qualidade e retorno financeiro consequentemente melhor."</p><div class="dp__f"><img src="/assets/depoimentos/2.jpg" alt="Raul Fulgêncio" loading="lazy" /><div><b>Raul Fulgêncio</b><span>Raul Fulgêncio Negócios Imobiliários</span></div></div></article>
      <article class="dp__c"><p class="q">"A obra foi bem econômica e eficiente, o que permitiu economizar e até antecipar a inauguração. Estamos muito satisfeitos com essa parceria."</p><div class="dp__f"><img src="/assets/depoimentos/3.jpg" alt="Arlei Luiz Camilo" loading="lazy" /><div><b>Arlei Luiz Camilo</b><span>Proprietário · GCA Alimentos</span></div></div></article>
      <article class="dp__c"><p class="q">"O projeto tinha uma estrutura muito diferenciada, onde só a Berti poderia executar isso para nós."</p><div class="dp__f"><img src="/assets/depoimentos/4.jpg" alt="Claudio Haruo Mukai" loading="lazy" /><div><b>Claudio Haruo Mukai</b><span>Diretor de Engenharia · SISA Construções</span></div></div></article>
    </div>
  </section>

  <!-- YOUTUBE -->
  <section class="sec yt" id="canal">
    <div class="yt__head">
      <div><div class="eye" style="color:#FF0000"><span style="background:#FF0000"></span>@bertiestruturalengenharia</div><h2 class="h2">Berti em movimento.</h2></div>
      <a class="yt__sub" href="https://www.youtube.com/@Bertiestruturalengenharia" target="_blank" rel="noopener">Inscrever-se</a>
    </div>
    <div class="yt__grid">
      <div class="yt__main" id="yt_main" data-id="otXMdsi8LIY">
        <img src="/assets/photos/aerial.jpg" alt="Carba Mall – Londrina PR | Estrutura Metálica em BIM" id="yt_poster" />
        <div class="yt__play" id="yt_playbtn"><svg width="30" height="34" viewBox="0 0 30 34"><polygon points="2,2 28,17 2,32" fill="#fff"/></svg></div>
        <div class="yt__caption" id="yt_cap">Carba Mall – Londrina PR</div>
      </div>
      <div class="yt__side">
        <button class="yt__t" data-id="Pj-tA7g7X1w" data-t="Millenium Open Mall – Londrina"><span class="th"><img src="https://i.ytimg.com/vi/Pj-tA7g7X1w/hqdefault.jpg" alt="Millenium Open Mall" loading="lazy" /></span><b>Millenium Open Mall – Londrina</b></button>
        <button class="yt__t" data-id="4qlqqPA_6hs" data-t="Super Muffato – Medianeira PR"><span class="th"><img src="https://i.ytimg.com/vi/4qlqqPA_6hs/hqdefault.jpg" alt="Super Muffato Medianeira" loading="lazy" /></span><b>Super Muffato – Medianeira PR</b></button>
        <button class="yt__t" data-id="noonzrTGMuY" data-t="Super Muffato – Francisco Beltrão PR"><span class="th"><img src="https://i.ytimg.com/vi/noonzrTGMuY/hqdefault.jpg" alt="Super Muffato Francisco Beltrão" loading="lazy" /></span><b>Super Muffato – Francisco Beltrão PR</b></button>
        <button class="yt__t" data-id="LqoWuLdZlNI" data-t="Supermercado Bavaresco – Paranaguá PR"><span class="th"><img src="https://i.ytimg.com/vi/LqoWuLdZlNI/hqdefault.jpg" alt="Supermercado Bavaresco Paranaguá" loading="lazy" /></span><b>Supermercado Bavaresco – Paranaguá PR</b></button>
      </div>
    </div>
  </section>

  <!-- BLOG -->
  <section class="sec hb" id="blog">
    <div class="hb__head">
      <div><div class="eye"><span></span>Blog · Notícias</div><h2 class="h2">Conteúdo técnico<br/>sobre estruturas metálicas</h2></div>
      <a href="/blog" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;letter-spacing:0.14em;text-transform:uppercase;color:var(--blue-dark);text-decoration:none;white-space:nowrap;border-bottom:2px solid var(--blue);padding-bottom:4px">Ver todas &rarr;</a>
    </div>
    <div class="hb__grid">$($hb.ToString())</div>
  </section>

  <!-- CTA -->
  <section class="cta" id="orcamento">
    <div class="cta__g"></div>
    <div class="cta__in">
      <div class="cta__eye">Vamos construir juntos</div>
      <h2>Tire seu projeto do papel<br/>com a <span>Berti Estrutural</span></h2>
      <p>Envie os dados do seu empreendimento e nossa equipe técnica prepara um orçamento sob medida — do projeto BIM à montagem em obra.</p>
      <div class="cta__btns">
        <a class="btn-primary" href="/contato">Solicitar Orçamento <span aria-hidden="true">&rarr;</span></a>
        <a class="btn-ghost" href="https://wa.me/$WHATS" target="_blank" rel="noopener">WhatsApp Direto</a>
      </div>
    </div>
  </section>
  $PARCEIROS
</main>

<!-- modal video institucional -->
<div class="vmod" id="hh_modal"><button class="vmod__x" aria-label="Fechar">&times;</button><div class="vmod__p"><iframe id="hh_iframe" title="Vídeo institucional Berti Estrutural" allow="autoplay; encrypted-media; fullscreen"></iframe></div></div>

<script>
(function(){
  // hero slideshow
  var hf=document.querySelectorAll('.hh__f'), hd=document.querySelectorAll('#hh_dots button'), hcap=document.getElementById('hh_cap');
  var caps=['Sky Mall · Londrina · PR','Nipponflex · Maringá · PR','Supermercado Camilo · Marialva · PR','Projeto Comercial · Ivaiporã · PR','Supermercado Bavaresco · Pontal do Paraná · PR'];
  var hi=0;
  function hg(n){hi=n;for(var k=0;k<hf.length;k++)hf[k].classList.toggle('on',k===hi);for(var j=0;j<hd.length;j++)hd[j].classList.toggle('on',j===hi);if(hcap)hcap.textContent=caps[hi];}
  for(var d=0;d<hd.length;d++){(function(b){b.addEventListener('click',function(){hg(parseInt(b.getAttribute('data-i'),10));});})(hd[d]);}
  setInterval(function(){hg((hi+1)%hf.length);},6000);
  // video modal
  var vm=document.getElementById('hh_modal'), vi=document.getElementById('hh_iframe');
  document.getElementById('hh_play').addEventListener('click',function(){vi.src='https://www.youtube.com/embed/ROzn_Gl4R2Q?autoplay=1&rel=0&modestbranding=1';vm.style.display='flex';});
  function closeV(){vm.style.display='none';vi.src='';}
  vm.addEventListener('click',function(e){if(e.target===vm||e.target.className==='vmod__x')closeV();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeV();});
  // youtube facade
  function ytLoad(id,title){var m=document.getElementById('yt_main');m.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1" title="'+title+'" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';}
  document.getElementById('yt_main').addEventListener('click',function(){ytLoad('otXMdsi8LIY','Carba Mall');});
  var yts=document.querySelectorAll('.yt__t');
  for(var y=0;y<yts.length;y++){(function(btn){btn.addEventListener('click',function(){ytLoad(btn.getAttribute('data-id'),btn.getAttribute('data-t'));});})(yts[y]);}
  // mapa Leaflet
  var MAP=[$($mapData.ToString())];
  function initMap(){
    if(!window.L||!document.getElementById('mp_map')){return;}
    var map=L.map('mp_map',{zoomControl:false,scrollWheelZoom:false}).setView([-23.3299,-51.1816],12);
    L.control.zoom({position:'bottomright'}).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OpenStreetMap &copy; CARTO',subdomains:'abcd',maxZoom:20}).addTo(map);
    var mk=[];
    for(var i=0;i<MAP.length;i++){
      var o=MAP[i];
      var icon=L.divIcon({className:'',html:'<div style="width:54px;height:66px"><div style="width:54px;height:54px;border-radius:13px;overflow:hidden;border:3px solid #47b6f1;box-shadow:0 8px 18px rgba(6,25,34,.4);background:#fff center/cover no-repeat;background-image:url(\''+o.c+'\')"></div><div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%) rotate(45deg);width:14px;height:14px;background:#47b6f1;border-radius:3px"></div></div>',iconSize:[54,66],iconAnchor:[27,66],popupAnchor:[0,-62]});
      var m=L.marker([o.lat,o.lng],{icon:icon}).addTo(map);
      m.bindPopup('<div style="width:220px;font-family:Open Sans,sans-serif"><img src="'+o.c+'" style="width:100%;height:115px;object-fit:cover;display:block"/><div style="padding:11px 13px"><div style="font-family:Barlow Condensed,sans-serif;font-weight:800;font-size:17px;text-transform:uppercase;color:#061922;line-height:1">'+o.t+'</div><div style="margin-top:5px;font-size:12.5px;color:#5b6b75">'+o.a+'</div></div></div>',{minWidth:220});
      mk.push(m);
    }
    var lis=document.querySelectorAll('.mp__it');
    for(var j=0;j<lis.length;j++){(function(el,idx){el.addEventListener('click',function(ev){ev.preventDefault();if(mk[idx]){map.flyTo(mk[idx].getLatLng(),16,{duration:0.8});map.once('moveend',function(){mk[idx].openPopup();});}});})(lis[j],j);}
    setTimeout(function(){map.invalidateSize();},250);
  }
  if(MAP.length){ if(window.L){initMap();}else{var t=0,iv=setInterval(function(){if(window.L||t++>40){clearInterval(iv);if(window.L)initMap();}},80);} }
})();
</script>
"@
$homeHtml = RenderPage @{ title='Berti Estrutural — Engenharia em estruturas metálicas | Londrina-PR'; desc='A estrutura por trás de grandes obras. Projeto, fabricação e montagem de estruturas metálicas para supermercados, comércio e indústria. Engenharia BIM e montagem 100% parafusada — Londrina/PR.'; canon="$SITE/"; ogtype='website'; ogtitle='Berti Estrutural — A estrutura por trás de grandes obras'; ogimg="$SITE/assets/photos/hero-01.jpg"; extrahead=$homeExtra; main=$homeMain }
[System.IO.File]::WriteAllText((Join-Path $root 'index.html'), $homeHtml, $enc)
Write-Output "Home gerada (index.html) — $($mapObras.Count) obras no mapa"
