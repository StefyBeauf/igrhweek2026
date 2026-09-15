# CLAUDE.md — Instructions du projet IGRH Week – Espace Formateurs

**Statut du projet** : V2 livrée et déployée — en phase d'exploitation avant le séminaire (mises à jour continues de données réelles et d'ajustements UX)

---

## 1. Résumé du projet

**Nom du projet** : IGRH Week – Espace Formateurs

**Type de projet** :
- [x] Application web
- [x] Site web
- [x] Outil interne pédagogique

**Objectif principal** :
Cockpit opérationnel premium pour les ~20 enseignants intervenants du séminaire IGRH Week 2026 (5 jours, du lundi 21 au vendredi 25 septembre 2026). L'outil centralise en un seul endroit les informations pédagogiques critiques du séminaire : brief du jour, composition des groupes, suivi et commentaires pédagogiques, présences, notes de contrôle continu, évaluation du partiel, planning des intervenants et documents utiles.

**Résultat attendu** :
Un site déployé sur Vercel, utilisable immédiatement par les enseignants sur mobile comme sur desktop, sans authentification lourde, avec des données réelles (étudiants, intervenants, briefs) et une saisie partagée en direct entre tous les formateurs (Notes CC, Partiel, Commentaires).

---

## 2. Contexte métier

**Pourquoi ce projet existe** :
Pendant le séminaire, les enseignants ont besoin d'accéder rapidement à des informations critiques (présences, notes, commentaires de suivi, planning des intervenants, brief du jour) sans passer par un email ou un intranet papier trop lents, ni un logiciel lourd hors de proportion pour 5 jours d'usage.

**Qui va utiliser le résultat** :
- ~20 enseignants intervenants (consultants RH, formateurs spécialisés), sur ordinateur (salle commune) et mobile (en circulation, en salle)
- Stéphanie (admin) pour la mise à jour des données et le pilotage

**Niveau technique des utilisateurs finaux** :
- [x] Intermédiaire à avancé (consultants RH, formateurs, cadres) — interface simple et intuitive requise, aucune formation technique

**Ce qui compte le plus** :
- [x] Fiabilité en exploitation pendant la semaine du séminaire
- [x] Facilité d'usage, mobile en priorité
- [x] Design professionnel et premium (cockpit opérationnel, pas intranet)
- [x] Lisibilité en 10 secondes : comprendre où agir immédiatement
- [x] Facilité de maintenance (données modifiables via JSON, sans base de données)

---

## 3. Périmètre du projet

**Ce que le projet fait aujourd'hui** :

*Suivi journalier* :
- Brief du jour par spécialité (RH / CACG / FI), sous un sélecteur LUNDI → VENDREDI
- Bloc « Site & salles » (logistique du séminaire, `data/logistics.json`) : site du séminaire et répartition des salles par tranche de groupes (1 à 6, 7 à 13, 14 à 19, 20 à 26) — actuellement toutes « à confirmer », à mettre à jour dès que les vraies infos sont connues
- Onglet Commentaires : saisie par groupe × jour (RH / CACG / FI), avec sous-onglets Lundi à Jeudi (pas de saisie vendredi, jour des soutenances)
- Onglet Salles : reprend exactement les mêmes tranches de groupes que le bloc « Site & salles » (cohérence garantie, une seule source de données)

*Équipes* :
- 26 groupes réels, 131 étudiants réels (source : fichier « LISTE DEF SEMINAIRE IGRH WEEK.xlsx »), composition variable par groupe (1 FI, 2 à 3 RH, 0 à 2 CACG selon la répartition réelle)
- Code couleur par spécialité appliqué partout : RH = vert, CACG = doré, FI = bleu

*Assiduité* :
- Vue stats par défaut (groupes Normal / Vigilance / Alerte), détail au clic sur un groupe

*Évaluations* :
- Notes CC : tableau Groupe × FI/CACG/RH, note + commentaire par spécialité
- Partiel : grille de saisie 6 critères (total /20 calculé automatiquement), avec possibilité de noter en demi-points (bouton « + ½ » à côté de chaque critère, en plus des boutons entiers) — et vue synthétique triable, cliquable vers le détail

*Profs présents* :
- Planning statique en lecture seule (jour × matin/après-midi × spécialité), 16 intervenants réels (`data/profs.json`)

