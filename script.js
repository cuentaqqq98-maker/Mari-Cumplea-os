/* ════════════════════════════════════════════════
   BIRTHDAY PAGE — script.js
   Sections:
   1. Floating particles (hearts & notes)
   2. Background music control
   3. Scroll reveal
   4. Gallery + Lightbox
   5. Envelope / Letter + voice audio
   6. Video placeholder detection
   7. Surprise button + confetti
════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════════
   1. FLOATING PARTICLES
   Hearts and very subtle musical notes
   drift up across the page.
══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx    = canvas.getContext("2d");

  let W, H;
  const particles = [];

  // Particle types — mostly hearts, a few discreet notes
  const TYPES = ["❤", "♡", "❤", "♡", "❤", "♩", "♪"];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function createParticle() {
    return {
      x:    Math.random() * W,
      y:    H + 30,
      size: 10 + Math.random() * 14,
      speedY: 0.5 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: 0.12 + Math.random() * 0.2,
      type:  TYPES[Math.floor(Math.random() * TYPES.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
    };
  }

  // Populate initial particles spread across height
  for (let i = 0; i < 30; i++) {
    const p = createParticle();
    p.y = Math.random() * H;
    particles.push(p);
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    frame++;
    // Spawn new particle every ~90 frames
    if (frame % 90 === 0) particles.push(createParticle());

    ctx.textBaseline = "middle";
    ctx.textAlign    = "center";

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y     -= p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x     += Math.sin(p.wobble) * 0.35 + p.speedX;

      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.type.includes("♩") || p.type.includes("♪")
        ? "rgba(200,146,74,0.9)"
        : "rgba(212,104,122,0.9)";
      ctx.fillText(p.type, p.x, p.y);

      // Remove when off-screen
      if (p.y < -40) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }
  animate();
})();


/* ══════════════════════════════════════
   2. BACKGROUND MUSIC CONTROL
   REPLACE: audio/musica_fondo.mp3
   Intenta reproducir al cargar la página.
   Si el navegador lo bloquea, arranca en
   el primer clic del usuario (política de
   autoplay de los navegadores modernos).
══════════════════════════════════════ */
(function initMusic() {
  const music = document.getElementById("bg-music");
  const btn   = document.getElementById("music-btn");
  let playing = false;

  music.volume = 0.35;

  // Intento inmediato al cargar
  function tryPlay() {
    music.play()
      .then(() => { playing = true; updateBtn(); })
      .catch(() => {
        // Bloqueado por el navegador: esperar primer clic del usuario
        document.addEventListener("click", function startOnClick() {
          music.play()
            .then(() => { playing = true; updateBtn(); })
            .catch(() => {});
          document.removeEventListener("click", startOnClick);
        }, { once: true });
      });
  }

  // Lanzar cuando el DOM esté listo
  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryPlay();
  } else {
    document.addEventListener("DOMContentLoaded", tryPlay, { once: true });
  }

  // Botón manual de pausa / reanudación
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (playing) {
      music.pause();
      playing = false;
    } else {
      music.play().then(() => { playing = true; });
    }
    updateBtn();
  });

  function updateBtn() {
    const icon = btn.querySelector(".music-icon");
    icon.textContent = playing ? "♪" : "♩";
    btn.title = playing ? "Pausar música" : "Reanudar música";
  }

  // Exponer referencia global para que el video pueda pausar/reanudar
  window._bgMusic = { audio: music, getPlaying: () => playing, setPlaying: (v) => { playing = v; updateBtn(); } };
})();


/* ══════════════════════════════════════
   3. SCROLL REVEAL
   Elements with class .reveal fade in
   when they enter the viewport.
══════════════════════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  items.forEach((el) => observer.observe(el));
})();


/* ══════════════════════════════════════
   4. GALLERY + LIGHTBOX
   Click any photo to open lightbox.
   REPLACE: images/foto1.jpg … foto6.jpg
   Update data-caption attributes too.
══════════════════════════════════════ */
(function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lbImg    = document.getElementById("lb-img");
  const lbCap    = document.getElementById("lb-caption");
  const lbClose  = document.getElementById("lb-close");

  document.querySelectorAll(".photo-item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.dataset.src;
      const cap = item.dataset.caption || "";
      lbImg.src = src;
      lbImg.alt = cap;
      lbCap.textContent = cap;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLb() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { lbImg.src = ""; }, 400);
  }

  lbClose.addEventListener("click", closeLb);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLb();
  });
})();


/* ══════════════════════════════════════
   5. ENVELOPE + LETTER + VOICE AUDIO
   Click "Abrir mi carta":
   - Envelope flap opens (CSS animation)
   - Letter card fades in below
   - voice audio starts (carta_voz.mp3)
   REPLACE: audio/carta_voz.mp3
══════════════════════════════════════ */
(function initEnvelope() {
  const envelope   = document.getElementById("envelope");
  const openBtn    = document.getElementById("env-open-btn");
  const letterCard = document.getElementById("letter-card");
  const closeBtn   = document.getElementById("letter-close-btn");
  const voiceAudio = document.getElementById("carta-audio");

  let isOpen = false;

  openBtn.addEventListener("click", () => {
    if (isOpen) return;
    isOpen = true;

    // 1. Open envelope flap
    envelope.classList.add("open");
    openBtn.style.opacity = "0";
    openBtn.style.pointerEvents = "none";

    // 2. Show letter card after flap animation
    setTimeout(() => {
      letterCard.classList.add("visible");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          letterCard.classList.add("animated");
        });
      });

      // 3. Play voice audio in sync with letter appearance
      voiceAudio.volume = 0.9;
      voiceAudio.currentTime = 0;
      voiceAudio.play().catch(() => {
        // Autoplay blocked — audio will still play on next user interaction
      });

    }, 650);
  });

  closeBtn.addEventListener("click", () => {
    // Close letter
    letterCard.classList.remove("animated");
    setTimeout(() => { letterCard.classList.remove("visible"); }, 700);

    // Reset envelope
    envelope.classList.remove("open");
    openBtn.style.opacity = "1";
    openBtn.style.pointerEvents = "auto";
    isOpen = false;

    // Stop voice audio
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
  });
})();


