/* Barre commune + fiche de synthèse en haut des rapports de projet.
   Les rapports gardent leur propre mise en page ; ce bloc les relie au reste du site
   et donne au lecteur l'essentiel avant le rapport complet. Styles isolés (préfixe dw-). */
(function () {
  var FICHES = {
    "Bonne-pratique-Sécurité-Dockers.html": ["infra & sécurité", "Bonnes pratiques de sécurité Docker", "Isolation et durcissement des conteneurs : images, utilisateurs, réseau.", ["Docker", "Linux", "sécurité"]],
    "Configuration-DNS-DHCP-NFS.html": ["infra & sécurité", "DNS, DHCP et NFS avec Dnsmasq", "Configurer un serveur DNS/DHCP léger et un partage NFS sous Linux.", ["Dnsmasq", "NFS", "Linux"]],
    "Exposé-Virtualisation.html": ["infra & sécurité", "Exposé : la virtualisation", "Types d'hyperviseurs, conteneurs et cas d'usage.", ["hyperviseurs", "conteneurs"]],
    "Pipeline-Ci-GithubActions.html": ["infra & sécurité", "Pipeline CI avec GitHub Actions", "Du dépôt au workflow : build et tests automatisés.", ["GitHub Actions", "CI/CD", "YAML"]],
    "Plan-ERP-ONOMO.html": ["gestion de projet", "Plan ERP pour l'hôtel ONOMO", "Mise en place d'un ERP : besoins, choix de la solution, déploiement.", ["ERP", "conduite de projet"]],
    "Projet-Ingénieurie-du-besoin.html": ["gestion de projet", "Ingénierie du besoin", "Recueil, analyse et spécification des exigences d'un projet.", ["exigences", "spécification"]],
    "Gestion-Bibliotheque.html": ["gestion de projet", "Gestion d'une bibliothèque", "Conception d'une application de gestion des prêts et des ouvrages.", ["conception", "base de données"]],
    "Rapport-virtualisation-de-stockage.html": ["infra & sécurité", "Virtualisation de stockage", "Ubuntu Server et Cockpit : volumes, partages et accès distant.", ["Ubuntu Server", "Cockpit", "stockage"]],
    "SCANNER-UN-RESEAU-AVEC-NMAP.html": ["infra & sécurité", "Scanner un réseau avec Nmap", "Découverte d'hôtes, de ports et de services sur un réseau de test.", ["Nmap", "réseau", "audit"]],
    "Windows-Servers-Adds.html": ["infra & sécurité", "Windows Server et AD DS", "Installation d'un serveur, annuaire Active Directory et GPO.", ["Windows Server", "AD DS", "GPO"]]
  };
  var file = decodeURIComponent(location.pathname.split("/").pop());
  var fiche = FICHES[file] || FICHES[file.normalize ? file.normalize("NFC") : file];

  var css = "" +
    ".dw-bar{position:sticky;top:0;z-index:9999;background:rgba(7,11,16,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #1c2a36;font:500 13px 'JetBrains Mono',ui-monospace,Consolas,monospace}" +
    ".dw-bar .dw-in,.dw-fiche .dw-in{max-width:1120px;margin:0 auto;padding:12px clamp(16px,4vw,32px);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}" +
    ".dw-bar a{color:#8aa0b3;text-decoration:none;transition:color .2s}.dw-bar a:hover{color:#fff}" +
    ".dw-bar .dw-back{color:#5fd0c4}.dw-bar .dw-brand{color:#fff;font-weight:600}.dw-bar .dw-brand i{font-style:normal;color:#5fd0c4}" +
    ".dw-bar nav{display:flex;gap:18px;flex-wrap:wrap}" +
    ".dw-fiche{background:#070b10;border-bottom:1px solid #1c2a36;color:#d7e3ee}" +
    ".dw-fiche .dw-in{display:grid;gap:10px;padding-block:34px 28px;justify-content:stretch}" +
    ".dw-fiche .dw-cat{font:500 12px 'JetBrains Mono',ui-monospace,monospace;color:#5fd0c4}" +
    ".dw-fiche h1{font:800 clamp(28px,4.4vw,48px)/1.05 'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-.02em;color:#fff;margin:0;text-wrap:balance}" +
    ".dw-fiche p{font:400 16px/1.55 'Instrument Sans',system-ui,sans-serif;color:#a5b6c6;margin:0;max-width:62ch}" +
    ".dw-fiche .dw-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}" +
    ".dw-fiche .dw-tags span{font:500 11.5px 'JetBrains Mono',ui-monospace,monospace;border:1px solid #2c4a55;padding:4px 8px;color:#c4d2e0}" +
    ".dw-fiche .dw-read{font:500 12px 'JetBrains Mono',ui-monospace,monospace;color:#8aa0b3;margin-top:6px}" +
    ".dw-foot{border-top:1px solid #1c2a36;margin-top:48px;background:#070b10}" +
    ".dw-foot .dw-in{max-width:1120px;margin:0 auto;padding:18px clamp(16px,4vw,32px);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font:400 12px 'JetBrains Mono',ui-monospace,monospace;color:#5d7184}" +
    ".dw-foot a{color:#5d7184;text-decoration:none}.dw-foot a:hover{color:#5fd0c4}" +
    "@media (max-width:640px){.dw-bar nav{display:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var bar = document.createElement("div"); bar.className = "dw-bar";
  bar.innerHTML = '<div class="dw-in"><span><a class="dw-back" href="projets.html">← projets</a> &nbsp;<a class="dw-brand" href="../index.html">dowou<i>.</i>issa</a></span>' +
    '<nav aria-label="Navigation du site"><a href="../index.html">accueil</a><a href="../cv.html">cv</a><a href="projets.html">projets</a><a href="../github.html">github</a><a href="../video.html">vidéos</a><a href="../contact.html">contact</a></nav></div>';
  document.body.prepend(bar);

  if (fiche) {
    var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };
    var f = document.createElement("section"); f.className = "dw-fiche"; f.setAttribute("aria-label", "Résumé du projet");
    f.innerHTML = '<div class="dw-in"><span class="dw-cat">~/projets · ' + esc(fiche[0]) + '</span><h1>' + esc(fiche[1]) + '</h1><p>' + esc(fiche[2]) + '</p>' +
      '<div class="dw-tags">' + fiche[3].map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
      '<span class="dw-read">rapport complet ci-dessous ↓</span></div>';
    bar.after(f);
  }

  var foot = document.createElement("footer"); foot.className = "dw-foot";
  foot.innerHTML = '<div class="dw-in"><span>© 2026 Dowou Issa</span><span><a href="https://github.com/DOWOU-Issa" target="_blank" rel="noopener">github.com/DOWOU-Issa</a> · <a href="https://www.linkedin.com/in/issa-dowou-4abbaa3a1" target="_blank" rel="noopener">linkedin</a> · <a href="mailto:dowouissa69@gmail.com">dowouissa69@gmail.com</a></span></div>';
  document.body.appendChild(foot);
})();
