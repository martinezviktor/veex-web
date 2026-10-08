// Genera terms.html, privacy.html y delete-account.html (SOLO EN INGLÉS) desde los textos de la app
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
  </style>
</head>
<body>
  <header>
    <a class="logo" href="/">VEEX<span></span></a>
  </header>
  <main>
    <div data-en>
      <div class="borrador">Draft — under legal review. This document may change before VEEX launches.</div>
      <h1>${p.titulo}</h1>
      <div class="sub">Last updated: ${textos.ACTUALIZADO}</div>${seccion(p.en)}
    </div>
    <nav class="docs">
      <a href="/terms">Terms of Service</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/delete-account">Delete account</a>
      <a href="/">veexapp.com</a>
    </nav>
  </main>
</body>
</html>
`

for (const p of PAGINAS) {
  writeFileSync(p.archivo, html(p))
  console.log('✓', p.archivo)
}
