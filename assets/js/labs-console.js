/* Console des labs infra et sécurité (page Projets) : rejoue les vraies commandes
   de chaque rapport, avec ce qui en a été retenu. Se monte dans #labs-console. */
(function () {
  var LABS = [{"id": "nmap", "file": "01-audit-nmap", "tag": "audit réseau", "title": "Scanner un réseau avec Nmap", "page": "SCANNER-UN-RESEAU-AVEC-NMAP.html", "cmds": [["# 1. Qui est présent sur le réseau de test ?", ""], ["nmap 192.168.43.1-254", "c"], ["# 2. Quels services, quelles versions ?", ""], ["nmap -sV 192.168.43.244", "c"], ["# 3. Scan discret, puis recherche de vulnérabilités", ""], ["nmap -sS 192.168.43.244", "c"], ["nmap --script vuln 192.168.43.244", "c"], ["nmap -oN issa.txt 127.0.0.1", "c"]], "lesson": "Chaque port ouvert doit avoir une raison d'exister : le scan montre ce qu'on expose avant qu'un autre ne le découvre."}, {"id": "docker", "file": "02-durcir-docker", "tag": "durcissement", "title": "Sécurité et isolation Docker", "page": "Bonne-pratique-Sécurité-Dockers.html", "cmds": [["# Par défaut, le processus tourne en root", ""], ["docker run -it alpine sh", "c"], ["whoami", "c"], ["# Version durcie : utilisateur dédié, capacités retirées", ""], ["docker run --user secureuser \\", "c"], ["  --cap-drop ALL --cap-add NET_BIND_SERVICE \\", "c"], ["  --security-opt no-new-privileges \\", "c"], ["  --read-only --network none alpine_secureuser", "c"]], "lesson": "Un conteneur n'est pas une barrière par défaut : sans root, sans capacités inutiles et en lecture seule, il le devient."}, {"id": "ad", "file": "03-annuaire-ad", "tag": "annuaire", "title": "Windows Server et AD DS", "page": "Windows-Servers-Adds.html", "cmds": [["# Installer le rôle, puis créer la forêt", ""], ["Get-WindowsFeature AD*", "p"], ["Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools", "p"], ["Install-ADDSForest -DomainName Nomdudomaine", "p"], ["# Vérifier le domaine et les comptes", ""], ["Get-ADDomain", "p"], ["Get-ADUser -Filter * -SearchBase \"dc=osiris,dc=TRI,dc=com\"", "p"]], "lesson": "En PowerShell, la même commande recrée le même domaine : l'administration devient reproductible et vérifiable."}, {"id": "dns", "file": "04-services-dns-dhcp", "tag": "services réseau", "title": "DNS, DHCP et NFS avec Dnsmasq", "page": "Configuration-DNS-DHCP-NFS.html", "cmds": [["# Le port 53 est déjà pris : par qui ?", ""], ["sudo lsof -i :53", "c"], ["# systemd-resolved l’occupe, on le libère", ""], ["sudo systemctl stop systemd-resolved", "c"], ["sudo systemctl disable systemd-resolved", "c"], ["sudo apt-get install dnsmasq", "c"], ["sudo systemctl restart dnsmasq", "c"]], "lesson": "Avant de configurer un service, vérifier qui écoute déjà sur son port : ici, systemd-resolved bloquait le DNS."}, {"id": "ci", "file": "05-automatiser-ci", "tag": "automatisation", "title": "Pipeline CI avec GitHub Actions", "page": "Pipeline-Ci-GithubActions.html", "cmds": [["# Dépôt et branche de travail", ""], ["git init", "c"], ["git checkout -b develop", "c"], ["# .github/workflows/ci.yml : à chaque push", ""], ["runs-on: ubuntu-latest", "y"], ["python -m pip install --upgrade pip", "c"], ["pytest", "c"], ["flake8", "c"]], "lesson": "Les tests et le contrôle du style tournent à chaque push : une erreur est vue avant d'arriver sur la branche principale."}, {"id": "nfs", "file": "06-stockage-nfs", "tag": "stockage", "title": "Virtualisation de stockage", "page": "Rapport-virtualisation-de-stockage.html", "cmds": [["# Ubuntu : monter le volume logique et le partager", ""], ["sudo mount /dev/ubuntu-vg/data_lv /mnt/data", "c"], ["sudo exportfs -a", "c"], ["sudo systemctl restart nfs-kernel-server", "c"], ["# Windows : monter le partage", ""], ["mount \\\\192.168.43.149\\mnt\\data Z:", "p"]], "lesson": "Windows écrit dans le partage NFS, Ubuntu lit le fichier : deux systèmes différents partagent le même stockage."}];
  var CSS = "\n.console{display:grid;grid-template-columns:270px 1fr;border:1px solid var(--line);background:var(--bg);min-height:440px}\n.files{border-right:1px solid var(--line);padding:14px 0;display:flex;flex-direction:column}\n.files .hd{font:500 11px var(--f-m);color:var(--mute);padding:0 16px 10px;letter-spacing:.06em}\n.files button{all:unset;cursor:pointer;display:block;padding:10px 16px;border-left:2px solid transparent;font:500 13px var(--f-m);color:#a5b6c6}\n.files button small{display:block;font:400 11px var(--f-m);color:var(--mute);margin-top:2px}\n.files button:hover{background:var(--bg2);color:var(--fg-strong)}\n.files button[aria-selected=true]{border-left-color:var(--acc);background:var(--bg2);color:var(--fg-strong)}\n.files button:focus-visible{outline:2px solid var(--acc);outline-offset:-2px}\n.term{display:flex;flex-direction:column;min-width:0}\n.term .bar{all:unset;display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--line);font:500 12px var(--f-m);color:var(--mute)}\n.term .bar i{width:10px;height:10px;border-radius:50%;background:#2c4a55}.term .bar i:first-child{background:#e0a800}\n.term .bar span{margin-left:8px}\n.term pre{margin:0;flex:1;padding:18px 20px;font:400 14px/1.75 var(--f-m);color:#c4d2e0;white-space:pre-wrap;word-break:break-word;min-height:270px}\n.term pre .cm{color:#6f8597}.term pre .pr{color:var(--acc)}.term pre .cur{display:inline-block;width:8px;height:16px;background:var(--acc);vertical-align:-3px;animation:blink 1s steps(1) infinite}\n@keyframes blink{50%{opacity:0}}\n.lesson{border-top:1px solid var(--line);padding:16px 20px;display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}\n.lesson p{margin:0;max-width:62ch;color:var(--fg)}.lesson p b{display:block;font:500 11px var(--f-m);color:var(--acc);margin-bottom:4px;letter-spacing:.06em}\n.lesson a{font:600 14px var(--f-b);padding:9px 14px;border:1px solid var(--acc);color:var(--fg-strong);white-space:nowrap}\n.lesson a:hover{background:var(--acc);color:#061014}\n.replay{all:unset;cursor:pointer;margin-left:auto;font:500 12px var(--f-m);color:var(--acc)}\n@media(max-width:800px){.console{grid-template-columns:1fr}.files{border-right:0;border-bottom:1px solid var(--line);flex-direction:row;overflow-x:auto;padding:0}.files .hd{display:none}.files button{border-left:0;border-bottom:2px solid transparent;white-space:nowrap}.files button[aria-selected=true]{border-bottom-color:var(--acc)}.files button small{display:none}.term pre{font-size:13px}}\n";
  var HTML = "<div class=\"console\" aria-label=\"Console des labs\">\n  <div class=\"files\" role=\"tablist\" aria-label=\"Labs\"><div class=\"hd\">~/labs</div></div>\n  <div class=\"term\" role=\"tabpanel\">\n    <div class=\"bar\"><i></i><i></i><i></i><span id=\"lab-name\"></span><button type=\"button\" class=\"replay\" id=\"replay\">\u21bb rejouer</button></div>\n    <pre id=\"out\" aria-live=\"off\"></pre>\n    <div class=\"lesson\"><p><b>CE QUE J'AI RETENU</b><span id=\"lesson\"></span></p><a id=\"open\" href=\"#\">Lire le rapport \u2192</a></div>\n  </div>\n</div>";
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('labs-console'); if (!root) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    root.innerHTML = HTML;
    var files = root.querySelector('.files');
    LABS.forEach(function (l, k) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', 'false');
      b.innerHTML = l.file + '.sh<small>' + l.tag + '</small>'; files.appendChild(b);
    });
    var out = document.getElementById('out'), tabs = document.querySelectorAll('.files button');
    var calme = matchMedia('(prefers-reduced-motion: reduce)').matches, run = 0, cur = 0;
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function pr(t) { return t === 'p' ? 'PS&gt; ' : t === 'y' ? '' : '$ '; }
    function line(c) { return c[1] ? '<span class="pr">' + pr(c[1]) + '</span>' + esc(c[0]) : '<span class="cm">' + esc(c[0]) + '</span>'; }
    function show(i) {
      cur = i; var l = LABS[i], id = ++run;
      tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
      document.getElementById('lab-name').textContent = '~/labs/' + l.file + '.sh — ' + l.title;
      document.getElementById('lesson').textContent = l.lesson;
      document.getElementById('open').href = encodeURI(l.page);
      out.setAttribute('aria-label', l.cmds.map(function (c) { return c[0]; }).join('. '));
      if (calme) { out.innerHTML = l.cmds.map(line).join('\n'); return; }
      var done = '', n = 0, ch = 0;
      (function step() {
        if (id !== run) return;
        if (n >= l.cmds.length) { out.innerHTML = done + '<span class="pr">$ </span><span class="cur"></span>'; return; }
        var c = l.cmds[n];
        if (!c[1]) { done += line(c) + '\n'; n++; out.innerHTML = done; return setTimeout(step, 250); }
        ch++;
        out.innerHTML = done + '<span class="pr">' + pr(c[1]) + '</span>' + esc(c[0].slice(0, ch)) + '<span class="cur"></span>';
        if (ch >= c[0].length) { done += line(c) + '\n'; n++; ch = 0; return setTimeout(step, 380); }
        setTimeout(step, 16 + Math.random() * 22);
      })();
    }
    tabs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    document.querySelector('.files').addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return; e.preventDefault(); var k = (cur + d + LABS.length) % LABS.length; show(k); tabs[k].focus();
    });
    document.getElementById('replay').addEventListener('click', function () { show(cur); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); show(0); } }, { threshold: 0.4 });
      io.observe(root);
    } else show(0);
  
  });
})();
