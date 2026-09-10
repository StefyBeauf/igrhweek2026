# Spécification UX/UI — IGRH Week 2026, Espace Formateurs V2

**Objectif** : refonte UX/UI complète du dashboard existant (structure et backend conservés), direction artistique noir profond · doré champagne · ivoire, 7 modules intégrés.

**Principe directeur** : *« Je suis enseignant, j'arrive sur le site, en 10 secondes je sais ce qui se passe et où agir. »*

**Palette de référence**
| Rôle | Couleur | Usage |
|---|---|---|
| Fond principal | Noir profond `#0F0F12` (pas gris) | Fond des cartes, header, nav |
| Accent | Doré champagne `#C9A24B` (pas or vif) | Filets, icônes actives, badges, CTA |
| Texte / surface claire | Ivoire `#F5F1E8` (pas blanc pur) | Texte sur fond noir, cartes claires |
| Alerte | Rouge sobre `#B0413E` | Groupes à risque |
| Vigilance | Ambre `#C98A2C` | Groupes en vigilance |
| Normal | Vert profond `#2F6F4E` | Groupes normaux |

Typographie : Geist (ou équivalent système), graisses Regular/Medium/Semibold uniquement. Icônes : Lucide, trait fin.

---

## Module 1 — Brief du jour

**Vue d'ensemble** : donne en un coup d'œil le contexte de la journée (objectifs, consignes, points de vigilance) sous le sélecteur de jour.

**Wireframe textuel**
```
[ LUNDI | MARDI | MERCREDI | JEUDI | VENDREDI ]  ← sélecteur, jour actif souligné doré

┌─────────────────────────────────────────────────────────┐
│ ▍ BRIEF DU JOUR — Lundi                                  │  ← filet doré vertical gauche
│                                                           │
│ Objectifs : ...                                          │
│ Consignes particulières : ...                            │
│ Points de vigilance : ...                                │
│ Échéance : ...                                            │
└─────────────────────────────────────────────────────────┘
```

**Ergonomie** : lecture seule pour les enseignants. Pas de clic requis — visible immédiatement à l'arrivée sur la page « Suivi journalier ». L'admin modifie le texte via `briefs.json`.

**Direction artistique** : carte fond noir légèrement contrasté (`#17171B`), filet doré 2px à gauche, texte ivoire, titre en majuscules espacées doré. Pas d'ombre lourde — un simple relief léger.

**Responsive** : desktop = carte pleine largeur sous le sélecteur. Mobile = même carte, padding réduit, texte en accordéon si > 4 lignes (« Voir plus »).

**Notes d'implémentation** : éviter un bloc trop haut qui pousse le contenu utile hors écran mobile — plafonner à ~4 lignes visibles avant troncature.

---

## Module 2 — Dashboard Assiduité (repensé)

**Vue d'ensemble** : vue globale immédiate des 21 groupes avec niveau d'alerte, avant le détail jour par jour.

**Wireframe textuel**
```
┌─── DASHBOARD ASSIDUITÉ ──────────────────────────────────┐
│ [●Normal 14]   [●Vigilance 5]   [●Alerte 2]               │  ← compteurs globaux
│                                                            │
│  G01 ●  G02 ●  G03 ▲  G04 ●  G05 ■  G06 ●  ...            │  ← grille de pastilles,
│  (survol/clic = détail présences/absences du groupe)      │     ● normal ▲ vigilance ■ alerte
└────────────────────────────────────────────────────────────┘

── Détail journalier (classique, sous le dashboard) ──
[ Groupe | Présents | Absents | Retards | Commentaire ]
```

**Ergonomie** : les groupes à risque (■ alerte) remontent visuellement en premier dans la grille (tri automatique alerte → vigilance → normal). Un clic sur une pastille ouvre le détail du groupe sans quitter la page (panneau latéral ou accordéon).

**Direction artistique** : pastilles rondes pleines, couleur = niveau d'alerte (voir palette). Compteurs globaux en badges ivoire sur fond noir. Pas de graphique complexe — uniquement des pastilles et des chiffres.

**Responsive** : desktop = grille de pastilles en lignes de 7. Mobile = grille en lignes de 3-4, pastilles plus grandes (zone de clic confortable ≥ 44px).

