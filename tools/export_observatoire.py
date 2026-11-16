"""Calcule les données de l'« Observatoire des prix » (Togo) et les écrit en JSON pour le portfolio.

Utilisé chaque mois par GitHub Actions : télécharge les relevés du PAM (HDX), calcule les séries
par denrée et par région, la saisonnalité, une prévision sur 6 mois, le pouvoir d'achat
et les alertes de marché, puis écrit un fichier JSON léger.

Usage : python export_observatoire.py <chemin_sortie.json> [chemin_csv_local]
"""
import json, sys, warnings
from datetime import date
import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

warnings.filterwarnings("ignore")
URL = ("https://data.humdata.org/dataset/f6b47ff7-48aa-4e13-b2e7-e5e487d43c19/resource/"
       "13b52287-f019-49a3-aa56-1480f2aab026/download/wfp_food_prices_tgo.csv")
PROD = {"Maize (white)": "Maïs blanc", "Rice (local)": "Riz local", "Cassava meal (gari)": "Gari (manioc)",
        "Beans (white)": "Haricot blanc", "Sorghum (red)": "Sorgho rouge", "Millet": "Mil", "Soybeans": "Soja"}
# SMIG mensuel au Togo (FCFA) : 35 000 jusqu'en décembre 2022, 52 500 depuis janvier 2023
SMIG = [("2012-01-01", 35000), ("2023-01-01", 52500)]
DEBUT = "2016-01-01"


def charger(src):
    df = pd.read_csv(src, skiprows=[1], parse_dates=["date"])
    df = df[(df.date >= DEBUT) & df.commodity.isin(PROD) & (df.unit == "KG")].copy()
    df["produit"] = df.commodity.map(PROD)
    df["mois"] = df.date.dt.to_period("M").dt.to_timestamp()
    return df


def panel(df):
    """Marchés présents chaque année depuis 2016 : évite les biais liés aux nouveaux marchés."""
    annees = df.groupby("market").date.apply(lambda s: set(s.dt.year))
    derniere = df.date.dt.year.max()
    return [m for m, a in annees.items() if set(range(2016, derniere + 1)) <= a]


def smig(mois):
    v = 0
    for d, s in SMIG:
        if mois >= pd.Timestamp(d): v = s
    return v


def saison(serie):
    s = serie.dropna()
    if len(s) < 36: return [0.0] * 12
    r = s / s.rolling(12, center=True).mean()
    g = (r.groupby(r.index.month).mean() - 1) * 100
    return [round(float(g.get(m, 0)), 1) for m in range(1, 13)]


def prevision(serie, h=6):
    y = np.log(serie.dropna().asfreq("MS").interpolate())
    if len(y) < 48: return None
    f = SARIMAX(y, order=(1, 1, 1), seasonal_order=(1, 0, 1, 12)).fit(disp=False).get_forecast(h)
    m, ic = np.exp(f.predicted_mean), np.exp(f.conf_int(alpha=0.2))
    return [{"mois": d.strftime("%Y-%m"), "prix": round(float(m[d])), "bas": round(float(ic.iloc[i, 0])),
             "haut": round(float(ic.iloc[i, 1]))} for i, d in enumerate(m.index)]


def alertes(df, facteurs):
    """Compare le dernier prix de chaque marché au prix attendu pour la saison (moyenne des 12 mois
    précédents × facteur saisonnier). Signale les écarts de plus de 25 %."""
    out, dernier = [], df.mois.max()
    for (prod, mk), g in df.groupby(["produit", "market"]):
        s = g.groupby("mois").price.median()
        if dernier not in s.index: continue
        hist = s[(s.index < dernier) & (s.index >= dernier - pd.DateOffset(months=12))]
        if len(hist) < 8: continue
        attendu = hist.mean() * (1 + facteurs[prod][dernier.month - 1] / 100)
        ecart = (s[dernier] / attendu - 1) * 100
        if abs(ecart) >= 25:
            r = g.iloc[0]
            out.append({"produit": prod, "marche": mk, "region": r.admin1, "prix": round(float(s[dernier])),
                        "attendu": round(float(attendu)), "ecart": round(float(ecart)), "lat": float(r.latitude), "lon": float(r.longitude)})
    return sorted(out, key=lambda a: -abs(a["ecart"]))


def main(sortie, src=URL):
    df = charger(src)
    pm = panel(df)
    dp = df[df.market.isin(pm)]
    regions = sorted(df.admin1.dropna().unique())
    produits = list(PROD.values())

    series, facteurs, prev, achat = {}, {}, {}, {}
    for p in produits:
        g = dp[dp.produit == p]
        nat = g.groupby("mois").price.median()
        series[p] = {"National": {d.strftime("%Y-%m"): round(float(v)) for d, v in nat.items()}}
        for r in regions:
            sr = g[g.admin1 == r].groupby("mois").price.median()
            series[p][r] = {d.strftime("%Y-%m"): round(float(v)) for d, v in sr.items()}
        facteurs[p] = saison(nat.loc[:"2025-12"])
        prev[p] = prevision(nat)
        achat[p] = {d.strftime("%Y-%m"): round(smig(d) / v) for d, v in nat.items() if v > 0}

    # Intégration des marchés : corrélation des variations mensuelles du maïs entre régions
    mz = dp[dp.produit == "Maïs blanc"].groupby(["mois", "admin1"]).price.median().unstack()
    dl = np.log(mz).diff().dropna(how="all")
    corr = dl.corr().round(2)

    out = {
        "maj": date.today().isoformat(),
        "dernier_mois": df.mois.max().strftime("%Y-%m"),
        "source": "PAM (WFP) via HDX – prix au détail, FCFA/kg",
        "marches_panel": len(pm), "marches_total": int(df[df.mois == df.mois.max()].market.nunique()),
        "produits": produits, "regions": ["National"] + regions,
        "series": series, "saison": facteurs, "prevision": prev, "pouvoir_achat": achat,
        "smig": [{"depuis": d, "montant": s} for d, s in SMIG],
        "correlation_mais": {"regions": list(corr.columns), "valeurs": corr.values.tolist()},
        "alertes": alertes(df, facteurs),
    }
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"ok : {sortie} | dernier mois {out['dernier_mois']} | {len(out['alertes'])} alertes")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else URL)
