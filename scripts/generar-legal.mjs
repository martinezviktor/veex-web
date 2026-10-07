// Genera terms.html, privacy.html y delete-account.html desde los textos de la app
// (../veex/src/legalTextos.js), para que la app y la página siempre digan lo mismo.
// Uso:  node scripts/generar-legal.mjs
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const textos = await import(pathToFileURL(resolve('../veex/src/legalTextos.js')).href)

const escapar = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // correos → links
  .replace(/([a-z]+@veexapp\.com)/g, '<a href="mailto:$1">$1</a>')

const seccion = (lista) => lista.map(({ titulo, texto }) => `
      <h2>${escapar(titulo)}</h2>
      <p>${escapar(texto)}</p>`).join('')

const PAGINAS = [
  {
    archivo: 'terms.html',
    titulo: 'Terms of Service', tituloEs: 'Términos del servicio',
    en: textos.TERMINOS_EN, es: textos.TERMINOS_ES
  },
  {
    archivo: 'privacy.html',
    titulo: 'Privacy Policy', tituloEs: 'Política de privacidad',
    en: textos.PRIVACIDAD_EN, es: textos.PRIVACIDAD_ES
  },
  {
    archivo: 'delete-account.html',
    titulo: 'Delete your account', tituloEs: 'Borrar tu cuenta',
    en: textos.BORRAR_CUENTA_EN, es: textos.BORRAR_CUENTA_ES
  }
]

const html = (p) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.titulo} — VEEX</title>
  <meta name="description" content="VEEX ${p.titulo}.">
  <meta name="theme-color" content="#0a0a0a">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Jost:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #0a0a0a; --bg2: #141414; --text: #fff; --text2: #b5b5b5; --text3: #777; --border: #2a2a2a; --purple: #7C3AED; --orange: #FF6A13; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Jost', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: 760px; margin: 0 auto; padding: 24px 16px; }
    .logo { font-family: 'Archivo', 'Jost', sans-serif; font-weight: 900; font-size: 34px; color: var(--text); text-decoration: none; line-height: 1; }
    .logo span { display: inline-block; width: 0.2em; height: 0.2em; margin-left: 0.06em; background: var(--purple); }
    .lang { display: flex; gap: 4px; }
    .lang button { background: none; border: 1px solid var(--border); color: var(--text3); font: 700 11px 'Jost', sans-serif; letter-spacing: 1px; padding: 6px 10px; cursor: pointer; }
    .lang button.on { color: var(--text); border-color: var(--purple); }
    main { max-width: 760px; margin: 0 auto; padding: 8px 16px 48px; }
    .borrador { border: 1px solid var(--orange); color: var(--orange); padding: 10px 14px; font-size: 13px; font-weight: 600; margin-bottom: 28px; }
    h1 { font-size: clamp(28px, 6vw, 40px); line-height: 1.15; margin-bottom: 8px; }
    .sub { color: var(--text3); font-size: 13px; margin-bottom: 28px; }
    h2 { font-size: 17px; margin: 26px 0 6px; }
    p { color: var(--text2); font-size: 15px; }
    a { color: #a78bfa; }
    nav.docs { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 13px; }
    nav.docs a { color: var(--text2); text-decoration: none; }
    nav.docs a:hover { color: var(--text); }
    [data-es] { display: none; }
    html[lang="es"] [data-en] { display: none; }
    html[lang="es"] [data-es] { display: block; }
  </style>
</head>
<body>
  <header>
    <a class="logo" href="/">VEEX<span></span></a>
    <div class="lang">
      <button type="button" id="btn-en" onclick="idioma('en')">EN</button>
      <button type="button" id="btn-es" onclick="idioma('es')">ES</button>
    </div>
  </header>
  <main>
    <div data-en>
      <div class="borrador">Draft — under legal review. This document may change before VEEX launches.</div>
      <h1>${p.titulo}</h1>
      <div class="sub">Last updated: ${textos.ACTUALIZADO}</div>${seccion(p.en)}
    </div>
    <div data-es>
      <div class="borrador">Borrador — en revisión legal. Este documento puede cambiar antes del lanzamiento de VEEX.</div>
      <h1>${p.tituloEs}</h1>
      <div class="sub">Última actualización: ${textos.ACTUALIZADO_ES}</div>${seccion(p.es)}
    </div>
    <nav class="docs">
      <a href="/terms">Terms / Términos</a>
      <a href="/privacy">Privacy / Privacidad</a>
      <a href="/delete-account">Delete account / Borrar cuenta</a>
      <a href="/">veexapp.com</a>
    </nav>
  </main>
  <script>
    function idioma(l) {
      document.documentElement.lang = l
      document.getElementById('btn-en').classList.toggle('on', l === 'en')
      document.getElementById('btn-es').classList.toggle('on', l === 'es')
      try { localStorage.setItem('veex-lang', l) } catch (e) {}
    }
    var guardado = null
    try { guardado = localStorage.getItem('veex-lang') } catch (e) {}
    idioma(guardado || ((navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en'))
  </script>
</body>
</html>
`

for (const p of PAGINAS) {
  writeFileSync(p.archivo, html(p))
  console.log('✓', p.archivo)
}
