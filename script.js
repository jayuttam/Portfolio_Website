/* ================================================================
   JAY UTTAM — PORTFOLIO  |  script.js
   ================================================================
   Every feature is in its own clearly labelled block.
   Search "CHANGE" to find every customisable value.
   ================================================================ */

'use strict';


/* ================================================================
   1. THEME TOGGLE  (light ↔ dark)
   ================================================================ */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  // CHANGE icon classes to anything from Font Awesome
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('portfolio-theme', theme);
}

// Load saved preference, or fall back to OS preference
const savedTheme    = localStorage.getItem('portfolio-theme');
const prefersDark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  // Spin animation on click
  themeToggle.style.transform = 'rotate(180deg) scale(1.2)';
  setTimeout(() => (themeToggle.style.transform = ''), 350);
});


/* ================================================================
   2. MOBILE NAV (hamburger)
   ================================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close drawer when any mobile link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});


/* ================================================================
   3. NAVBAR — scroll shadow
   ================================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // CHANGE: shadow colour / intensity
  navbar.style.boxShadow = window.scrollY > 60
    ? '0 2px 24px rgba(0,0,0,0.12)'
    : '';
});


/* ================================================================
   4. ACTIVE NAV LINK  (highlights link for visible section)
   ================================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

// Inject active-link CSS once
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
  .nav-links a.active              { color: var(--accent); }
  .nav-links a.active::after       { width: 100%; }
`;
document.head.appendChild(activeLinkStyle);

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (match) match.classList.add('active');
  });
}, { threshold: 0.45 });   // CHANGE: 0–1, how much of section must be visible

sections.forEach(s => activeObs.observe(s));


/* ================================================================
   5. SCROLL-REVEAL ANIMATIONS
   Elements with class "reveal" or "fade-up" animate in when
   they enter the viewport.
   ================================================================ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);   // trigger once only
    }
  });
}, {
  threshold:  0.1,              // CHANGE: 0–1
  rootMargin: '0px 0px -40px 0px'   // CHANGE: negative bottom margin = trigger earlier
});

document.querySelectorAll('.reveal, .fade-up').forEach(el => revealObs.observe(el));


/* ================================================================
   6. HERO FADE-IN on page load
   ================================================================ */
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 60);
  });
});