*Documents* :
- Classés par audience (Formateurs / Étudiants) puis par spécialité (RH / CACG / FI), avec une section « Général » pour les documents transverses (pas liés à une seule spécialité)
- Un document peut être mis « à la une » (`featured: true`) et afficher une version (ex. « Version 14/09 ») — utilisé pour le sujet commun du séminaire

*Administration* :
- Zone protégée par mot de passe simple (`PPAIGRH2026`, haché en SHA-256 côté client)
- Export JSON des jeux de données de référence (groupes, présences, commentaires, notes, partiel, profs, salles, briefs, documents)
- Bloc de collecte des données brutes Edusign (texte libre, partagé)

**Ce que le projet ne doit pas faire pour l'instant** :
- Intégration Edusign en temps réel (seule la collecte brute manuelle existe)
- Calcul automatique de moyennes ou statistiques complexes
- Système de messagerie ou notifications en temps réel
- Authentification multi-utilisateurs (un seul mot de passe admin partagé)
- Archivage automatique des données après le séminaire

**Version actuelle** :
- [x] V2 déployée (refonte UX/UI premium + 7 modules) — en phase d'exploitation, ajustements continus jusqu'au séminaire

**Priorité principale** :
Fiabilité et exactitude des données réelles avant le lundi du séminaire (21 septembre 2026). Toute nouvelle demande passe par : modification → vérification locale (build + test navigateur) → déploiement → vérification en production.

---

## 4. Contraintes importantes

**Contraintes de temps** :
Séminaire du 21 au 25 septembre 2026. Le site doit rester fiable et à jour jusqu'à cette date, puis pendant toute la semaine (pas de régression pendant l'exploitation).

**Contraintes de budget** :
Zéro coût : Vercel (plan gratuit), GitHub (repo public gratuit), Google Apps Script + Google Sheets (gratuit) pour le stockage partagé.

**Contraintes techniques** :
- ✅ Next.js 15 App Router + React 19 + TypeScript strict
- ✅ Tailwind CSS 4 pour tout le styling
- ✅ Données de référence dans `/data/*.json`, modifiables manuellement
- ✅ Stockage partagé en direct (Notes CC, Partiel, Commentaires, Edusign brut) via Google Apps Script + Google Sheets — voir section 7
- ✅ Déploiement Vercel automatique sur chaque `git push origin main`
- ❌ Pas de Supabase, Firebase, base SQL
- ❌ Pas de système d'authentification lourd (mot de passe simple suffisant)
- ❌ Pas de dépendances UI lourdes (Material-UI, AntDesign, Chakra UI)
- ❌ Pas de state management complexe (Redux, Zustand)

