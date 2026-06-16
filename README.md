cv-site/
│
├── index.html               → Accueil
├── cv.html                  → CV en ligne
├── projets.html             → Liste des projets
├── contact.html             → Formulaire de contact
├── github.html              → Liens vers tes dépôts GitHub
│
├── projets/                 → Pages individuelles générées automatiquement
│   ├── nextcloud-nfs.html
│   ├── autre-projet.html
│   └── ...
│
├── content/                 → Rapports sources (Word, Markdown)
│   ├── nextcloud-nfs.docx
│   ├── bot-social-ollama.docx
│   └── ...
│
assets/css/
│
        ├── style.css        → Styles globaux (typographie, couleurs, navbar, footer)
        ── index.css        → Styles spécifiques à la page d’accueil
        ├── cv.css           → Styles spécifiques à la page CV
        ├── projets.css      → Styles spécifiques à la page projets
        ── contact.css      → Styles spécifiques à la page contact
        └── github.css       → Styles spécifiques à la page GitHub
│   ├── js/script.js         → Interactions (recherche, filtres)
│   ├── images/              → Captures
│   └── videos/              → Démonstrations
│
├── scripts/
│   ├── convert_docx.py      → Conversion Word → HTML
│   └── update_projets.py    → Génération automatique de la liste des projets
│
└── README.md





🧩 Fonctionnalités à intégrer
🔹 Page d’accueil (index.html)
Présentation rapide + photo.

Boutons vers CV, projets, GitHub, contact.

Animation légère ou effet de transition.

🔹 Page CV (cv.html)
CV structuré en sections.

Bouton pour télécharger le PDF.

Icônes pour les compétences.

Liens vers certificats (si disponibles).

🔹 Page Projets (projets.html)
Liste dynamique des projets (via projets.json).

Barre de recherche + filtres par catégorie.

Cartes cliquables vers les pages individuelles.

🔹 Pages individuelles de projet (projets/*.html)
Titre + description complète.

Captures d’écran intégrées.

Vidéo de démonstration (lecture directe via <video>).

Lien vers le dépôt GitHub (si code disponible).

Tags ou catégories.

🔹 Page GitHub (github.html)
Liste de tes repos avec résumé.

Liens directs vers GitHub.

Badge GitHub officiel.

🔹 Page Contact (contact.html)
Formulaire de contact (nom, email, message).

QR code vers LinkedIn ou GitHub.

Email cliquable.

🎨 Design et technologies recommandées
HTML/CSS/JS pur pour commencer.

Framework possible plus tard : Bootstrap, Tailwind, ou même React si tu veux évoluer.

Responsive design : mobile/tablette/PC.

SEO : balises meta, titres clairs, URLs propres.

Accessibilité : texte lisible, contraste, navigation clavier