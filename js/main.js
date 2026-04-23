/* ============================================================
   3D Glass Portfolio — main.js
   Diamond tilt, magnetic cursor, shimmer tracking,
   parallax, typed, counters, Three.js bg
   ============================================================ */

'use strict';

// ── Cursor ────────────────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
});

(function lerpRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a,button,.btn,.filter-btn,.tech-chip,.project-card,.skill-category,.tool-card,.ai-impact-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});
document.addEventListener('mousedown', () => ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring.classList.remove('click'));

// ── Scroll Progress ───────────────────────────────────────────
const bar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
}, { passive: true });

// ── Navbar Scroll ─────────────────────────────────────────────
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 55), { passive: true });

// ── Typed Roles ───────────────────────────────────────────────
function initTyped() {
  const el = document.querySelector('.typed-role');
  if (!el) return;
  const roles = ['WordPress Expert','Core Contributor','Plugin Developer','Web Developer','Performance Engineer','AI-Powered Builder'];
  let ri = 0, ci = 0, del = false;
  function tick() {
    const cur = roles[ri];
    el.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
    let ms = del ? 42 : 80;
    if (!del && ci > cur.length) { ms = 1800; del = true; }
    else if (del && ci < 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; ms = 280; }
    setTimeout(tick, ms);
  }
  tick();
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 75);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => io.observe(el));
}

// ── Skill Bars ────────────────────────────────────────────────
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = e.target.dataset.width; io.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill,.mastery-fill').forEach(f => io.observe(f));
}

// ── Counter Anim ──────────────────────────────────────────────
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.count);
      const suf = e.target.dataset.suffix || '';
      let current = 0;
      const step = target / 55;
      const t = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(t); }
        e.target.textContent = Math.floor(current) + suf;
      }, 16);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach(el => io.observe(el));
}

// ── Active Nav ────────────────────────────────────────────────
function setActiveNav() {
  const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === p) a.classList.add('active');
  });
}

// ── Project Filter ────────────────────────────────────────────
function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.style.opacity    = show ? '1' : '0.15';
      c.style.transform  = show ? '' : 'scale(0.94)';
      c.style.pointerEvents = show ? '' : 'none';
      c.style.transition = 'opacity .4s, transform .4s';
    });
  }));
}

// ── Parallax ──────────────────────────────────────────────────
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    els.forEach(el => { el.style.transform = `translateY(${sy * parseFloat(el.dataset.parallax)}px)`; });
  }, { passive: true });
}

// ════════════════════════════════════════════════════════════
// DIAMOND TILT — tracks mouse light specular across the face
// ════════════════════════════════════════════════════════════
function initDiamondTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    // inject shine layer if not present
    if (!card.querySelector('.tilt-shine')) {
      const shine = document.createElement('div');
      shine.className = 'tilt-shine';
      shine.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5;border-radius:inherit;transition:opacity .3s;';
      card.appendChild(shine);
    }
    const shine = card.querySelector('.tilt-shine');

    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; shine.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), box-shadow 0.7s';
      card.style.transform  = '';
      shine.style.background = '';
      shine.style.opacity = '0';
    });

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left)  / r.width  - 0.5;   // -0.5 … 0.5
      const ny = (e.clientY - r.top)   / r.height - 0.5;

      const tiltX = ny * -18;   // rotateX
      const tiltY = nx *  18;   // rotateY

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px) scale(1.01)`;

      // Light specular — moves opposite to tilt (reflection law)
      const lx = 50 + nx * -80;
      const ly = 50 + ny * -80;
      shine.style.background = `
        radial-gradient(circle at ${lx}% ${ly}%,
          rgba(255,255,255,0.18) 0%,
          rgba(180,220,255,0.08) 30%,
          transparent 65%
        )
      `;
    });
  });
}

// ════════════════════════════════════════════════════════════
// HOVER SWIPE SHIMMER — inject .swipe-shine into hover-swipe els
// ════════════════════════════════════════════════════════════
function initSwipeShine() {
  document.querySelectorAll('.hover-swipe').forEach(el => {
    if (el.querySelector('.swipe-shine')) return;
    const s = document.createElement('div');
    s.className = 'swipe-shine';
    el.appendChild(s);
  });
}

// ════════════════════════════════════════════════════════════
// HERO CARD 3D — follows mouse globally for cinematic depth
// ════════════════════════════════════════════════════════════
function initHeroCard() {
  const card = document.querySelector('.hero-card-3d');
  if (!card) return;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx * 10;
    targetY = (e.clientY - cy) / cy * 10;
  });

  (function animateCard() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    card.style.transform = `perspective(1000px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
    requestAnimationFrame(animateCard);
  })();
}