**Contraintes de design** :
- **Direction artistique obligatoire** : noir profond · doré champagne · ivoire (voir `SPEC-UX-UI-V2.md` pour le détail des wireframes d'origine — la palette réelle appliquée est dans `app/globals.css`)
- Typographie : Manrope (poids Regular), pas de majuscules forcées sur les titres, filet doré comme repère visuel
- Icônes simples, cartes, badges, hiérarchie visuelle claire
- Navigation en une seule ligne desktop, pills horizontales scrollables sur mobile — **pas de menu hamburger** (rejeté explicitement, y compris sur mobile)
- Mobile-first : un enseignant sort son téléphone et trouve son info en secondes
- Une idée = 10 secondes max pour comprendre où agir

**Contraintes d'usage** :
- Les données de référence se modifient en éditant les fichiers JSON dans `/data`, puis `git commit` + `git push` → déploiement automatique Vercel
- Les données saisies pendant le séminaire (Notes CC, Partiel, Commentaires, Edusign brut) sont partagées en direct entre tous les formateurs, sans redéploiement
- Les enseignants ne touchent jamais au code

**Contraintes de sécurité / données** :
- ❌ Pas de secrets, clés API ou mots de passe en clair dans le code
- ✅ Mot de passe admin simple (`PPAIGRH2026`), hachage SHA-256 côté client — acceptable pour un outil interne temporaire
- ⚠️ Le repository GitHub est **public** (`StefyBeauf/igrhweek2026`) et contient les noms réels des étudiants et intervenants. Décision assumée par Stéphanie : le passage en privé avait cassé l'intégration Vercel (perte d'accès de l'app GitHub de Vercel), il a donc été choisi de rester public plutôt que de reconfigurer les permissions. Point de vigilance à rappeler si le sujet revient, ne pas re-changer la visibilité sans validation explicite.
- ⚠️ Pas de RGPD critique (données du séminaire, pas d'archivage prévu après coup)

---

## 5. Outils, plateformes et technologies

**Outils / plateformes imposés** :
- Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4
- Vercel (déploiement, projet `igrhweek2026`)
- Google Apps Script + Google Sheets (backend de stockage partagé — voir section 7)

**Outils / plateformes préférés** :
- Police Manrope (via `next/font/google`)
- Icônes simples (pas de librairie d'icônes lourde)

**Outils / plateformes à éviter** :
- Material-UI, AntDesign, Chakra UI (trop lourd)
- Supabase, Firebase, base SQL classique (inélégant pour cette taille de projet)
- Redux, Zustand, Jotai (state management complexe non justifié)
- Framer Motion (animations non critiques)

---

## 6. Structure du projet

```
/igrh-week-espace-formateurs
├── /app
│   ├── layout.tsx                  # Layout global, police Manrope, navigation
│   ├── /suivi-journalier           # Brief du jour + Commentaires + Salles
│   ├── /groupes                    # Liste des 26 groupes + fiche détail (/groupes/[id])
│   ├── /assiduite                  # Dashboard présences/absences
│   ├── /notes-cc                   # Notes contrôle continu
│   ├── /partiel                    # Saisie + vue synthétique partiel
│   ├── /profs-presents             # Planning intervenants (lecture seule)
│   ├── /documents                  # Documents utiles (formateurs / étudiants)
│   ├── /admin                      # Zone protégée par mot de passe
│   ├── /salles                     # Route orpheline, non liée dans la navigation (héritage V1)
│   └── /api/store/[key]            # Route générique GET/PUT vers le stockage partagé
├── /components                     # Navigation, DayBriefCard, Badge, Card, SearchBar...
├── /lib
│   ├── data.ts                     # Point d'entrée unique : types + lecture des JSON de /data
│   ├── store.ts                    # Client du stockage partagé (Google Sheets)
│   ├── useSharedData.ts            # Hook React : charge au montage, sauvegarde debouncée
│   └── utils.ts
├── /data                           # Données de référence, modifiables manuellement
│   ├── groups.json                 # 26 groupes, 131 étudiants réels
│   ├── profs.json                  # 16 intervenants réels + planning
│   ├── briefs.json                 # Briefs des 5 jours
│   ├── attendance.json             # Présences par défaut ("Présent")
│   ├── comments.json               # Gabarit vide (la saisie réelle vit sur Google Sheets)
│   ├── notes-cc.json               # Gabarit vide (idem)
│   ├── partiel.json                # Gabarit vide (idem)
│   ├── rooms.json                  # Héritage V1, non utilisé par l'UI actuelle
│   ├── logistics.json              # Site & salles (tranches de groupes) du séminaire
│   ├── documents.json              # Documents utiles (avec audience/spécialité/featured/version)
│   └── days.json
├── /public/documents               # Fichiers PDF/DOCX/XLSX référencés par documents.json
├── SPEC-UX-UI-V2.md                # Spécification UX/UI d'origine (wireframes, palette de référence)
├── CLAUDE.md                       # Ce fichier
└── README.md
```

**Fichiers à ne pas modifier sans validation** :
- `app/globals.css` (palette et design system)
- `next.config.js`
- Le mot de passe admin et son hachage dans `app/admin/AdminPanel.tsx`

**Fichiers ou dossiers à ignorer** :
- `.next/`, `node_modules/`, `.git/`, `.env.local`

**Point d'attention structurel** : `data/rooms.json` et `app/salles/` sont des restes de la V1 (répartition aléatoire des salles), remplacés par `data/logistics.json` pour tout ce qui touche à la logistique du séminaire. Ne pas les réactiver sans clarifier avec Stéphanie.

---

## 7. Données, fichiers et contenus

**Deux catégories de données, à ne pas confondre** :

1. **Données de référence** (`/data/*.json`) : groupes, intervenants, briefs, documents, logistique. Modifiables uniquement en éditant les fichiers JSON, puis `git commit` + `git push` (déploiement Vercel automatique).

2. **Données saisies en direct par les formateurs** (Notes CC, Partiel, Commentaires, collecte Edusign brute) : stockées sur un **Google Sheets**, via un Google Apps Script Web App exposé en HTTP. Le site les lit/écrit via la route `app/api/store/[key]/route.ts` (clés autorisées : `notes-cc`, `partiel`, `comments`, `edusign`), elle-même appelée par le hook `lib/useSharedData.ts` (chargement au montage, sauvegarde debouncée ~600ms après chaque modification). **Pas de redéploiement nécessaire** pour que tous les formateurs voient la même saisie en temps réel.
   - Variables d'environnement Vercel : `SHEETS_WEBAPP_URL`, `SHEETS_WEBAPP_SECRET` (configurées côté dashboard Vercel, jamais dans le code)
   - Latence connue : les appels depuis les fonctions serverless Vercel vers le Web App Apps Script peuvent prendre plusieurs secondes (verrou anti-écriture-concurrente côté script). Timeout fixé à 20s côté client (`lib/store.ts`), fonction API autorisée à tourner jusqu'à 25s (`export const maxDuration = 25`)

**Format des groupes** (`data/groups.json`) :
```json
{
  "id": "G01",
  "name": "Groupe 01",
  "students": [
    { "prenom": "Tatiana", "nom": "ASSAF", "name": "Tatiana ASSAF", "specialty": "FI" }
  ]
}
```

**Format des documents** (`data/documents.json`) :
```json
{
  "id": "D09",
  "titre": "Sujet commun — Séminaire IGRH Week 2026",
  "audience": "etudiants",
  "url": "/documents/sujet-commun-seminaire-igrh-week-2026.pdf",
  "version": "14/09",
  "featured": true
}
```
`specialty` est optionnel (absent = document transverse, affiché dans une section « Général »). `featured` + `version` mettent un document en avant en haut de la page Documents.

**Règles de traitement** :
- Les 26 groupes doivent rester lisibles et recherchables partout (Équipes, Notes CC, Partiel, Commentaires, Assiduité)
- Toute modification du nombre ou de la composition des groupes doit régénérer en cohérence : `attendance.json`, `notes-cc.json`, `partiel.json`, `comments.json` (gabarits), et réinitialiser les mêmes clés côté Google Sheets si elles contiennent encore l'ancien gabarit
- Pas de données fictives : toutes les données de référence actuelles sont réelles (étudiants, intervenants, dates)

**Données sensibles** :
- Noms réels d'étudiants et d'intervenants présents dans les données ET dans le repo GitHub public (voir section 4) — ne jamais y ajouter de données plus sensibles (téléphone, email, identifiants)

---

## 8. Site web — Objectif et UX

**Objectif de l'interface** : qu'un enseignant, en arrivant sur le site, comprenne en 10 secondes ce qui se passe aujourd'hui et où agir.

**Navigation** (une ligne desktop, pills scrollables mobile, jamais de hamburger) :
Suivi journalier · Équipes · Assiduité · Notes CC · Partiel · Profs présents · Documents · Administrateur (épinglé à droite, icône cadenas)

**Style visuel** : noir profond / doré champagne / ivoire, typographie Manrope, code couleur constant par spécialité (RH vert, CACG doré, FI bleu) répété sur toutes les pages (Équipes, Notes CC, Partiel, Profs présents, Documents, Commentaires).

**Règles UX non négociables** :
- Pas de menu hamburger, ni desktop ni mobile
- Saisie rapide pendant les soutenances (grille Partiel : boutons tactiles, calcul automatique du total, demi-points via bouton dédié)
- Sauvegarde silencieuse (pas de pop-up de confirmation intrusive) pour tout ce qui est partagé en direct
- Toujours vérifier la responsivité mobile avant de considérer une page terminée

Référence détaillée des wireframes d'origine : `SPEC-UX-UI-V2.md` (garder à l'esprit que la palette exacte a légèrement évolué depuis, voir `app/globals.css` qui fait foi).

---

## 9. Commandes utiles

**Installation** :
```bash
npm install
```

**Lancer le projet** :
```bash
npm run dev
# http://localhost:3000
```

**Build production** :
```bash
npm run build
```

**Vérifier les types** :
```bash
npx tsc --noEmit
```

**Déploiement** :
```bash
git push origin main
# Déploiement automatique Vercel sur le projet igrhweek2026
```

**⚠️ Particularité locale connue** : le port SSH 22 vers GitHub est bloqué depuis cette machine. Utiliser systématiquement le contournement port 443 pour pousser :
```bash
GIT_SSH_COMMAND="ssh -o Port=443 -o HostName=ssh.github.com" git push origin main
```

---

## 10. Règles de travail pour Claude dans ce projet

**Avant de modifier** :
1. Comprendre l'objectif précis de la demande
2. Identifier si la donnée touchée est une donnée de référence (JSON + redéploiement) ou une donnée partagée en direct (Google Sheets, via l'API `/api/store/[key]`)
3. Expliquer brièvement le plan si la modification est importante (ex. changement de la composition des groupes, nouvelle section)
4. Demander confirmation avant toute action risquée (suppression de fichier, remplacement massif de données)

**Pendant la modification** :
1. Solution la plus simple qui répond au besoin, pas de sur-ingénierie
2. Respecter scrupuleusement la charte (noir, doré, ivoire) et le code couleur par spécialité
3. Si la structure des groupes change, penser à régénérer en cohérence tous les fichiers qui en dépendent (voir section 7)
4. Vérifier la responsivité mobile à chaque changement UI visible

**Après la modification** :
1. `npx tsc --noEmit` + `npm run build` avant tout déploiement
2. Test visuel en local (Browser pane) pour toute modification UI observable
3. `git push` (avec le contournement port 443 si besoin), puis vérifier que le déploiement Vercel passe en `READY`
4. Vérifier le résultat directement en production (curl ou navigateur) avant de confirmer à Stéphanie
5. Résumer ce qui a changé, les fichiers modifiés, et signaler les limites ou points à vérifier

---

## 11. Tests et vérification

**Méthode de vérification attendue** :
1. `npm run dev` démarre sans erreur
2. Toutes les sections de la navigation sont accessibles et affichent les données réelles
3. Aucune erreur console au chargement
4. Interface lisible sur mobile (375px) et desktop
5. La saisie partagée (Notes CC, Partiel, Commentaires) fonctionne et persiste après rechargement
6. Le mot de passe admin fonctionne
7. Après déploiement, revérifier directement sur l'URL de production (`https://igrhweek2026-beaufume.vercel.app`)

**Scénario de test de référence** :
- Groupe 01 visible dans Équipes, avec sa composition réelle
- Brief de lundi affichable dans Suivi journalier
- Saisie d'une note CC pour Groupe 01, rechargement de la page → note toujours présente
- Grille Partiel Groupe 01 : saisie d'un critère avec demi-point → total recalculé correctement
- Document mis en avant visible en haut de la page Documents

---

## 12. Sécurité et points de vigilance

**Claude doit faire attention à** :
- ❌ Ne jamais exposer les identifiants du Web App Google Apps Script ou toute clé dans le code (toujours via variables d'environnement Vercel)
- ❌ Ne pas supprimer ou écraser un fichier JSON de données sans confirmation
- ❌ Ne pas modifier la charte visuelle (palette, typographie) sans validation explicite
- ❌ Ne pas re-changer la visibilité du repository GitHub (public) sans validation explicite — un précédent changement en privé avait cassé le déploiement Vercel
- ⚠️ Le mot de passe admin est stocké côté client (hachage simple) — acceptable pour cet outil temporaire, ne pas complexifier
- ⚠️ Toujours nettoyer les données de test écrites sur le Google Sheets partagé après une vérification en direct (remettre la valeur `null` ou le gabarit vide)

**Informations sensibles à ne jamais inclure** :
- Clés API, tokens d'authentification (Vercel, GitHub, Google Apps Script)
- Mot de passe admin en clair ailleurs que dans son hachage
- Toute donnée personnelle au-delà des noms déjà présents (pas de téléphone, email, identifiant)

---

## 13. Documentation attendue

- `README.md` : instructions de lancement et de déploiement
- Ce fichier `CLAUDE.md` : référence complète du projet
- `SPEC-UX-UI-V2.md` : spécification UX/UI d'origine (à conserver comme référence historique, ne pas la considérer comme à jour sur la palette exacte)
- Pas de documentation supplémentaire à créer sauf demande explicite

---

## 14. Décisions déjà prises

1. ✅ Stack Next.js 15 + React 19 + TypeScript + Tailwind CSS 4, déploiement Vercel
2. ✅ Données de référence en JSON modifiables manuellement — pas de base de données
3. ✅ Mot de passe admin simple (`PPAIGRH2026`), hachage SHA-256 côté client
4. ✅ Design premium noir · doré champagne · ivoire, police Manrope, pas de menu hamburger
5. ✅ Code couleur constant par spécialité (RH vert, CACG doré, FI bleu) sur tous les modules
6. ✅ Données réelles injectées (26 groupes, 131 étudiants, 16 intervenants) — plus de données fictives
7. ✅ Stockage partagé en direct pour Notes CC, Partiel et Commentaires via Google Apps Script + Google Sheets, après rejet d'Upstash/Vercel KV (Stéphanie voulait une solution Google Drive/Sheets, pas un service de base de données tiers)
8. ✅ Demi-points possibles dans la grille du Partiel (bouton « + ½ » à côté de chaque critère)
9. ✅ Documents organisés par audience puis spécialité, avec une section « Général » pour les documents transverses et un mécanisme de mise en avant (`featured` + `version`)
10. ✅ Bloc « Site & salles » et onglet « Salles » du Suivi journalier unifiés sur une seule source de données (`logistics.json`) pour rester cohérents entre eux
11. ✅ Repository GitHub public assumé (voir section 4), malgré les données réelles qu'il contient
12. ✅ Contournement SSH port 443 systématique pour `git push` depuis cette machine (port 22 bloqué)

**Choix refusés** :
- ❌ Vercel KV / Upstash Redis pour le stockage partagé — Stéphanie a demandé une alternative Google Drive/Sheets
- ❌ Supabase / Firebase, Redux / Zustand, Material-UI / AntDesign / Chakra — trop lourd pour ce projet
- ❌ Menu hamburger, y compris sur mobile — rejeté explicitement
- ❌ Titres tout en majuscules — testé puis retiré à la demande de Stéphanie
- ❌ Intégration Edusign en temps réel — seule une collecte manuelle brute existe

---

## 15. Questions ouvertes

- ⚠️ Site et salles réelles du séminaire : toujours « à confirmer » dans `data/logistics.json` — à mettre à jour dès que Stéphanie a l'information définitive
- ⚠️ 16 étudiants du fichier de répartition définitif n'existaient pas dans l'ancienne liste : leur prénom/nom a été déduit automatiquement (règle : nom de famille = mots en MAJUSCULES) — à faire vérifier par Stéphanie si l'occasion se présente, en particulier les noms composés
- ⚠️ `data/rooms.json` et `app/salles/` (route orpheline) : hérités de la V1, non branchés à la navigation actuelle — à supprimer ou réactiver selon décision de Stéphanie, ne pas y toucher sans clarification

**Hypothèses raisonnables** :
- Les données saisies pendant le séminaire (notes, commentaires) restent sur le Google Sheets, pas d'archivage automatique prévu après coup
- Le mot de passe admin est connu de tous les enseignants (confiance mutuelle, outil interne)

---

## 16. Définition de terminé

**Pour toute nouvelle tâche sur ce projet, elle est terminée quand** :
- ✅ `npx tsc --noEmit` et `npm run build` passent sans erreur
- ✅ Testé visuellement en local (desktop + mobile) si la modification est visible
- ✅ Poussé sur GitHub et déployé sur Vercel (état `READY` confirmé)
- ✅ Vérifié directement en production (pas seulement en local)
- ✅ Résumé clair donné à Stéphanie : ce qui a changé, fichiers concernés, comment vérifier, limites éventuelles

---

## 17. Notes supplémentaires

**Principes pédagogiques** : l'outil reste un petit cockpit d'exploitation premium, pas un logiciel RH lourd. Simple > complet. Rapide > sophistiqué. Lisible > technique.

**Historique utile à connaître** :
- V1 : prototype avec données fictives (21 groupes)
- V2 : refonte UX/UI complète + 7 modules (voir `SPEC-UX-UI-V2.md` pour le détail d'origine), déployée avant le séminaire
- Depuis la V2 : injection des données réelles (groupes, intervenants, briefs), passage du stockage local (`localStorage`, par navigateur) à un stockage partagé en direct (Google Sheets), ajout des documents réels, correction de plusieurs noms d'intervenants et d'étudiants, mise à jour de la composition des groupes (21 → 26 groupes, 131 étudiants), ajout des demi-points au Partiel, ajout du bloc logistique Site & salles

**Environnement d'exécution** : Node.js 18+, npm 9+, aucune dépendance système complexe.

**Prochaines itérations possibles (hors scope actuel)** :
- Export/import Excel des notes et présences
- Intégration Edusign en temps réel
- Graphiques / analytics sur l'assiduité et les notes
- Archivage post-séminaire
- Nettoyage des restes de la V1 (`data/rooms.json`, `app/salles/`)
