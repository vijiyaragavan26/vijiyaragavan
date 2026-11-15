/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT - VIJAYARAGAVAN V
 * Student Portfolio | CodSoft Web Development Level 1 Task 1
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeaderScroll();
  initMobileNav();
  initScrollSpy();
  initContactForm();
  initBackToTop();
});

/* ----------------------------------------------------------------------------
   1. Interactive Ambient Particle Canvas (Tech / IoT Network aesthetic)
   ---------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Respect reduced-motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 25 : 50;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Pause canvas when user switches tabs to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
}

/* ----------------------------------------------------------------------------
   2. Header Scroll Effect
   ---------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ----------------------------------------------------------------------------
   3. Mobile Navigation Menu
   ---------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navMenu.classList.add('open');
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside of the open mobile menu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------------------------------
   4. ScrollSpy: Highlight Active Navigation Link
   ---------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------------------------------------------
   5. Back to Top Button
   ---------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ----------------------------------------------------------------------------
   6. Toast Notification Helper
   ---------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ----------------------------------------------------------------------------
   7. Copy Email Helper
   ---------------------------------------------------------------------------- */
function copyEmailToClipboard() {
  const email = 'vijayaragavan26@gmail.com';
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email)
      .then(() => {
        showToast('✓ Email copied: vijayaragavan26@gmail.com');
      })
      .catch(() => {
        fallbackCopyText(email);
      });
  } else {
    fallbackCopyText(email);
  }
}

function fallbackCopyText(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast('✓ Email copied: ' + text);
}

/* ----------------------------------------------------------------------------
   8. Contact Form Validation and Submission
   ---------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const statusMsg = document.getElementById('form-status-msg');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setFieldError(groupId, errorId, hasError) {
    const group = document.getElementById(groupId);
    if (!group) return;
    if (hasError) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }
  }

  // Live input validation clearers
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) setFieldError('group-name', 'error-name', false);
  });

  emailInput.addEventListener('input', () => {
    if (validateEmail(emailInput.value.trim())) setFieldError('group-email', 'error-email', false);
  });

  subjectInput.addEventListener('input', () => {
    if (subjectInput.value.trim().length > 0) setFieldError('group-subject', 'error-subject', false);
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) setFieldError('group-message', 'error-message', false);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (nameInput.value.trim().length === 0) {
      setFieldError('group-name', 'error-name', true);
      isValid = false;
    } else {
      setFieldError('group-name', 'error-name', false);
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      setFieldError('group-email', 'error-email', true);
      isValid = false;
    } else {
      setFieldError('group-email', 'error-email', false);
    }

    // Validate Subject
    if (subjectInput.value.trim().length === 0) {
      setFieldError('group-subject', 'error-subject', true);
      isValid = false;
    } else {
      setFieldError('group-subject', 'error-subject', false);
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      setFieldError('group-message', 'error-message', true);
      isValid = false;
    } else {
      setFieldError('group-message', 'error-message', false);
    }

    if (!isValid) {
      showToast('⚠️ Please correct the highlighted errors.');
      return;
    }

    // Display positive submission response
    statusMsg.className = 'form-status success';
    statusMsg.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Thank you, <strong>${escapeHtml(nameInput.value.trim())}</strong>! Your message has been received. Vijayaragavan will get back to you shortly.</span>
    `;

    showToast('✓ Message sent successfully!');
    form.reset();

    // Auto dismiss status message after 7 seconds
    setTimeout(() => {
      statusMsg.className = 'form-status';
      statusMsg.innerHTML = '';
    }, 7000);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/* ----------------------------------------------------------------------------
   9. Interactive Project Modal Dialog (Informative previews, no broken links)
   ---------------------------------------------------------------------------- */
const projectData = {
  portfolio: {
    title: 'Personal Portfolio Website',
    desc: 'You are currently experiencing this live responsive portfolio! Built from scratch with semantic HTML5, modern modular CSS3, and vanilla JavaScript following clean code principles for CodSoft Web Development Internship – Level 1 Task 1.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    demoActionText: 'Scroll to Top (Experience Live)',
    demoUrl: '#home',
    githubActionText: 'View GitHub Repository',
    githubUrl: 'https://github.com/vijiyaragavan26'
  },
  meatcorner: {
    title: 'Meat Corner – Chicken E-Commerce Platform',
    desc: 'A customer-centric web application designed for browsing, selecting, and ordering fresh chicken cuts. Features a responsive catalog, dynamic cart management, and real-time total calculation.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'E-Commerce UI'],
    demoActionText: 'Launch Project Showcase',
    demoUrl: '#projects',
    githubActionText: 'Explore Repository',
    githubUrl: 'https://github.com/vijiyaragavan26'
  },
  iot: {
    title: 'IoT-Based Project – Telemetry & Monitoring',
    desc: 'An Internet of Things prototype integrating microcontroller hardware (ESP32 / Arduino) with DHT sensors. Reads real-time ambient parameters, processes telemetry in C/Python, and transmits alerts to an operational dashboard.',
    tags: ['C', 'Python', 'IoT Sensors', 'Microcontrollers', 'Telemetry'],
    demoActionText: 'View Architecture Details',
    demoUrl: '#about',
    githubActionText: 'Explore IoT Codebase',
    githubUrl: 'https://github.com/vijiyaragavan26'
  }
};

function openProjectModal(projectKey, actionType) {
  const modal = document.getElementById('project-modal');
  const titleElem = document.getElementById('modal-project-title');
  const descElem = document.getElementById('modal-project-desc');
  const metaElem = document.getElementById('modal-project-meta');
  const actionBtn = document.getElementById('modal-project-action');

  const data = projectData[projectKey];
  if (!modal || !data) return;

  titleElem.textContent = `${data.title} (${actionType === 'demo' ? 'Live Demo' : 'GitHub'})`;
  descElem.textContent = data.desc;

  // Render badges
  metaElem.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.75rem;">
      ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>
  `;

  if (actionType === 'demo') {
    actionBtn.textContent = data.demoActionText;
    actionBtn.href = data.demoUrl;
    if (data.demoUrl.startsWith('#')) {
      actionBtn.onclick = () => {
        closeProjectModal();
      };
    } else {
      actionBtn.onclick = null;
    }
  } else {
    actionBtn.textContent = data.githubActionText;
    actionBtn.href = data.githubUrl;
    actionBtn.onclick = null;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when pressing ESC or clicking overlay
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

const modalOverlay = document.getElementById('project-modal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeProjectModal();
    }
  });
}
