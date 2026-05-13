```bash
python3 -m http.server 8000
```

idée pour plus tard :

Modifie la section "Offres" / "Tarifs" / "Pricing" de la landing page pour remplacer les 2 offres actuelles par les suivantes :

═══════════════════════════════════════════════
OFFRE 1 — Artisanline Essentiel
═══════════════════════════════════════════════
- Prix : 29 €/mois
- Sous-titre / accroche : "L'essentiel pour ne plus jamais rater un client"
- Fonctionnalités :
  • Serveur vocal interactif (SVI) personnalisé à votre métier
  • Menu à choix multiples (urgence, devis, autre)
  • Notifications SMS instantanées à chaque appel
  • Numéro de téléphone dédié inclus
  • Tableau de bord des appels reçus
  • Support par email
- CTA : "Commencer"
- Badge : aucun

═══════════════════════════════════════════════
OFFRE 2 — Artisanline Pro
═══════════════════════════════════════════════
- Prix : 59 €/mois
- Sous-titre / accroche : "L'assistant intelligent qui qualifie vos devis"
- Fonctionnalités :
  • Tout ce qui est inclus dans l'offre Essentiel
  • Qualification IA des demandes de devis (choix "2" du menu)
  • Prise de rendez-vous automatique dans votre agenda
  • Synchronisation Google Calendar / Outlook
  • Résumé intelligent de chaque appel par SMS
  • Support prioritaire (email + téléphone)
- CTA : "Choisir Pro"
- Badge : "Recommandé" ou "Le plus populaire" (à mettre en évidence visuellement)

═══════════════════════════════════════════════
CONSIGNES TECHNIQUES
═══════════════════════════════════════════════
1. Conserve la structure HTML/CSS existante et le design system actuel (couleurs, typographie, espacements, composants)
2. Mets visuellement l'offre Pro en avant (bordure colorée, badge, légère mise à l'échelle, ou tout autre traitement déjà utilisé sur la page pour ce type de mise en avant)
3. Si la page utilise un framework (React, Vue, Astro, etc.), respecte la convention du projet (composants, props, données dans un fichier de config si applicable)
4. Si les offres sont dans un fichier de données séparé (ex: pricing.json, pricing.ts, _data/pricing.yml), modifie ce fichier plutôt que le composant
5. Assure-toi que les fonctionnalités sont affichées sous forme de liste avec icônes/checkmarks si c'est déjà le pattern utilisé
6. Vérifie le responsive (mobile, tablette, desktop)
7. Ne modifie aucune autre section de la page


Avant de commencer, montre-moi d'abord :
- Le(s) fichier(s) que tu vas modifier
- Un aperçu des changements proposés

Puis applique les modifications.
# ArtisanLine — Landing

Landing page statique pour ArtisanLine, le répondeur intelligent pour artisans.

## Démo locale

Site statique (HTML/CSS/JS, pas de build). Depuis la racine du projet :

```bash
python3 -m http.server 8000
```
