/* Palette de commandes : Ctrl+K (ou ⌘K) pour aller à une page ou un projet. Styles isolés (préfixe dw-k). */
(function () {
  var ROOT = (document.currentScript && document.currentScript.src) ? new URL("../../", document.currentScript.src).href : "/";
  var ITEMS = [["Accueil", "page", "index.html"], ["CV", "page", "cv.html"], ["Projets", "page", "projets/projets.html"], ["GitHub", "page", "github.html"], ["Vidéos", "page", "video.html"], ["Contact", "page", "contact.html"], ["CV en PDF", "fichier", "assets/pdf/CV_DOWOU-Issa.pdf"], ["Classification NLP AG News", "projet · data", "projets/Classification-NLP-AG-News.html"], ["Analyse des ventes (Power BI)", "projet · data", "projets/Analyse-ventes-Power-BI.html"], ["Prédiction du churn client", "projet · data", "projets/Prediction-churn-telecom.html"], ["Analyse de sentiments IMDb", "projet · data", "projets/Analyse-de-sentiments-IMDb.html"], ["Précipitations 1982–2024", "projet · data", "projets/Analyses-des-precipitations-1982-2024.html"], ["Bonnes pratiques de sécurité Docker", "projet · infra & sécurité", "projets/Bonne-pratique-Sécurité-Dockers.html"], ["DNS, DHCP et NFS avec Dnsmasq", "projet · infra & sécurité", "projets/Configuration-DNS-DHCP-NFS.html"], ["Exposé : la virtualisation", "projet · infra & sécurité", "projets/Exposé-Virtualisation.html"], ["Pipeline CI avec GitHub Actions", "projet · infra & sécurité", "projets/Pipeline-Ci-GithubActions.html"], ["Virtualisation de stockage", "projet · infra & sécurité", "projets/Rapport-virtualisation-de-stockage.html"], ["Scanner un réseau avec Nmap", "projet · infra & sécurité", "projets/SCANNER-UN-RESEAU-AVEC-NMAP.html"], ["Windows Server et AD DS", "projet · infra & sécurité", "projets/Windows-Servers-Adds.html"], ["Plan ERP pour l'hôtel ONOMO", "projet · gestion de projet", "projets/Plan-ERP-ONOMO.html"], ["Ingénierie du besoin", "projet · gestion de projet", "projets/Projet-Ingénieurie-du-besoin.html"], ["Gestion d'une bibliothèque", "projet · gestion de projet", "projets/Gestion-Bibliotheque.html"]];
  var css = ".dw-k{position:fixed;inset:0;z-index:100000;background:rgba(3,6,10,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;padding:12vh 16px 16px}" +
    ".dw-k[hidden]{display:none}" +
    ".dw-k-box{width:100%;max-width:560px;background:#0c1219;border:1px solid #2c4a55;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:'Instrument Sans',system-ui,sans-serif}" +
    ".dw-k-in{width:100%;box-sizing:border-box;background:transparent;border:0;border-bottom:1px solid #1c2a36;color:#fff;font:15px 'JetBrains Mono',ui-monospace,monospace;padding:16px 18px;outline:none}" +
    ".dw-k-list{list-style:none;margin:0;padding:6px;max-height:50vh;overflow:auto}" +
    ".dw-k-list li{display:flex;justify-content:space-between;gap:12px;padding:10px 12px;color:#c3d1de;cursor:pointer;font-size:14.5px}" +
    ".dw-k-list li small{font:500 11px 'JetBrains Mono',ui-monospace,monospace;color:#5d7184;white-space:nowrap}" +
    ".dw-k-list li[aria-selected=true]{background:#132029;color:#fff;box-shadow:inset 2px 0 0 #5fd0c4}" +
    ".dw-k-empty{padding:14px 12px;color:#5d7184;font:13px 'JetBrains Mono',monospace}" +
    ".dw-k-foot{border-top:1px solid #1c2a36;padding:8px 14px;font:11px 'JetBrains Mono',monospace;color:#5d7184}" +
    ".dw-k-hint{position:fixed;right:16px;bottom:16px;z-index:9998;font:500 11px 'JetBrains Mono',monospace;color:#8aa0b3;background:rgba(7,11,16,.85);border:1px solid #1c2a36;padding:6px 10px;cursor:pointer}" +
    ".dw-k-hint:hover{color:#fff;border-color:#5fd0c4}@media (max-width:640px){.dw-k-hint{display:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || "");
  var wrap = document.createElement("div"); wrap.className = "dw-k"; wrap.hidden = true; wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-label", "Recherche rapide");
  wrap.innerHTML = '<div class="dw-k-box"><input class="dw-k-in" type="text" placeholder="Aller à une page ou un projet…" aria-label="Rechercher" autocomplete="off"><ul class="dw-k-list" role="listbox"></ul><div class="dw-k-foot">↑ ↓ pour choisir · Entrée pour ouvrir · Échap pour fermer</div></div>';
  var hint = document.createElement("button"); hint.className = "dw-k-hint"; hint.type = "button"; hint.textContent = (mac ? "⌘" : "Ctrl") + " K  rechercher";
  document.body.appendChild(wrap); document.body.appendChild(hint);
  var input = wrap.querySelector("input"), list = wrap.querySelector("ul"), sel = 0, shown = [];
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function render() {
    var q = norm(input.value.trim());
    shown = ITEMS.filter(function (it) { return !q || norm(it[0] + " " + it[1]).indexOf(q) > -1; });
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length ? shown.map(function (it, i) { return '<li role="option" data-i="' + i + '" aria-selected="' + (i === sel) + '"><span>' + it[0].replace(/</g, "&lt;") + '</span><small>' + it[1] + '</small></li>'; }).join("") : '<div class="dw-k-empty">Aucun résultat.</div>';
    var cur = list.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  function open() { wrap.hidden = false; input.value = ""; sel = 0; render(); input.focus(); }
  function close() { wrap.hidden = true; }
  function go(i) { var it = shown[i]; if (it) location.href = new URL(encodeURI(it[2]), ROOT).href; }
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); wrap.hidden ? open() : close(); return; }
    if (wrap.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); go(sel); }
  });
  input.addEventListener("input", function () { sel = 0; render(); });
  list.addEventListener("click", function (e) { var li = e.target.closest("li"); if (li) go(+li.dataset.i); });
  wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
  hint.addEventListener("click", open);
})();
