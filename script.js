/* ============================================================
   ArtisanLine — Lead capture
   ============================================================
   To wire to a real backend, set ENDPOINT below to a Formspree
   form ID (https://formspree.io) or a Netlify/your-own endpoint
   that accepts JSON { email }. Until then, the form stores
   submissions in localStorage so you can verify the flow.
   ============================================================ */

const ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(form, message, kind) {
  const note = form.querySelector('.lead-form__note');
  if (!note) return;
  note.textContent = message;
  form.classList.remove('is-success', 'is-error');
  if (kind) form.classList.add(`is-${kind}`);
}

async function submitLead(email) {
  if (!ENDPOINT) {
    // Demo fallback: store locally
    const stored = JSON.parse(localStorage.getItem('artisanline_leads') || '[]');
    stored.push({ email, at: new Date().toISOString() });
    localStorage.setItem('artisanline_leads', JSON.stringify(stored));
    return { ok: true, demo: true };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email })
  });

  return { ok: res.ok };
}

function attachForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = (input.value || '').trim();

    if (!EMAIL_RE.test(email)) {
      setStatus(form, 'Merci de saisir un email valide.', 'error');
      input.focus();
      return;
    }

    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = 'Envoi…';

    try {
      const result = await submitLead(email);
      if (result.ok) {
        const msg = result.demo
          ? '✓ Inscrit. (Mode démo : email stocké localement — branchez ENDPOINT pour la prod.)'
          : '✓ Merci ! On vous contacte au lancement.';
        setStatus(form, msg, 'success');
        input.value = '';
      } else {
        setStatus(form, 'Oups, problème côté serveur. Réessayez dans un instant.', 'error');
      }
    } catch (err) {
      setStatus(form, 'Connexion impossible. Vérifiez votre réseau et réessayez.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachForm('leadForm');
  attachForm('leadFormBottom');
});