/* ══════════════════════════════════════
   6. VIDEO PLACEHOLDER DETECTION
   Hides the placeholder once the video
   has a valid source that can play.
   Al reproducir el video → pausa la música.
   Al pausar / terminar → reanuda la música.
══════════════════════════════════════ */
(function initVideo() {
  const video       = document.getElementById("main-video");
  const placeholder = document.getElementById("video-placeholder");

  if (!video) return;

  video.addEventListener("canplay", () => {
    if (placeholder) placeholder.style.display = "none";
  });

  // Si el archivo no existe, mantener el placeholder
  video.addEventListener("error", () => {
    if (placeholder) placeholder.style.display = "flex";
    video.style.display = "none";
  });

  // Pausar música de fondo cuando el video empieza
  video.addEventListener("play", () => {
    const bg = window._bgMusic;
    if (!bg) return;
    if (bg.getPlaying()) {
      bg.audio.pause();
      bg.setPlaying(false);
      video._pausedBgMusic = true; // recordar que fuimos nosotros
    }
  });

  // Reanudar música cuando el video se pausa o termina
  function resumeMusic() {
    const bg = window._bgMusic;
    if (!bg || !video._pausedBgMusic) return;
    video._pausedBgMusic = false;
    bg.audio.play()
      .then(() => bg.setPlaying(true))
      .catch(() => {});
  }

  video.addEventListener("pause", resumeMusic);
  video.addEventListener("ended", resumeMusic);
})();


/* ══════════════════════════════════════
   7. SURPRISE BUTTON + CONFETTI
   Al abrir: reproduce audio/sorpresa.mp3
   y lluvia de corazones/confeti.
   REEMPLAZA: audio/sorpresa.mp3
══════════════════════════════════════ */
(function initSurprise() {
  const btn           = document.getElementById("surprise-btn");
  const overlay       = document.getElementById("surprise-overlay");
  const closeX        = document.getElementById("surprise-close");
  const surpriseAudio = document.getElementById("sorpresa-audio");

  btn.addEventListener("click", () => {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    launchConfetti();

    // Pausa música de fondo mientras suena el grito
    const bg = window._bgMusic;
    if (bg && bg.getPlaying()) {
      bg.audio.pause();
      bg.setPlaying(false);
      overlay._pausedBg = true;
    }

    // Reproduce el audio sorpresa desde el inicio
    if (surpriseAudio) {
      surpriseAudio.currentTime = 0;
      surpriseAudio.volume = 1;
      surpriseAudio.play().catch(() => {});

      // Cuando termina el grito, reanuda la música de fondo
      surpriseAudio.onended = () => {
        if (overlay._pausedBg) {
          const bg2 = window._bgMusic;
          if (bg2) bg2.audio.play().then(() => bg2.setPlaying(true)).catch(() => {});
          overlay._pausedBg = false;
        }
      };
    }
  });

  function close() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    stopConfetti();

    // Detiene el audio sorpresa si aún suena
    if (surpriseAudio) {
      surpriseAudio.pause();
      surpriseAudio.currentTime = 0;
    }

    // Reanuda música de fondo si la habíamos pausado
    if (overlay._pausedBg) {
      const bg = window._bgMusic;
      if (bg) bg.audio.play().then(() => bg.setPlaying(true)).catch(() => {});
      overlay._pausedBg = false;
    }
  }

  closeX.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // ── Confetti ──
  const canvas  = document.getElementById("confetti-canvas");
  const ctx     = canvas.getContext("2d");
  let   rafId   = null;
  let   pieces  = [];
  let   running = false;

  const COLORS = [
    "#fff",
    "#fde8ed",
    "#f5c2cc",
    "#ffd6df",
    "#ffe4b5",
    "#ffd700",
  ];
  const SHAPES = ["❤", "♡", "✿", "★", "❤", "❤"];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnPiece() {
    return {
      x:      Math.random() * canvas.width,
      y:      -20,
      vy:     3 + Math.random() * 4,
      vx:     (Math.random() - 0.5) * 3,
      size:   14 + Math.random() * 18,
      alpha:  0.7 + Math.random() * 0.3,
      shape:  SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.04,
      spin:   (Math.random() - 0.5) * 0.1,
    };
  }

  function launchConfetti() {
    running = true;
    resizeCanvas();
    pieces = [];
    for (let i = 0; i < 80; i++) {
      const p = spawnPiece();
      p.y = Math.random() * canvas.height; // Spread initial
      pieces.push(p);
    }
    tick();
  }

  let spawnTimer = 0;
  function tick() {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer++;
    if (spawnTimer % 4 === 0 && pieces.length < 150) {
      pieces.push(spawnPiece());
    }

    ctx.textBaseline = "middle";
    ctx.textAlign    = "center";

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.y      += p.vy;
      p.x      += p.vx + Math.sin(p.wobble) * 0.8;
      p.wobble += p.wobbleSpeed;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin * p.wobble * 10);
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();

      if (p.y > canvas.height + 30) pieces.splice(i, 1);
    }
  }

  function stopConfetti() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = [];
    spawnTimer = 0;
  }

  window.addEventListener("resize", () => {
    if (running) resizeCanvas();
  });
})();
