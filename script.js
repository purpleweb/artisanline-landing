/* ============================================================
   ArtisanLine — Lead capture
   ============================================================
   Two modes are supported, in order of preference:

   1. Netlify Forms (zero config — recommended)
      The HTML <form> has data-netlify="true" + a hidden
      "form-name" field. When the site is deployed on Netlify,
      submissions are auto-captured (Netlify dashboard → Forms).
      This script POSTs URL-encoded data to "/" — the format
      Netlify expects — so the static-page redirect doesn't fire.

   2. Custom endpoint
      Set ENDPOINT below to a Formspree form URL or your own
      JSON endpoint. Used as fallback when Netlify isn't detected.

   3. Demo (no config)
      If neither is set, submissions are stored in localStorage
      so you can verify the flow. Look in DevTools → Application
      → Local Storage → key "artisanline_leads".
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

function encodeFormData(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');
}

function detectMode(form) {
  // Netlify mode is identified by the hidden "form-name" input
  // (it's what we explicitly add and what Netlify needs in the POST).
  if (form.querySelector('input[name="form-name"]')) return 'netlify';
  if (ENDPOINT) return 'endpoint';
  return 'demo';
}

async function submitLead(form, email) {
  const mode = detectMode(form);
  console.log('[ArtisanLine] submitting in mode:', mode);

  if (mode === 'netlify') {
    const formName =
      form.querySelector('input[name="form-name"]').value ||
      form.getAttribute('name') ||
      'leads';
    const body = encodeFormData({
      'form-name': formName,
      email,
      'bot-field': '' // honeypot — must stay empty
    });
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!res.ok) {
      console.warn('[ArtisanLine] Netlify POST failed:', res.status, res.statusText);
    }
    return { ok: res.ok, mode };
  }

  if (mode === 'endpoint') {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email })
    });
    return { ok: res.ok, mode };
  }

  // demo fallback
  const stored = JSON.parse(localStorage.getItem('artisanline_leads') || '[]');
  stored.push({ email, at: new Date().toISOString() });
  localStorage.setItem('artisanline_leads', JSON.stringify(stored));
  return { ok: true, mode };
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
      const result = await submitLead(form, email);
      if (result.ok) {
        const msg = result.mode === 'demo'
          ? '✓ Inscrit. (Mode démo : email stocké localement — déployez sur Netlify pour la prod.)'
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
