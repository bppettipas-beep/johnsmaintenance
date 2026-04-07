// ============================================================
// JOHN'S MAINTENANCE & LANDSCAPING — script.js
// ============================================================

const header    = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

// --- Sticky header ---
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// --- Mobile nav toggle ---
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close on nav link click (mobile)
navLinks.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// --- Active tab highlighting on scroll ---
const sections = Array.from(document.querySelectorAll('section[id]'));
const tabs     = Array.from(document.querySelectorAll('.nav-tab[data-tab]'));

function updateActiveTab() {
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === current);
  });
}

window.addEventListener('scroll', updateActiveTab, { passive: true });
updateActiveTab();

// --- Scroll-in animation (Intersection Observer) ---
const animEls = document.querySelectorAll(
  '.service-card, .service-featured-card, .why-card, .testimonial-card, ' +
  '.process-step, .stat, .about-value, .contact-card, .contact-form-wrap, ' +
  '.about-content, .about-visual'
);

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animEls.forEach((el, i) => {
  el.style.cssText += `opacity:0;transform:translateY(22px);transition:opacity .5s ease ${i * 0.055}s,transform .5s ease ${i * 0.055}s`;
  io.observe(el);
});

// Inject the visible state rule once
document.head.insertAdjacentHTML('beforeend',
  '<style>.anim-in{opacity:1!important;transform:translateY(0)!important}</style>'
);

// --- Contact form handler ---
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending…';
    btn.disabled = true;

    const data = {
      access_key: '2c13b142-ea38-4ce5-bfa9-2e5a1ed0e9b0',
      name:    form.first_name.value + (form.last_name.value ? ' ' + form.last_name.value : ''),
      email:   form.email.value,
      phone:   form.phone.value || 'Not provided',
      service: form.service.value || 'Not specified',
      message: form.message.value
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          form.innerHTML = `
            <div style="text-align:center;padding:48px 20px;">
              <div style="width:64px;height:64px;background:#edf4ec;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem;color:#3d7a35;">✓</div>
              <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:#111a11;margin-bottom:10px;">Message Sent!</h3>
              <p style="color:#6b7c6b;font-size:0.95rem;line-height:1.65;max-width:320px;margin:0 auto;">
                Thank you for reaching out. We'll get back to you within one business day.
                Or call us at <strong>(506) 429-7948</strong> for an immediate response.
              </p>
            </div>`;
        } else {
          throw new Error('Send failed');
        }
      })
      .catch(() => {
        btn.innerHTML = 'Send Message';
        btn.disabled = false;
        alert('Something went wrong. Please try again or call us directly.');
      });
  });
}

// Spinner keyframes
document.head.insertAdjacentHTML('beforeend',
  '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>'
);
