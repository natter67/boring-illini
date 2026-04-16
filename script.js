/* ============================================================
   BORING ILLINI — JAVASCRIPT
   Scroll animations, tunnel canvas, counter, mobile menu
   ============================================================ */

/* ── Navbar scroll effect ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = open ? 'none' : 'flex';
  hamburger.querySelector('span:nth-child(1)').style.transform = open ? '' : 'translateY(7px) rotate(45deg)';
  hamburger.querySelector('span:nth-child(2)').style.opacity = open ? '1' : '0';
  hamburger.querySelector('span:nth-child(3)').style.transform = open ? '' : 'translateY(-7px) rotate(-45deg)';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.style.display = 'none';
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
}));

/* ── Scroll reveal (Intersection Observer) ─────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter animation ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── Tunnel Canvas animation ──────────────────────────────── */
(function () {
  const canvas = document.getElementById('tunnelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, frame = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const RINGS = 18;
  const SPEED = 0.004;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dark radial background gradient
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
    bgGrad.addColorStop(0, 'rgba(20, 20, 20, 0)');
    bgGrad.addColorStop(0.5, 'rgba(8, 8, 8, 0)');
    bgGrad.addColorStop(1, 'rgba(8, 8, 8, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy) * 1.1;
    const offset = (frame * SPEED) % 1;

    for (let i = 0; i < RINGS; i++) {
      // Rings move outward from center
      const t = ((i / RINGS) + offset) % 1;
      const r = t * maxR;
      const alpha = Math.pow(1 - t, 1.5) * 0.55;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232, 74, 39, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Cross-hair lines (very subtle)
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 74, 39, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 16]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.restore();

    // Center glow dot
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    cGrad.addColorStop(0, 'rgba(232, 74, 39, 0.35)');
    cGrad.addColorStop(0.4, 'rgba(232, 74, 39, 0.08)');
    cGrad.addColorStop(1, 'rgba(232, 74, 39, 0)');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fill();

    // Vignette overlay
    const vGrad = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.25, cx, cy, Math.max(W, H) * 0.75);
    vGrad.addColorStop(0, 'rgba(8,8,8,0)');
    vGrad.addColorStop(1, 'rgba(8,8,8,0.9)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, W, H);

    frame++;
    requestAnimationFrame(draw);
  }

  draw();
})();

/* ── Active nav link on scroll ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--orange)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeLinkObserver.observe(s));

/* ── Cutterhead Canvas Animation ───────────────────────────── */
(function () {
  const canvas = document.getElementById('cutterheadCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // The wireframe image is 960x540. Cutterhead is on the LEFT side of the machine.
  // These are fractional positions relative to canvas size — tweak if needed.
  const CH_X  = 0.155;  // cutterhead center X (fraction of width)
  const CH_Y  = 0.50;   // cutterhead center Y (fraction of height)
  const CH_R  = 0.195;  // cutterhead radius   (fraction of height)

  let W, H, cx, cy, R, frame = 0;

  function resize() {
    const wrap = canvas.parentElement;
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
    cx = W * CH_X;
    cy = H * CH_Y;
    R  = H * CH_R;
  }

  resize();
  window.addEventListener('resize', resize);

  // Particles
  const PARTICLES = [];
  const MAX_P = 40;
  function spawnParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.2;
    PARTICLES.push({
      x: cx + Math.cos(angle) * R * 0.85,
      y: cy + Math.sin(angle) * R * 0.85,
      vx: Math.cos(angle) * speed * (0.6 + Math.random()),
      vy: Math.sin(angle) * speed * (0.6 + Math.random()),
      life: 1,
      decay: 0.012 + Math.random() * 0.018,
      size: 1 + Math.random() * 2.5,
    });
  }

  function draw() {
    // Sync canvas size to element's rendered size
    const wrap = canvas.parentElement;
    if (wrap.offsetWidth !== W || wrap.offsetHeight !== H) resize();

    ctx.clearRect(0, 0, W, H);
    frame++;

    const rot  = frame * 0.012;   // main rotation speed
    const rot2 = frame * 0.007;   // counter-rotation for outer ring

    // ── Outer glow pulse ──────────────────────────────────────
    const pulseAlpha = 0.08 + 0.04 * Math.sin(frame * 0.04);
    const glow = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.6);
    glow.addColorStop(0, `rgba(232,74,39,${pulseAlpha})`);
    glow.addColorStop(1, 'rgba(232,74,39,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // ── Outer ring (counter-rotating) ─────────────────────────
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-rot2);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.05, a, a + 0.18);
      ctx.strokeStyle = `rgba(232,74,39,0.25)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    // ── Main cutterhead disc ──────────────────────────────────
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Disc fill (very subtle)
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8,8,8,0.25)';
    ctx.fill();

    // Disc border
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(232,74,39,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6 main spokes
    const SPOKES = 6;
    for (let i = 0; i < SPOKES; i++) {
      const a = (i / SPOKES) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92);
      ctx.strokeStyle = `rgba(232,74,39,0.55)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cutter disc at spoke tip
      const tx = Math.cos(a) * R * 0.78;
      const ty = Math.sin(a) * R * 0.78;
      ctx.beginPath();
      ctx.arc(tx, ty, R * 0.07, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,74,39,0.85)';
      ctx.fill();
    }

    // Inner rings
    [0.65, 0.42, 0.22].forEach((frac, idx) => {
      ctx.beginPath();
      ctx.arc(0, 0, R * frac, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232,74,39,${0.3 - idx * 0.06})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Center hub
    const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.14);
    hubGrad.addColorStop(0, 'rgba(255,120,60,1)');
    hubGrad.addColorStop(0.5, 'rgba(232,74,39,0.9)');
    hubGrad.addColorStop(1, 'rgba(232,74,39,0)');
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();

    ctx.restore();

    // ── Scan line sweeping across the machine body ─────────────
    const scanX = cx + R + ((frame * 1.2) % (W - cx - R));
    const scanGrad = ctx.createLinearGradient(scanX - 30, 0, scanX + 30, 0);
    scanGrad.addColorStop(0, 'rgba(100,180,255,0)');
    scanGrad.addColorStop(0.5, 'rgba(100,180,255,0.08)');
    scanGrad.addColorStop(1, 'rgba(100,180,255,0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(scanX - 30, cy - H * 0.22, 60, H * 0.44);

    // ── Particles (muck debris) ───────────────────────────────
    if (frame % 3 === 0 && PARTICLES.length < MAX_P) spawnParticle();

    for (let i = PARTICLES.length - 1; i >= 0; i--) {
      const p = PARTICLES[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.life -= p.decay;
      if (p.life <= 0) { PARTICLES.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,74,39,${p.life * 0.7})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // Wait for the image to load before first draw so dimensions are right
  const img = canvas.parentElement.querySelector('.tbm-wireframe-img');
  if (img && !img.complete) {
    img.addEventListener('load', () => { resize(); draw(); });
  } else {
    draw();
  }
})();

/* ── Smooth scroll for all anchor links ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Hero photo slideshow ──────────────────────────────────── */
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();
