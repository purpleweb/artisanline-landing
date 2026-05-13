/* ============================================================
   ArtisanLine — Lead capture (Supabase)
   ============================================================
   Les emails sont insérés dans la table public.contacts
   via l'API REST Supabase (PostgREST).

   Prérequis côté Supabase :
     - RLS activé sur public.contacts
     - Policy INSERT autorisée au rôle "anon"
   ============================================================ */

const SUPABASE_URL = 'https://ymafstnlvgyxniuwkgfd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pVKeUlZ8O56-yuK7twDZEw_ZYKSh0wc';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(form, message, kind) {
  const note = form.querySelector('.lead-form__note');
  if (!note) return;
  note.textContent = message;
  form.classList.remove('is-success', 'is-error');
  if (kind) form.classList.add(`is-${kind}`);
}

async function submitLead(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[ArtisanLine] Supabase insert failed:', res.status, text);
  }
  return { ok: res.ok };
}

function attachForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const honeypot = form.querySelector('input[name="bot-field"]');
    const email = (input.value || '').trim();

    // Honeypot: si rempli, on simule un succès sans rien envoyer
    if (honeypot && honeypot.value) {
      setStatus(form, '✓ Merci ! On vous contacte au lancement.', 'success');
      input.value = '';
      return;
    }

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
        setStatus(form, '✓ Merci ! On vous contacte au lancement.', 'success');
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
