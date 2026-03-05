═══════════════════════════════════════════════
  REGALO DE CUMPLEAÑOS PARA MAMÁ — Instrucciones
═══════════════════════════════════════════════

ESTRUCTURA DE ARCHIVOS:
  index.html       → Página principal
  style.css        → Estilos visuales
  script.js        → Interactividad
  /images/         → Coloca tus fotos aquí
  /audio/          → Coloca tus archivos de audio aquí
  /video/          → Coloca tu video aquí

CÓMO PERSONALIZAR:

1. FOTOS (carpeta /images/):
   → Nombra tus fotos: foto1.jpg, foto2.jpg … foto6.jpg
   → O edita en index.html los atributos src="images/foto1.jpg"
     y data-caption="Tu texto aquí" de cada .photo-item

2. MÚSICA DE FONDO (carpeta /audio/):
   → Coloca tu archivo MP3 como: audio/musica_fondo.mp3
   → Se reproduce en loop al cargar la página

3. AUDIO DE LA CARTA (carpeta /audio/):
   → Graba la voz leyendo la carta y guárdala como: audio/carta_voz.mp3
   → Se activa automáticamente al abrir el sobre

4. VIDEO (carpeta /video/):
   → Coloca tu video como: video/recuerdos.mp4
   → También puedes agregar una imagen de portada: images/video-poster.jpg

5. TEXTO DE LA CARTA:
   → Abre index.html y busca "REPLACE this text with your personal letter"
   → Edita los párrafos dentro de .letter-body y .letter-greeting

6. PARA VER LA PÁGINA:
   → Abre index.html en un navegador moderno (Chrome, Firefox, Safari)
   → Para que el audio funcione correctamente, usa un servidor local:
     - VS Code Live Server
     - o ejecuta: python3 -m http.server 8000
       y abre: http://localhost:8000

═══════════════════════════════════════════════