// ════════════════════════════════════════════════════════════
// MAGNETIC BUTTONS — subtle gravity pull toward cursor
// ════════════════════════════════════════════════════════════
function initMagneticBtns() {
  document.querySelectorAll('.btn-primary, .btn-accent, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'none'; });
  });
}

// ════════════════════════════════════════════════════════════
// DIAMOND GLASS CARDS — caustic sparkle on hover entry
// ════════════════════════════════════════════════════════════
function initCausticSparkle() {
  document.querySelectorAll('.glass').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.setProperty('--caustic-opacity', '1');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--caustic-opacity', '0');
    });
  });
}

// ════════════════════════════════════════════════════════════
// THREE.JS PARTICLE BG
// ════════════════════════════════════════════════════════════
function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particles
  const N = 2400;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const palette = [[0,.4,1],[.48,.18,1],[0,1,.8],[1,1,1]];
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random()-.5)*22;
    pos[i*3+1] = (Math.random()-.5)*22;
    pos[i*3+2] = (Math.random()-.5)*12;
    const c = palette[Math.floor(Math.random()*palette.length)];
    col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({ size:.028, vertexColors:true, transparent:true, opacity:.65, blending:THREE.AdditiveBlending, depthWrite:false });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // Grid
  const gv = []; const gc = 28;
  for (let i=0; i<gc; i++) {
    const x=(i/gc-.5)*22; gv.push(x,-11,0,x,11,0,-11,x,0,11,x,0);
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.Float32BufferAttribute(gv,3));
  scene.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({color:0x080830,transparent:true,opacity:.18})));

  let mmx=0, mmy=0;
  document.addEventListener('mousemove', e => { mmx=(e.clientX/window.innerWidth-.5)*.6; mmy=(e.clientY/window.innerHeight-.5)*.6; });

  let t=0;
  (function animate() {
    requestAnimationFrame(animate);
    t += .003;
    pts.rotation.y = t*.04 + mmx*.35;
    pts.rotation.x = mmy*.25;
    const p = geo.attributes.position.array;
    for (let i=0;i<N;i++) { p[i*3+1]-=.004; if(p[i*3+1]<-11) p[i*3+1]=11; }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ── Hamburger Menu ────────────────────────────────────────────
function initHamburger() {
  const hbg     = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-links');
  const navbar  = document.querySelector('.navbar');
  if (!hbg || !navList) return;

  let portalled = false;

  function portalOut() {
    /* Move nav list to <body> — escapes backdrop-filter stacking context on navbar */
    if (!portalled) { document.body.appendChild(navList); portalled = true; }
  }
  function portalBack() {
    /* Return nav list to navbar when menu is closed / desktop restored */
    if (portalled && navbar) { navbar.appendChild(navList); portalled = false; }
  }

  function openMenu() {
    portalOut();
    /* Small rAF delay so display:flex is computed before transition starts */
    requestAnimationFrame(() => {
      hbg.classList.add('open');
      navList.classList.add('open');
      document.body.style.overflow = 'hidden';
      hbg.setAttribute('aria-expanded', 'true');
    });
  }
  function closeMenu() {
    hbg.classList.remove('open');
    navList.classList.remove('open');
    document.body.style.overflow = '';
    hbg.setAttribute('aria-expanded', 'false');
    /* Wait for transition to finish before portalling back */
    setTimeout(portalBack, 420);
  }

  hbg.addEventListener('click', e => {
    e.stopPropagation();
    hbg.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Close when a nav link is tapped */
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* Close when tapping the overlay background (not a link) */
  navList.addEventListener('click', e => {
    if (e.target === navList) closeMenu();
  });

  /* Close on Escape */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* Restore on resize to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hbg.classList.contains('open')) closeMenu();
    if (window.innerWidth > 768) portalBack();
  });
}

// ── Disable tilt/parallax on touch ───────────────────────────
function isTouchDevice() {
  return window.matchMedia('(hover:none) and (pointer:coarse)').matches;
}

// ── Page Fade-in ──────────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .65s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

// ── Init All ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTyped();
  initReveal();
  initSkillBars();
  initCounters();
  setActiveNav();
  initFilter();
  initHamburger();
  if (!isTouchDevice()) {
    initParallax();
    initDiamondTilt();
    initHeroCard();
    initMagneticBtns();
  }
  initSwipeShine();
  initCausticSparkle();
  initThreeBackground();
});