**Notes d'implémentation** : le niveau d'alerte doit être calculé simplement (ex. seuils : ≥2 absences non justifiées = vigilance, ≥4 = alerte) — logique à confirmer avec Stéphanie avant codage, pas de calcul statistique complexe.

---

## Module 3 — Onglet Notes CC

**Vue d'ensemble** : consultation et saisie des notes de contrôle continu, organisées par spécialité.

**Wireframe textuel**
```
Desktop (tableau) :
┌────────┬──────────────┬──────────────┬──────────────┐
│ Groupe │ FI            │ CACG          │ RH            │
│        │ Note│Commentaire │ Note│Commentaire │ Note│Commentaire │
├────────┼──────────────┼──────────────┼──────────────┤
│ G01    │ 14  │ ...       │ 15  │ ...        │ 13  │ ...        │
└────────┴──────────────┴──────────────┴──────────────┘
   bleu nuit (FI)   doré (CACG)   vert profond (RH)

Mobile (cartes empilées par groupe) :
┌─ Groupe 01 ──────────────┐
│ FI    14  [commentaire]  │  ← bandeau couleur latéral par spécialité
│ CACG  15  [commentaire]  │
│ RH    13  [commentaire]  │
└───────────────────────────┘
```

**Ergonomie** : clic sur une note = champ éditable inline (pas de modal lourde). Commentaire dans un champ texte extensible au clic. Sauvegarde immédiate ou bouton « Enregistrer » discret par ligne.

**Direction artistique** : code couleur strict — FI bleu nuit `#1B2A4A`, CACG doré `#C9A24B`, RH vert profond `#2F6F4E`, appliqué en bandeau fin (4px) ou pastille, jamais en fond plein de cellule (garder la lisibilité du texte ivoire/noir).

**Responsive** : le tableau desktop devient des cartes empilées sur mobile — jamais de tableau compressé horizontalement scrollable en dernier recours seulement.

**Notes d'implémentation** : prévoir un état « non saisi » visuellement distinct (ex. tiret ivoire discret) pour repérer vite les notes manquantes.

---

## Module 4 — Onglet Partiel (saisie soutenance)

**Vue d'ensemble** : saisie rapide de la grille d'évaluation pendant les soutenances du vendredi, une seule évaluation par groupe.

**Wireframe textuel**
```
Liste des groupes :
[ G01 ▸ ]  [ G02 ▸ ]  [ G03 ▸ ] ...   ← clic ouvre la grille

Grille (une fois ouverte) :
┌─ Évaluation — Groupe 01 ─────────────────────────────┐
│ Compréhension des enjeux         [ /4 ]  ●●●●○        │
│ Cohérence interdisciplinaire     [ /4 ]  ●●●○○        │
│ Pertinence des recommandations   [ /4 ]  ●●●●○        │
│ Argumentation & prise décision   [ /3 ]  ●●○          │
│ Qualité de la présentation       [ /3 ]  ●●●          │
│ Dynamique collective             [ /2 ]  ●○           │
│─────────────────────────────────────────────────────│
│ TOTAL : 17 / 20   (calcul automatique)                │
│ Commentaire du jury : [.....................]        │
│                                    [ Enregistrer ]     │
└─────────────────────────────────────────────────────┘
```

**Ergonomie** : saisie par clic/tap sur pastilles de points (pas de clavier requis, plus rapide pendant la soutenance) ou champ numérique au choix. Le total se recalcule en direct à chaque changement. Bouton retour vers la liste des groupes toujours visible.

**Direction artistique** : pastilles doré pour les points acquis, contour ivoire discret pour les points restants. Total affiché en grand, doré, encadré d'un filet.

**Responsive** : sur mobile, la grille occupe tout l'écran (plein écran modal), un critère par ligne, gros boutons tactiles.

**Notes d'implémentation** : bloquer la saisie au-delà du maximum par critère ; empêcher la double-soumission accidentelle (bouton désactivé après clic, confirmation visuelle « Enregistré »).

---

## Module 5 — Vue synthétique Partiel

**Vue d'ensemble** : récapitulatif de toutes les notes du partiel pour piloter la journée en direct.

