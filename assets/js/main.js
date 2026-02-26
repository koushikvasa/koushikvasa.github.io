

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }
  /**
   * Minimalist Split View for Experience Section
   */
  const splitViewNavItems = document.querySelectorAll('.split-view-nav li');

  splitViewNavItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all nav items
      splitViewNavItems.forEach(i => i.classList.remove('active'));

      // Add active class to clicked item
      this.classList.add('active');

      const targetId = this.getAttribute('data-target');
      const allPanels = document.querySelectorAll('.split-view-panel');

      // Hide all panels
      allPanels.forEach(panel => panel.classList.remove('active'));

      // Show the target panel
      document.getElementById(targetId).classList.add('active');
    });
  });

  /**
   * Skills slider
   */
  new Swiper('.services-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
        slidesPerGroup: 1
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
        slidesPerGroup: 2
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20,
        slidesPerGroup: 4
      }
    }
  });


    /**
   * Horizontal Scroll Progress Bar
   */
  const scrollContainer = document.querySelector('.portfolio-scroller');
  const progressBar = document.querySelector('.progress-bar');

  if (scrollContainer && progressBar) {
    scrollContainer.addEventListener('scroll', () => {
      const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const scrollPercent = (scrollContainer.scrollLeft / scrollableWidth) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  /* ================================================
     DARK / LIGHT MODE TOGGLE
  ================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun-fill';
    } else {
      themeIcon.className = 'bi bi-moon-stars-fill';
    }
  }

  /* ================================================
     NEURAL NETWORK ANIMATION — ENHANCED
  ================================================ */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 120;
    const CONNECTION_DISTANCE = 160;
    const MOUSE_REPEL_DISTANCE = 120;
    const PARTICLE_SPEED = 0.5;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function getThemeColors() {
      const isDark = document.documentElement
        .getAttribute('data-theme') !== 'light';
      return {
        particle: isDark
          ? 'rgba(139, 92, 246,'
          : 'rgba(139, 92, 246,',
        line: isDark
          ? 'rgba(139, 92, 246,'
          : 'rgba(139, 92, 246,',
        nodeBright: isDark
          ? 'rgba(196, 181, 253,'
          : 'rgba(139, 92, 246,'
      };
    }

    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.baseRadius = Math.random() * 2.5 + 1;
        this.radius = this.baseRadius;
        this.opacity = Math.random() * 0.4 + 0.4;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.isNode = Math.random() < 0.15;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.radius = this.baseRadius +
          Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.8;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_DISTANCE) {
            const force = (MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
          }
        }
      }

      draw(colors) {
        if (this.isNode) {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 4
          );
          gradient.addColorStop(0, `${colors.nodeBright}${this.opacity})`);
          gradient.addColorStop(1, `${colors.particle}0)`);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.particle}${this.opacity})`;
        ctx.fill();
      }
    }

    function drawConnections(colors) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.5;
            const bothNodes = particles[i].isNode && particles[j].isNode;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${colors.line}${opacity})`;
            ctx.lineWidth = bothNodes ? 1.5 : 0.6;
            ctx.stroke();

            if (bothNodes && Math.random() < 0.001) {
              const midX = (particles[i].x + particles[j].x) / 2;
              const midY = (particles[i].y + particles[j].y) / 2;
              ctx.beginPath();
              ctx.arc(midX, midY, 2, 0, Math.PI * 2);
              ctx.fillStyle = `${colors.nodeBright}0.9)`;
              ctx.fill();
            }
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getThemeColors();
      time++;
      particles.forEach(function(p) { p.update(time); });
      drawConnections(colors);
      particles.forEach(function(p) { p.draw(colors); });
      requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseleave', function() {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', function() {
      resizeCanvas();
      initParticles();
    });
  }

  /* ================================================
     SCROLL REVEAL ANIMATIONS
  ================================================ */
  const revealElements = document.querySelectorAll(
    '.education-item, .split-view-container, ' +
    '.services-block, .journal-info, ' +
    '.portfolio-slide, .section-title'
  );

  revealElements.forEach(function(el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ================================================
     STATS COUNTER ANIMATION
  ================================================ */
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  function animateCounter(el) {
    const text = el.textContent;
    const target = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  const statsObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          statNumbers.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

})()