/* ================================================================
   7. SKILL BAR FILL ANIMATION
   Bars expand to their data-w % when scrolled into view
   ================================================================ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sb-fill').forEach(fill => {
        fill.style.width = fill.dataset.w + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-bars').forEach(el => barObs.observe(el));


/* ================================================================
   8. COUNT-UP NUMBERS  (stats band)
   data-target attribute on .stat-n sets the final number
   ================================================================ */
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;   // CHANGE: milliseconds for the animation
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);   // ease-out cubic
    el.textContent = Math.floor(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(step);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-n').forEach(el => countObs.observe(el));


/* ================================================================
   9. TYPEWRITER EFFECT  (hero sub-text)
   Types out the text of #heroSub character by character.
   To disable: remove or comment this block.
   ================================================================ */
const typeTarget = document.getElementById('heroSub');
if (typeTarget) {
  const fullText = typeTarget.textContent.trim();
  typeTarget.textContent = '';

  // CHANGE: delay before typing starts (ms)
  setTimeout(() => {
    let i = 0;
    const speed = 22;   // CHANGE: ms per character (lower = faster)
    const interval = setInterval(() => {
      typeTarget.textContent += fullText[i];
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, speed);
  }, 700);
}


/* ================================================================
   10. PROJECT CARD 3-D TILT on hover
   To disable: remove or comment this block.
   ================================================================ */
document.querySelectorAll('.proj-card').forEach(card => {
  const MAX_TILT = 5;   // CHANGE: degrees of tilt (0 = no tilt)

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s, box-shadow 0.35s, border-color 0.35s';
  });
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform =
      `translateY(-8px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, box-shadow 0.35s, border-color 0.35s';
    card.style.transform = '';
  });
});


/* ================================================================
   11. RIPPLE EFFECT on button clicks
   To disable: remove or comment this block.
   ================================================================ */

// Inject ripple keyframe once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2.8); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn-primary, #submitBtn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position:       absolute;
      border-radius:  50%;
      background:     rgba(255,255,255,0.35);
      width:          ${size}px;
      height:         ${size}px;
      left:           ${e.clientX - rect.left - size / 2}px;
      top:            ${e.clientY - rect.top  - size / 2}px;
      transform:      scale(0);
      animation:      ripple 0.55s linear;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


/* ================================================================
   12. SCROLL PROGRESS BAR (thin bar at very top of page)
   To disable: remove or comment this block.
   ================================================================ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:   fixed;
  top:        0; left: 0;
  height:     3px;   /* CHANGE: thickness */
  z-index:    9999;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  width:      0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / total) * 100) + '%';
});


/* ================================================================
   13. AVATAR PARALLAX  (subtle mouse-follow on hero avatar)
   To disable: remove or comment this block.
   ================================================================ */
document.addEventListener('mousemove', e => {
  const x       = (e.clientX / window.innerWidth  - 0.5);
  const y       = (e.clientY / window.innerHeight - 0.5);
  const avatar  = document.querySelector('.hero-avatar');
  const STRENGTH = 14;   // CHANGE: higher = more movement

  if (avatar) {
    avatar.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
  }
});




/* ── CONTACT FORM ──────────────────────────────────────────── */
/*
  SETUP STEPS (one-time only):
  1. Submit the form once on your live site.
  2. FormSubmit sends a confirmation to jayuuttam991@gmail.com.
  3. Click "Activate Form" in that email.
  4. Done — all future messages arrive in your Gmail inbox.

  If FormSubmit fails, the catch() opens the visitor's
  mail client as a fallback so no message is ever lost.
*/
function handleForm(e) {
  e.preventDefault();

  const form = e.target;
  const btn  = document.getElementById('submitBtn');
  const TO   = 'jayuttam991@gmail.com';

  const name    = (form.querySelector('[name="name"]')    || {}).value || '';
  const email   = (form.querySelector('[name="email"]')   || {}).value || '';
  const subject = (form.querySelector('[name="subject"]') || {}).value || 'Portfolio Contact';
  const message = (form.querySelector('[name="message"]') || {}).value || '';

  if (!name.trim() || !email.trim() || !message.trim()) {
    setBtnState(btn, 'error', 'Please fill in all required fields');
    setTimeout(() => setBtnState(btn, 'default'), 3000);
    return;
  }

  btn.disabled = true;
  setBtnState(btn, 'loading');

  // Build FormData — do NOT set Content-Type header,
  // let the browser add multipart boundary automatically.
  const fd = new FormData();
  fd.append('name',      name.trim());
  fd.append('email',     email.trim());
  fd.append('subject',   subject.trim() || 'Portfolio Contact');
  fd.append('message',   message.trim());
  fd.append('_subject',  '[Portfolio] New message from ' + name.trim());
  fd.append('_captcha',  'false');
  fd.append('_template', 'table');

  fetch('https://formsubmit.co/ajax/' + TO, {
    method:  'POST',
    headers: { 'Accept': 'application/json' },
    body:    fd,
  })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(json) {
      // FormSubmit returns { success: "true" } on success
      if (json.success === 'true' || json.success === true) {
        setBtnState(btn, 'success', 'Message Sent!');
        form.reset();
        setTimeout(function() {
          setBtnState(btn, 'default');
          btn.disabled = false;
        }, 5000);
      } else {
        throw new Error(json.message || 'Unknown error');
      }
    })
    .catch(function(err) {
      console.warn('FormSubmit error — opening mailto fallback:', err);
      var mailto =
        'mailto:' + TO +
        '?subject=' + encodeURIComponent('[Portfolio] ' + subject) +
        '&body='    + encodeURIComponent(
          'Name: '    + name    + '\n' +
          'Email: '   + email   + '\n\n' +
          message
        );
      setBtnState(btn, 'error', 'Opening your mail app…');
      setTimeout(function() {
        window.location.href = mailto;
        setBtnState(btn, 'default');
        btn.disabled = false;
      }, 1500);
    });
}

function setBtnState(btn, state, text) {
  var map = {
    default: { html: '<i class="fas fa-paper-plane"></i> Send Message', bg: '' },
    loading: { html: '<i class="fas fa-spinner fa-spin"></i> Sending…',  bg: '' },
    success: { html: '<i class="fas fa-check"></i> ' + (text || 'Sent!'), bg: 'linear-gradient(135deg,#00b8a3,#00d9c0)' },
    error:   { html: '<i class="fas fa-exclamation-triangle"></i> ' + (text || 'Error'), bg: 'linear-gradient(135deg,#ef4444,#e8365d)' },
  };
  var s = map[state] || map.default;
  btn.innerHTML        = s.html;
  btn.style.background = s.bg;
  if (state === 'default') btn.disabled = false;
}


/* ================================================================
   14. LEETCODE LIVE STATS
   Fetches real-time stats from leetcode-stats-api and renders
   stat boxes in the #lcStatsGrid element.
   ================================================================ */
(async function loadLeetCodeStats() {
  const container = document.getElementById('lcStatsGrid');
  if (!container) return;

  const username = 'JayUttam';  // CHANGE: your LeetCode username

  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = await res.json();

    if (data.status !== 'success') throw new Error('API failed');

    const stats = [
      { label: 'Total Solved',   value: data.totalSolved,  cls: 'total' },
      { label: 'Easy',           value: data.easySolved,   cls: 'easy' },
      { label: 'Medium',         value: data.mediumSolved, cls: 'medium' },
      { label: 'Hard',           value: data.hardSolved,   cls: 'hard' },
      { label: 'Acceptance %',   value: data.acceptanceRate ? data.acceptanceRate.toFixed(1) + '%' : 'N/A', cls: 'total' },
      { label: 'Ranking',        value: data.ranking ? '#' + Number(data.ranking).toLocaleString() : 'N/A', cls: 'total' },
    ];

    container.innerHTML = stats.map(s => `
      <div class="lc-stat-box">
        <div class="lc-stat-num ${s.cls}">${s.value}</div>
        <div class="lc-stat-label">${s.label}</div>
      </div>
    `).join('');

  } catch (err) {
    // Fallback: show direct profile link if API fails
    container.innerHTML = `
      <div class="lc-loading">
        <p>Stats loading… <a href="https://leetcode.com/u/JayUttam/" target="_blank" style="color:var(--accent)">View on LeetCode →</a></p>
      </div>
    `;
  }
})();
