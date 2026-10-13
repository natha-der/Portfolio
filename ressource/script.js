/* NDL Studio – script du site */

/* ---- Menu mobile -------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function setMobileMenu(open) {
  if (!hamburger || !mobileMenu) return;
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

// utilisée par les liens du menu (attribut onclick) et par les autres pages
function closeMobileMenu() { setMobileMenu(false); }

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMobileMenu(); });
}

/* ---- Apparition douce (pages qui utilisent encore .fade-in) ------------- */
const fadeItems = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window && fadeItems.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeItems.forEach(el => observer.observe(el));
} else {
  fadeItems.forEach(el => el.classList.add('visible'));
}

/* ---- Formulaire de contact (Web3Forms) ---------------------------------- */
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form && statusEl) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const setStatus = (text, type) => { statusEl.textContent = text; statusEl.className = 'form-status ' + (type || ''); };

    button.disabled = true;
    setStatus('Envoi en cours…');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        form.reset();
        setStatus('Merci ! Votre demande est bien envoyée, je vous réponds sous 48 h.', 'ok');
      } else {
        throw new Error(data.message || 'Erreur');
      }
    } catch (err) {
      setStatus("L'envoi a échoué. Écrivez-moi directement à derouineaunathanael@gmail.com.", 'error');
    } finally {
      button.disabled = false;
    }
  });
}