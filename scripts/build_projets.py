import os, json, shutil, subprocess
from docx import Document

CONTENT_DIR = "content"
OUTPUT_DIR = "projets"
JSON_FILE = "data/projets.json"
CSS_FILE = "../assets/css/projets.css"

# Chemin complet vers Pandoc
PANDOC_PATH = r"C:\Program Files\WinGet\Packages\JohnMacFarlane.Pandoc_Microsoft.Winget.Source_8wekyb3d8bbwe\pandoc-3.9\pandoc.exe"

def convert_with_pandoc(docx_file):
    base_name = os.path.splitext(os.path.basename(docx_file))[0]
    safe_name = base_name.replace(" ", "-").replace("_", "-")
    html_file = os.path.join(OUTPUT_DIR, f"{safe_name}.html")

    # Commande Pandoc avec extraction des images dans assets/images
    cmd = [
        PANDOC_PATH,
        docx_file,
        "-o", html_file,
        "--extract-media=../assets/images",
        "-c", CSS_FILE
    ]
    subprocess.run(cmd, check=True)

    # Extraire une description (premier paragraphe non vide)
    description = ""
    try:
        doc = Document(docx_file)
        for para in doc.paragraphs:
            if para.text.strip():
                description = para.text.strip()
                break
    except Exception:
        description = "Projet généré avec Pandoc"

    print(f"✅ {docx_file} → {html_file}")
    return {"titre": base_name, "fichier": f"{safe_name}.html", "description": description}

def build():
    # Nettoyer le dossier projets
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    projets = []
    os.makedirs(os.path.dirname(JSON_FILE), exist_ok=True)

    # Conversion de tous les fichiers .docx
    for file in os.listdir(CONTENT_DIR):
        if file.endswith(".docx"):
            projets.append(convert_with_pandoc(os.path.join(CONTENT_DIR, file)))

    # Générer le JSON
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(projets, f, indent=2, ensure_ascii=False)
    print(f"✅ JSON généré : {JSON_FILE}")

    # ⚠️ Ne touche pas à projets.html
    print("ℹ️ projets.html laissé intact (aucune modification)")

if __name__ == "__main__":
    build()