**Wireframe textuel**
```
┌────────┬───────────────┬──────────────────────────┐
│ Groupe │ Note finale/20 │ Commentaire               │
├────────┼───────────────┼──────────────────────────┤
│ G01    │ 17             │ Solide, bonne synthèse...│
│ G02    │ 13             │ ...                       │  ← clic ligne = va au détail (Module 4)
└────────┴───────────────┴──────────────────────────┘
```

**Ergonomie** : tri par colonne (note croissante/décroissante). Clic sur une ligne renvoie à la grille détaillée du groupe (Module 4). Groupes non encore évalués affichés en fin de liste avec mention « En attente ».

**Direction artistique** : tableau épuré fond ivoire, en-têtes noir/doré. Note finale en gras doré si ≥ 16, standard sinon.

**Responsive** : desktop = tableau. Mobile = liste de lignes compactes (Groupe — Note — icône commentaire), clic ouvre le détail.

**Notes d'implémentation** : cette vue doit se mettre à jour automatiquement dès qu'une évaluation est enregistrée dans le Module 4 (même source de données).

---

## Module 6 — Navigation principale

**Vue d'ensemble** : ossature de navigation du site, doit rester lisible même avec 7 entrées.

**Wireframe textuel**
```
Desktop (une ligne) :
[ Logo/Favicon ]  Équipes · Suivi journalier · Assiduité · Notes CC · Partiel · Profs présents · Administrateur

Mobile :
[ ☰ Menu ]  IGRH Week                          ← header compact
   → menu déroulant ou barre d'onglets scrollable horizontalement
```

**Ergonomie** : entrée active soulignée d'un filet doré. Sur mobile, éviter d'écraser 7 libellés — privilégier un menu hamburger ou une barre scrollable avec icônes + libellés courts.

**Direction artistique** : fond noir profond, texte ivoire, entrée active en doré. Pas d'effet hover lourd — simple changement de couleur de texte.

**Responsive** : desktop = une ligne fixe en haut. Mobile = menu hamburger (recommandé, plus fiable que le scroll horizontal pour 7 entrées) ou barre d'onglets en bas d'écran avec icônes.

**Notes d'implémentation** : garder « Administrateur » visuellement distinct (icône cadenas) pour rappeler l'accès protégé par mot de passe.

---

## Module 7 — Favicon

**Vue d'ensemble** : intégrer l'image fournie comme favicon officiel.

**Notes d'implémentation** : générer les formats nécessaires (16×16, 32×32, apple-touch-icon 180×180) à partir de l'image source, sans en modifier l'identité visuelle. Remplacer `/public/favicon.ico` (et ajouter `apple-touch-icon.png` si écran d'accueil mobile souhaité).

---

## Synthèse finale

**Navigation et hiérarchie**
```
Accueil → redirection rapide vers « Suivi journalier »
├── Équipes (groupes + composition)
├── Suivi journalier (Brief du jour — Module 1)
├── Assiduité (Dashboard — Module 2 + détail journalier)
├── Notes CC (Module 3)
├── Partiel (Saisie — Module 4 + Vue synthétique — Module 5)
├── Profs présents
└── Administrateur (protégé par mot de passe)
```

**Checklist de conformité**
- [ ] Compréhension en 10 secondes sur chaque page (test : montrer l'écran 10s à quelqu'un qui ne connaît pas l'outil)
- [ ] Palette stricte respectée partout (noir profond / doré champagne / ivoire — pas de gris ni de blanc pur)
- [ ] Fonctionnalités existantes préservées (rien de supprimé, uniquement ajouté/habillé)
- [ ] Les 7 modules présents et navigables
- [ ] Responsive validé sur mobile réel (pas seulement DevTools)
- [ ] Aucune animation ou micro-interaction superflue
- [ ] Favicon visible dans l'onglet navigateur

**Priorités de développement** (ordre recommandé)
1. Navigation principale (Module 6) — ossature de tout le reste
2. Dashboard Assiduité (Module 2) — le plus utilisé en continu
3. Brief du jour (Module 1) — simple et à forte valeur immédiate
4. Notes CC (Module 3)
5. Partiel — saisie (Module 4) puis vue synthétique (Module 5)
6. Favicon (Module 7) — rapide, à faire en dernier ou en parallèle

---

*Document de spécification — étape 1 de la mission. Étape 2 : implémentation dans le code Next.js existant, module par module, dans l'ordre de priorité ci-dessus.*
