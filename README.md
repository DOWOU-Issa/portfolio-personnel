# Portfolio — Dowou Issa

Portfolio en ligne d'un étudiant en Licence IT, IA & Big Data : projets de machine learning, NLP, Business Intelligence, réseaux et cybersécurité, chacun documenté de bout en bout.

**Site :** https://dowou-issa.github.io/portfolio-personnel/

## Contenu

| Page | Rôle |
|---|---|
| `index.html` | Accueil, présentation et accès rapides |
| `cv.html` | CV en ligne (version PDF dans `assets/pdf/`) |
| `projets/projets.html` | Liste des 15 projets : pile de cartes 3D, filtres par domaine et recherche |
| `projets/*.html` | Une page par projet |
| `github.html` | Applications et dépôts GitHub |
| `video.html` | Démonstrations vidéo (hébergées sur Google Drive) |
| `contact.html` | Coordonnées et formulaire (Formspree) |

### Projets data mis en avant

| Projet | Résultat | Code |
|---|---|---|
| Classification NLP AG News (TF-IDF contre DistilBERT) | 92,3 % d'accuracy | [ag-news-distilbert](https://github.com/DOWOU-Issa/ag-news-distilbert) |
| Prédiction du churn (2,3 M d'abonnés) | AUC-ROC 0,89 | [churn-prediction-telecom](https://github.com/DOWOU-Issa/churn-prediction-telecom) |
| Analyse de sentiments IMDb | 88,6 % d'accuracy | [sentiment-analysis](https://github.com/DOWOU-Issa/sentiment-analysis) |
| Analyse des ventes avec Power BI | +3,7 % de CA 2023 → 2024 | page du projet |
| Précipitations 1982–2024 | relief 3D de 516 cumuls mensuels | page du projet |

## Technique

- **HTML, CSS et JavaScript sans framework**, servis tels quels par GitHub Pages.
- **Thème commun** : `assets/css/theme.css`. Les anciens rapports sont alignés sur ce thème par `assets/css/rapport.css`.
- **3D avec Three.js** (r128, fourni en local dans `assets/js/vendor/`) :
  - `net3d.js` : réseau de nœuds en fond de page, réactif à la souris et à la page Projets ;
  - `relief-pluie.js` : relief des précipitations calculé à partir des relevés journaliers ;
  - `churn-3d.js` : réglage de la régression logistique (F1 selon L1/L2 et C) ;
  - `powerbi-3d.js` : chiffre d'affaires par catégorie et par trimestre.
- **Recherche rapide** : Ctrl+K (⌘K sur Mac) depuis n'importe quelle page (`palette.js`).
- **Performance et accessibilité** : la 3D se charge après le contenu et se désactive si l'utilisateur réduit les animations, active l'économie de données ou n'a pas WebGL ; navigation au clavier et lien d'évitement.
- **Référencement** : balises meta et Open Graph, `sitemap.xml`, `robots.txt`, propriété Google Search Console.

## Structure

```
.
├── index.html, cv.html, github.html, video.html, contact.html, merci.html
├── projets/              pages projet + liste (projets.html)
├── data/projets.json     liste des projets (titre, description, catégorie)
├── assets/
│   ├── css/              theme.css, rapport.css
│   ├── js/               scripts 3D, barre des rapports, recherche rapide, vendor/three.min.js
│   ├── images/           photo, figures des projets, vignettes des vidéos
│   └── pdf/              CV en PDF
├── sitemap.xml, robots.txt
└── google…html           vérification Google Search Console (ne pas supprimer)
```

Les dossiers `Github/` (sources des projets), `assets/videos/` et `content/` (rapports Word) restent en local et sont exclus par `.gitignore`.

## Ajouter un projet

1. Créer la page dans `projets/` en partant d'une page existante (par exemple `Prediction-churn-telecom.html`).
2. Ajouter une entrée dans `data/projets.json` **et** dans le bloc `<script id="projets-data">` de `projets/projets.html`, qui sert de secours quand le site est ouvert sans serveur.
3. Ajouter le projet à la liste de `assets/js/palette.js` et son adresse dans `sitemap.xml`.

## Lancer en local

Ouvrir `index.html` dans un navigateur suffit. Pour un comportement identique au site en ligne :

```bash
python -m http.server 8000
# puis http://localhost:8000
```

## Contact

Dowou Issa · dowouissa69@gmail.com · [LinkedIn](https://www.linkedin.com/in/issa-dowou-4abbaa3a1) · [GitHub](https://github.com/DOWOU-Issa)
