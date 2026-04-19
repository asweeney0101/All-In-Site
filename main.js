// ── Nav scroll state ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Booking modal ──
const bookingModal = document.getElementById('bookingModal');
const modalClose   = document.getElementById('modalClose');

function openBooking(e) {
  e.preventDefault();
  closeMobile();
  bookingModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  bookingModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', openBooking);
});

modalClose.addEventListener('click', closeBooking);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal.classList.contains('open')) closeBooking();
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ── Contact form ──
// To activate email delivery: sign up at https://formspree.io (free),
// create a form pointed at your email, then replace YOUR_FORM_ID below.
const FORMSPREE_ID = 'YOUR_FORM_ID'; // e.g. 'xpwzgknd'

async function handleBookingSubmit(e) {
  e.preventDefault();

  const form   = e.target;
  const btn    = form.querySelector('[type="submit"]');
  const status = form.querySelector('.form-status');
  const data   = new FormData(form);

  btn.textContent = 'Sending…';
  btn.disabled = true;
  status.className = 'form-status';
  status.textContent = '';

  // No Formspree ID set — fall back to mailto so the form is never dead
  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    const name    = data.get('name')           || '';
    const email   = data.get('email')          || '';
    const phone   = data.get('phone')          || '';
    const loc     = data.get('event_location') || '';
    const date    = data.get('event_date')     || '';
    const message = data.get('message')        || '';
    const body    = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Location: ${loc}\nEvent Date: ${date}\n\n${message}`;

    window.location.href =
      `mailto:Contact@AllInPartyRentals.com` +
      `?subject=${encodeURIComponent('Event Booking Request from ' + name)}` +
      `&body=${encodeURIComponent(body)}`;

    btn.textContent = 'Send Request';
    btn.disabled = false;
    status.className = 'form-status success';
    status.textContent = 'Opening your email client…';
    return;
  }

  // Formspree submission
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      status.className = 'form-status success';
      status.textContent = '✓ Message sent! We\'ll be in touch soon.';
      form.reset();
    } else {
      throw new Error('Server error');
    }
  } catch {
    status.className = 'form-status error';
    status.innerHTML =
      'Something went wrong — please reach us directly at ' +
      '<a href="mailto:Contact@AllInPartyRentals.com">Contact@AllInPartyRentals.com</a>' +
      ' or call <a href="tel:4028042711">402-804-2711</a>.';
  } finally {
    btn.textContent = 'Send Request';
    btn.disabled = false;
  }
}

document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
document.getElementById('bookingFormBottom').addEventListener('submit', handleBookingSubmit);
