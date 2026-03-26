'use strict';

/* ================================================
   1. MOBILE HAMBURGER MENU
================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
}

/* ================================================
   2. CUSTOM CURSOR (desktop only)
================================================ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const interactiveEls = 'a, button, .project-card, .exp-card, .edu-card, .cert-badge, .skill-tag, .pill, .contact-link, .badge-float';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursorRing.style.width  = '56px';
      cursorRing.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      cursorRing.style.width  = '36px';
      cursorRing.style.height = '36px';
    });
  });
}

/* ================================================
   3. TYPEWRITER (Typed.js)
================================================ */
if (typeof Typed !== 'undefined' && document.getElementById('typewriter')) {
  new Typed('#typewriter', {
    strings: [
      'Generative AI Engineer',
      'AI/ML Engineer',
      'Full Stack Developer',
      'RAG Pipeline Architect',
      'Agentic AI Systems'
    ],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1800,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
}

/* ================================================
   4. STAT COUNTERS (IntersectionObserver)
================================================ */
function animCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';
  const step    = target / 60;
  let current   = 0;
  const iv = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(iv);
  }, 20);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

/* ================================================
   5. SCROLL REVEAL (IntersectionObserver)
================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .timeline-item, .project-card, .skill-group').forEach(el => {
  revealObs.observe(el);
});

/* ================================================
   6. THREE.JS GLOBE
================================================ */
(function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = () => window.innerWidth < 600;
  const getSize  = () => Math.min(window.innerWidth * (isMobile() ? 0.88 : 0.65), 600);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  let sz = getSize();
  renderer.setSize(sz, sz);
  canvas.style.width  = sz + 'px';
  canvas.style.height = sz + 'px';

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 2.2;

  // Wireframe sphere
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.15 })
  );
  scene.add(globe);

  // Surface points
  const ptGeo = new THREE.BufferGeometry();
  const pos   = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = Math.cos(phi);
  }
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
    color: 0x00ffa3, size: 0.022, transparent: true, opacity: 0.7
  })));

  // Orbit rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1 + i * 0.08, 0.003, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x7b2fff, transparent: true, opacity: 0.2 - i * 0.05 })
    );
    ring.rotation.x = Math.PI / 2 + i * 0.5;
    ring.rotation.y = i * 0.8;
    scene.add(ring);
  }

  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.003;
    globe.rotation.x += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    sz = getSize();
    renderer.setSize(sz, sz);
    canvas.style.width  = sz + 'px';
    canvas.style.height = sz + 'px';
  });
})();

/* ================================================
   7. BACKGROUND PARTICLE FIELD
================================================ */
(function initParticles() {
  const bgCanvas = document.getElementById('bg-canvas');
  if (!bgCanvas) return;

  const ctx = bgCanvas.getContext('2d');
  const isMob = () => window.innerWidth < 600;
  let W, H;

  function resize() {
    W = bgCanvas.width  = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = isMob() ? 50 : 110;
  const pts = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r:  Math.random() * 1.3 + 0.3,
    a:  Math.random() * 0.4 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${p.a})`;
      ctx.fill();
    });

    const connDist = isMob() ? 75 : 115;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < connDist) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - d / connDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ================================================
   8. NEURAL NETWORK CANVAS (About section)
================================================ */
(function initNeural() {
  // Draw animated neural net on the about section background
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  canvas.style.cssText = `
    position:absolute; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:0; opacity:0.18;
  `;
  aboutSection.style.position = 'relative';
  aboutSection.insertBefore(canvas, aboutSection.firstChild);

  const ctx = canvas.getContext('2d');

  function resizeNeural() {
    canvas.width  = aboutSection.offsetWidth;
    canvas.height = aboutSection.offsetHeight;
  }
  resizeNeural();
  window.addEventListener('resize', resizeNeural);

  const layers = [3, 5, 4, 2];
  function draw(t) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (W === 0 || H === 0) { requestAnimationFrame(draw); return; }

    const lx = [W * 0.12, W * 0.38, W * 0.64, W * 0.88];
    const nodes = [];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        nodes.push({ x: lx[li], y: (H / (count + 1)) * (i + 1), layer: li, pulse: i * 1.3 + li * 0.7 });
      }
    });

    // Connections
    nodes.forEach(n => {
      nodes.filter(m => m.layer === n.layer + 1).forEach(m => {
        const a = 0.05 + 0.04 * Math.sin(t * 0.002 + n.pulse);
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = `rgba(0,200,255,${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    });

    // Nodes
    nodes.forEach(n => {
      const glow = 0.4 + 0.3 * Math.sin(t * 0.003 + n.pulse);
      const r = 5;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
      g.addColorStop(0, `rgba(0,200,255,${glow})`);
      g.addColorStop(1, 'rgba(0,200,255,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${0.8 + 0.2 * Math.sin(t * 0.003 + n.pulse)})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ================================================
   9. 3D CARD TILT (desktop only)
================================================ */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.exp-card, .project-card, .edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ================================================
   10. READ MORE / READ LESS (Experience)
================================================ */
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const card  = this.closest('.exp-card');
    const extra = card.querySelector('.bullets-extra');
    if (!extra) return;
    const isOpen = extra.classList.contains('open');
    extra.classList.toggle('open');
    this.setAttribute('aria-expanded', String(!isOpen));
    this.innerHTML = isOpen ? 'Read More &#x2193;' : 'Read Less &#x2191;';
  });
});

/* ================================================
   11. NAVBAR ACTIVE STATE ON SCROLL
================================================ */
(function initNavActive() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

/* ================================================
   12. SMOOTH SCROLL FOR ANCHOR LINKS
================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
