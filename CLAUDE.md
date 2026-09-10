# CLAUDE.md — Instructions du projet IGRH Week – Espace Formateurs

**Statut du projet** : V2 — Refonte UX/UI majeure + 7 nouveaux modules (en cours)

---

## 1. Résumé du projet

**Nom du projet** : IGRH Week – Espace Formateurs

**Type de projet** :
- [x] Application web
- [x] Site web  
- [x] Outil interne pédagogique

**Objectif principal** :
Créer et maintenir un cockpit opérationnel premium pour les enseignants pendant le séminaire IGRH Week 2026 (5 jours). L'outil centralise les informations pédagogiques (briefs, groupes, suivi, présences, notes, évaluations, documents, salles) et les rend accessibles en 2-3 clics maximum depuis desktop et mobile. **V2** : refonte complète de l'UX/UI avec direction artistique premium (noir profond · doré champagne · ivoire) + 7 nouveaux modules.

**Résultat attendu** :
Un site web complet, responsive, déployable sur Vercel, utilisable immédiatement par ~20 enseignants pendant la semaine du séminaire. Les données sont modifiables via des fichiers JSON simples ; pas de base de données ni d'authentification complexe. La V2 améliore fortement : lisibilité, hiérarchie visuelle, pilotage des équipes, suivi d'assiduité, saisie des notes et évaluations.

---

## 2. Contexte métier

**Pourquoi ce projet existe** :
Pendant le séminaire IGRH Week, les enseignants ont besoin d'accéder rapidement à des informations critiques (présences, notes, commentaires de suivi, planning des salles, briefs du jour, évaluations finales). Un intranet papier ou un email classique sont trop lents. Un logiciel lourd est hors de question. Solution : un petit site léger, rapide, pensé comme un cockpit d'exploitation premium.

**Qui va utiliser le résultat** :
- Les ~20 enseignants intervenants (consultants RH, formateurs spécialisés)
- Pendant 5 jours consécutifs (lundi à vendredi)
- Accès via ordinateur (salle commune) ET téléphone (en circulation, en salle)
- Un administrateur (Stéphanie) pour la gestion et la mise à jour des données

**Niveau technique des utilisateurs finaux** :
- [x] Intermédiaire à avancé (consultants RH, formateurs, cadres)
- Interface simple et intuitive requise — pas de formation technique
- Consultation rapide et saisie de données simples (notes, commentaires)

**Ce qui compte le plus** :
- [x] Rapidité de mise en place et fiabilité (déploiement avant le séminaire)
- [x] Facilité d'usage (mobile en priorité)
- [x] Design professionnel et premium (cockpit opérationnel, pas intranet)
- [x] Lisibilité absolue : compréhension en 10 secondes
- [x] Fiabilité en exploitation (zéro bugs pendant la semaine)
- [x] Facilité de maintenance (modification des données simples via JSON)
- [x] Responsivité multi-écran (desktop et mobile)

---

## 3. Périmètre du projet

**Ce que le projet doit faire** :

*Vue générale* :
- Afficher un brief du jour (objectifs, consignes, points de vigilance, échéances)
- Lister les 21 groupes avec composition (noms des étudiants par spécialité : RH, Finance, CACG)
- Afficher les commentaires de suivi pédagogique organisés par jour et spécialité
- Centraliser les documents utiles (sujet, consignes, planning, grilles, supports, etc.)

*Suivi opérationnel* :
- Afficher les présences/absences/retards par groupe (avec dashboard d'alerte rapide)
- Piloter l'assiduité : identifier immédiatement les groupes à risque
- Afficher la répartition des groupes dans les salles par jour
- Ajouter des commentaires de suivi pédagogique

*Évaluations* :
- Afficher les notes CC (contrôle continu) par spécialité (FI, CACG, RH) avec possibilité de saisie
- Afficher et gérer les notes du partiel (soutenance vendredi) avec grille de critères (6 critères /20)
- Vue synthétique des résultats du partiel
- Permettre une saisie rapide pendant les soutenances

*Administration* :
- Protéger les zones sensibles avec mot de passe simple
- Permettre la modification des données JSON via édition manuelle

**Ce que le projet ne doit pas faire pour l'instant** :
- Intégration directe avec Edusign (import manuel via fichier) ⚠️ À considérer
- Calcul automatique de moyennes ou statistiques complexes (MVP uniquement)
- Système de messagerie ou notifications en temps réel
- Gestion des comptes utilisateurs multiples
- Interface d'édition temps réel pour les données (JSON manuel pour MVP)
- Rapports ou analyses sophistiquées
- Archivage automatique des données après la semaine
- Export/import Excel massif (prochaine itération)

**Version souhaitée** :
- [x] MVP V1 : prototype rapide avec données fictives (déjà livrée)
- [x] V2 : refonte UX/UI majeure + 7 nouveaux modules

**Priorité principale** :
Version V2 fonctionnelle et déployée **avant le lundi de la semaine du séminaire**. Refonte UX/UI comme priorité absolue. Préférer simple et livré à parfait et retardé.

---

## 4. Contraintes importantes

**Contraintes de temps** :
- V1 : déjà livrée
- V2 : refonte UX/UI complète + 7 modules avant la semaine du séminaire (date critique : lundi)
- Pas de délai pour itération majeure après le déploiement de la V2

**Contraintes de budget** :
Zéro coût (hébergement Vercel gratuit, stack open source, aucun service payant).

**Contraintes techniques** :
- ✅ Next.js 15 App Router + React 19 + TypeScript strict obligatoires
- ✅ Tailwind CSS 4 pour tout le styling
- ✅ Shadcn/ui optionnel (uniquement si vraiment utile)
- ✅ Données dans `/data/*.json` modifiables manuellement
- ✅ Déploiement Vercel sans processus complexe
- ❌ Pas de Supabase, Firebase, base SQL
- ❌ Pas de système d'authentification lourd (simple mot de passe suffisant)
- ❌ Pas de dépendances lourdes (Material-UI, AntDesign, Chakra UI)
- ❌ Pas de back-end complexe
- ❌ Pas de state management complexe (Redux, Zustand)

**Contraintes de design** :
- **Direction artistique obligatoire** : noir profond · doré champagne · ivoire
- Premium, épuré, moderne, minimaliste — cockpit de direction, pas intranet scolaire
- Typographie sobre et élégante (Geist ou équivalent)
- Icônes simples (Lucide)
- Cartes, badges, hiérarchie visuelle claire
- Pas d'effet « logiciel lourd »
- Pas de tableaux énormes non lisibles
- Navigation une seule ligne desktop, compacte mobile
- **Mobile-first absolu** : un enseignant sort son téléphone et trouve son info en secondes
- Contraste maximal pour lisibilité immédiate
- Une idée = 10 secondes max pour comprendre où agir

**Contraintes d'usage** :
- Les données doivent pouvoir être modifiées en éditant les fichiers JSON
- Modification JSON → git commit → Vercel deploy automatique (ou redéploiement manuel simple)
- Pas besoin de UI d'édition temps réel pour les données (JSON suffisant pour l'admin)
- Les enseignants ne doivent pas toucher au code
- Un admin (Stéphanie) peut modifier les données sans aide technique

**Contraintes de sécurité / données** :
- ❌ Pas de stockage de données personnelles réelles après le séminaire
- ❌ Pas de transmission d'emails ou SMS
- ✅ Mot de passe admin simple (PPAIRH2026) — suffisant pour outil interne temporaire
- ⚠️ Hachage simple du mot de passe acceptable (côté client pour outil interne)
- ❌ Pas d'obligation RGPD critique (données de démonstration en l'état)

---

## 5. Outils, plateformes et technologies

**Outils / plateformes imposés** :
- Next.js 15 App Router
- React 19
- Tailwind CSS 4
- TypeScript strict
- Vercel (déploiement)

**Outils / plateformes préférés** :
- Shadcn/ui pour composants si vraiment utile (sinon Tailwind pur)
- Font : Geist (Vercel default)
- Icons : Lucide ou Feather (léger)
- Favicon : image fournie (identité visuelle)

**Outils / plateformes à éviter** :
- Material-UI, AntDesign, Chakra UI (trop lourd)
- Supabase, Firebase (inélégant pour cette taille)
- Redux, Zustand, jotai (state management complexe non justifié)
- Framer Motion (animations non critiques)
- GraphQL (REST JSON suffisant)

---

## 6. Structure du projet

```
/igrh-week-espace-formateurs
├── /app
│   ├── layout.tsx                  # Layout global + navigation premium
│   ├── page.tsx                    # Page d'accueil (redirection rapide)
│   ├── /suivi-journalier
│   │   └── page.tsx                # Brief du jour (MODULE 1)
│   ├── /assiduité
│   │   └── page.tsx                # Dashboard assiduité + détail (MODULE 2)
│   ├── /notes-cc
│   │   └── page.tsx                # Notes contrôle continu par spécialité (MODULE 3)
│   ├── /partiel
│   │   └── page.tsx                # Saisie + vue synthétique partiel (MODULE 4 + 5)
│   ├── /groupes
│   │   └── page.tsx                # Liste groupes + compositions
│   ├── /documents
│   │   └── page.tsx                # Docs utiles
│   ├── /salles
│   │   └── page.tsx                # Répartition groupes/salles
│   ├── /profs-presents
│   │   └── page.tsx                # Profs présents du jour
│   └── /admin
│       └── page.tsx                # Page admin (mot de passe)
├── /components
│   ├── Navigation.tsx              # Barre de nav premium (MODULE 6)
│   ├── DayBriefCard.tsx            # Carte brief du jour
│   ├── AttendanceDashboard.tsx     # Dashboard assiduité (MODULE 2)
│   ├── NotesTable.tsx              # Tableau notes CC (MODULE 3)
│   ├── PartialGradeForm.tsx        # Grille partiel (MODULE 4)
│   ├── PartialSummary.tsx          # Vue synthétique (MODULE 5)
│   ├── SearchBar.tsx               # Moteur de recherche
│   ├── Card.tsx                    # Composant carte standard
│   └── Badge.tsx                   # Badge pour statuts
├── /lib
│   ├── data.ts                     # Utilitaires de lecture des JSON
│   ├── utils.ts                    # Fonctions utilitaires
│   └── constants.ts                # Constantes (couleurs charte, etc.)
├── /data
│   ├── groups.json                 # 21 groupes + composition
│   ├── attendance.json             # Présences/absences/retards
│   ├── notes-cc.json               # Notes CC (FI, CACG, RH)
│   ├── partiel.json                # Évaluations partiel + scores
│   ├── comments.json               # Commentaires de suivi
│   ├── briefs.json                 # Briefs des 5 jours
│   ├── rooms.json                  # Salles et répartition groupes
│   └── documents.json              # Documents utiles
├── /styles
│   └── globals.css                 # Styles Tailwind + CSS personnalisé
├── /public
│   ├── favicon.png                 # Favicon (image fournie)
│   └── (autres assets)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── CLAUDE.md                       # Ce fichier
└── README.md                       # Instructions de lancement
```

**Fichiers à ne pas modifier sans validation** :
- `tailwind.config.js` (design system + palette charte)
- `next.config.js` (configuration de build)
- `/public/favicon.png` (identité visuelle)

**Fichiers ou dossiers à ignorer** :
- `.next/`
- `node_modules/`
- `.git/`
- `.env.local`
- `.gitignore`

---

## 7. Données, fichiers et contenus

**Sources utilisées** :
- JSON local statique dans `/data/`
- Pas de base de données
- Pas d'API externe (pour le moment)

**Emplacement des données** :
Tous les fichiers dans `/data/` :
- `groups.json` : 21 groupes avec ~5-6 étudiants chacun (RH, FI, CACG)
- `attendance.json` : Présences/absences/retards par groupe et jour
- `notes-cc.json` : Notes CC (3 colonnes : FI, CACG, RH) + commentaires par groupe
- `partiel.json` : Scores partiel (6 critères /20) + commentaires jury
- `comments.json` : Commentaires pédagogiques (jour, groupe, spécialité)
- `briefs.json` : Brief du jour pour chaque jour (lundi à vendredi)
- `documents.json` : Liens et métadonnées documents utiles
- `rooms.json` : Salles et répartition groupes par jour

**Format d'entrée** :
JSON structurés, modifiables manuellement dans un éditeur de texte. Format strictement validé.

**Format de sortie** :
Interface web responsive (HTML/CSS/JS compilé via Next.js).

**Règles de traitement des données** :
- ✅ Tous les 21 groupes doivent être lisibles et recherchables
- ✅ Les présences/absences doivent être claires et faciles à identifier
- ✅ Les notes doivent être organisées par spécialité (FI, CACG, RH)
- ✅ Les évaluations du partiel doivent être saisies rapidement (pendant la soutenance)
- ✅ Les commentaires doivent pouvoir être ajoutés facilement
- ✅ Les données fictives doivent être réalistes (noms, chiffres, contexte)
- ✅ Pas de données réelles de vrais étudiants (démonstration uniquement)

**Données sensibles** :
- Pas de stockage de numéros de téléphone réels
- Pas de stockage de numéros d'identification réels
- Noms fictifs cohérents avec une démonstration pédagogique

---

## 8. Modules (V2) — Nouvelles fonctionnalités

**Module 1 : Brief du jour**
Sous le sélecteur LUNDI | MARDI | MERCREDI | JEUDI | VENDREDI, affiche une carte premium avec :
- Texte libre modifiable par l'admin
- Objectifs de la journée, consignes particulières, points de vigilance, échéances
- Design : carte horizontale, fond noir légèrement contrasté, filet doré, typographie ivoire
- Très visible, pas massif
- Option : tabs horizontales Brief du jour | Salles | Document du jour

**Module 2 : Dashboard Assiduité (refondé)**
En haut de l'onglet Assiduité :
- Dashboard visuel par groupe (nombre de membres, présences, absences, niveau d'alerte)
- Mini-indicateur ou diagramme épuré (Normal → Vigilance → Alerte)
- Groupes à risque : ressortir visuellement immédiatement
- Lecture opérationnelle en 5 secondes
- Détail journalier classique en dessous

**Module 3 : Onglet Notes CC (Contrôle continu)**
Tableau unique :
- Groupe | FI – Note CC | FI – Commentaire | CACG – Note CC | CACG – Commentaire | RH – Note CC | RH – Commentaire
- Saisie directe ou champ confortable à ouvrir
- Code couleur : FI bleu nuit, CACG doré, RH vert profond
- Lisibilité maximale même avec beaucoup de groupes
- Responsive mobile : cartes ou navigation horizontale

**Module 4 : Onglet Partiel (Évaluation soutenance)**
Ergonomie de saisie rapide pendant les soutenances :
- Groupe → Ouvrir évaluation → Afficher grille
- Grille : 6 critères avec points max (Total /20, calcul automatique)
  - /4 Compréhension des enjeux
  - /4 Cohérence interdisciplinaire
  - /4 Pertinence des recommandations
  - /3 Argumentation & prise de décision
  - /3 Qualité de la présentation
  - /2 Dynamique collective
- Commentaire du jury

**Module 5 : Vue synthétique Partiel**
Tableau récapitulatif :
- Groupe | Note finale /20 | Commentaire
- Clic sur groupe = retrouver détail des 6 critères
- Piloter la journée en direct + récapitulatif immédiat

**Module 6 : Navigation principale**
Nouvelle navigation :
- Équipes | Suivi journalier | Assiduité | Notes CC | Partiel | Profs présents | Administrateur
- Une ligne desktop, esthétique très fine et premium
- Responsive mobile : navigation adaptée sans écraser

**Module 7 : Favicon**
Intégrer l'image fournie comme favicon officiel :
- Onglet navigateur, favoris, écran d'accueil (si supporté)
- Adapter techniquement sans modifier l'identité visuelle

---

## 9. Commandes utiles

**Installation** :
```bash
npm install
# ou
pnpm install
```

**Lancer le projet** :
```bash
npm run dev
# Accessible sur http://localhost:3000
```

**Build production** :
```bash
npm run build
npm start
```

**Déploiement Vercel** :
```bash
vercel deploy
# Ou git push + déploiement auto si lié à GitHub
```

**Vérifier la structure** :
```bash
ls -la /data/
npm list
```

**Vérifier les types TypeScript** :
```bash
npx tsc --noEmit
```

---

## 10. Règles de travail pour Claude dans ce projet

**Avant de modifier** :
1. Comprendre l'objectif précis de la demande.
2. Identifier les fichiers concernés (code, données, configuration).
3. Expliquer brièvement le plan d'action si la modif est importante.
4. Demander validation avant toute action risquée (suppression, refactor, changement d'architecture).

**Pendant la modification** :
1. Privilégier la solution la plus simple qui répond au besoin.
2. ❌ Pas de sur-ingénierie.
3. ❌ Pas de dépendance inutile.
4. ❌ Pas de modification de fichiers sans rapport.
5. ✅ Garder le projet lisible et compréhensible.
6. ✅ Ajouter des commentaires dans le code si complexe.
7. ✅ Respecter scrupuleusement la charte (noir, doré, ivoire).
8. ✅ Vérifier la responsivité mobile à chaque changement UI.

**Après la modification** :
1. Résumer ce qui a changé (fichiers modifiés, lignes clé).
2. Expliquer comment vérifier que tout fonctionne (`npm run dev`, test navigateur).
3. Signaler les limites, risques ou points à améliorer.
4. Proposer une prochaine étape claire.

---

## 11. Tests et vérification

**Méthode de vérification attendue** :
1. L'application se lance sans erreur avec `npm run dev`
2. Les 8 sections principales sont accessibles et affichent des données
3. La navigation fonctionne sans bug (tous les onglets accessibles)
4. L'interface est lisible sur mobile (largeur < 480px) et desktop (1920px)
5. Les recherches (groupes, noms) fonctionnent correctement
6. Les formulaires (commentaires, notes, partiel) fonctionnent
7. Le mot de passe admin fonctionne
8. La direction artistique (noir · doré · ivoire) est cohérente partout
9. Aucune erreur console au lancement

**Données / scénario de test** :
- Groupe 01 visible dans « Groupes »
- Recherche « Alice Dupont » retourne Groupe 01
- Brief lundi affichable dans « Suivi journalier »
- Présences lundi visibles dans « Assiduité »
- Dashboard assiduité affiche les groupes à risque
- Notes CC saisies pour Groupe 01 (toutes spécialités)
- Partiel : saisie grille 6 critères pour Groupe 01 → Total /20 calculé automatiquement
- Vue synthétique partiel affiche résumé
- Commentaire de suivi visible pour Groupe 01
- Document « Sujet » accessible dans « Documents »
- Favicon visible dans l'onglet du navigateur

**Critères de réussite** :
- ✅ Zéro erreur console au lancement
- ✅ Toutes les 8 sections fonctionnelles
- ✅ Tous les 7 modules implémentés (Brief, Assiduité, Notes CC, Partiel, Vue synthétique, Navigation, Favicon)
- ✅ Responsive mobile (testé sur téléphone réel ou DevTools)
- ✅ Performance acceptable (chargement < 2s)
- ✅ Mot de passe admin sécurisé (pas visible en clair, hachage simple)
- ✅ Données fictives cohérentes et réalistes (21 groupes, 5 jours)
- ✅ Charte visuelle respectée (noir, doré, ivoire cohérents)
- ✅ Déploiement Vercel réussi (URL publique fonctionnelle)
- ✅ Lisibilité absolue : 10 secondes pour comprendre où agir
- ✅ Aucune dépendance inutile

---

## 12. Sécurité et points de vigilance

**Claude doit faire attention à** :
- ❌ Ne jamais exposer de clés API, tokens, mots de passe en clair dans le code
- ❌ Ne pas utiliser le mot de passe dans les variables d'environnement non-chiffrées
- ❌ Ne pas supprimer de fichiers JSON sans demander
- ❌ Ne pas écraser un fichier de données sans validation
- ⚠️ Le mot de passe admin est stocké côté client (hachage simple acceptable pour outil interne temporaire)
- ⚠️ Pas de données sensibles réelles ne doivent être stockées
- ⚠️ Ne pas modifier la charte visuelle sans validation explicite

**Informations sensibles à ne jamais inclure** :
- Clés API
- Tokens d'authentification Vercel ou GitHub
- Mots de passe réels (seulement PPAIRH2026 pour la démo)
- Données personnelles de véritables étudiants
- Numéros d'identité, téléphones, emails réels

---

## 13. Documentation attendue

**Documentation utile** :
- Instructions de lancement (`npm install`, `npm run dev`)
- Comment modifier les données JSON
- Comment ajouter un nouveau groupe / document
- Comment déployer sur Vercel
- Structure simple du projet
- Limites connues
- Description des 7 nouveaux modules (V2)

**Emplacement** :
- README.md (fichier racine)
- Commentaires dans le code pour les sections complexes
- Ce fichier CLAUDE.md (référence complète)

**Exemple README minimal** :
```markdown
# IGRH Week – Espace Formateurs

Site web cockpit pour les enseignants du séminaire IGRH Week 2026.
Version 2 : refonte UX/UI premium + 7 nouveaux modules.

## Lancement rapide

\`\`\`bash
npm install
npm run dev
\`\`\`

Accessible sur http://localhost:3000

## Modifier les données

Éditez les fichiers dans `/data/` :
- `groups.json` : 21 groupes
- `briefs.json` : Briefs des 5 jours
- `attendance.json` : Présences
- `notes-cc.json` : Notes contrôle continu
- `partiel.json` : Évaluations soutenance
- etc.

Puis redéployez sur Vercel.

## Déploiement

\`\`\`bash
vercel deploy
\`\`\`

## Direction artistique

- **Palette** : Noir profond, doré champagne, ivoire
- **Style** : Cockpit premium, minimaliste, mobile-first
- **Temps de compréhension** : 10 secondes max pour naviguer
```

---

## 14. Décisions déjà prises

**Décisions importantes** :
1. ✅ Stack Next.js 15 + React + Tailwind — rapide, léger, déployable Vercel
2. ✅ Données JSON modifiables manuellement — pas de base de données complexe
3. ✅ Mot de passe admin simple (PPAIRH2026) — suffisant pour outil interne temporaire
4. ✅ Pas de système d'authentification multi-utilisateurs — seule la zone admin protégée
5. ✅ Design premium minimaliste — cockpit opérationnel, pas intranet
6. ✅ Mobile-first priorité absolue — enseignants consultent depuis téléphone
7. ✅ Données fictives de démonstration pour 21 groupes — prêtes à remplacer
8. ✅ **V2 : Direction artistique noir · doré · ivoire** — univers premium, cockpit de direction
9. ✅ **V2 : 7 nouveaux modules** — Brief, Assiduité revisitée, Notes CC, Partiel, Vue synthétique, Navigation, Favicon
10. ✅ **V2 : Dashboard assiduité avec alertes visuelles** — identifier rapidement les groupes à risque
11. ✅ **V2 : Grille partiel 6 critères /20** — saisie rapide pendant soutenances
12. ✅ **V2 : Lisibilité en 10 secondes** — principe directeur absolu

**Choix refusés** :
- ❌ Supabase / Firebase — trop lourd pour un outil temporaire
- ❌ Redux / Zustand — state management non justifié
- ❌ Material-UI — trop massif, slow
- ❌ Intégration Edusign en temps réel — import manuel suffisant
- ❌ Back-end custom — complexité inutile
- ❌ Authentification multi-utilisateurs — scope hors limites
- ❌ Autres couleurs que noir/doré/ivoire — charte imposée
- ❌ Animations complexes — vitesse de compréhension prioritaire

---

## 15. Questions ouvertes

**Questions à clarifier** :
- ⚠️ Les notes seront-elles saisies via un formulaire ou importées d'Excel/CSV ? (Hypothèse : JSON manuel pour MVP, formulaire web pour V2)
- ⚠️ Faut-il un historique des modifications des commentaires ? (Hypothèse : non, version simple)
- ⚠️ Les données seront-elles archivées après la semaine ? (Hypothèse : non, temporaire)

**Hypothèses raisonnables** :
- Les données de présence/notes seront mises à jour manuellement via édition JSON et redéploiement (ou saisie web pour V2)
- Les commentaires de suivi sont temporaires (pas d'archivage après séminaire)
- Le mot de passe admin est connu de tous les enseignants (confiance mutuelle)
- La semaine est bien 5 jours (lundi à vendredi, pas de dimanche)
- Stéphanie peut modifier les données JSON directement ou via une UI simple

---

## 16. Définition de terminé

**La tâche est terminée quand** :
- ✅ Le code est compilable sans erreur (`npm run dev` fonctionne)
- ✅ Les 8 sections principales sont fonctionnelles
- ✅ **Les 7 modules V2 sont implémentés** : Brief du jour, Dashboard Assiduité, Notes CC, Partiel, Vue synthétique, Navigation premium, Favicon
- ✅ L'interface est responsive mobile + desktop
- ✅ Le mot de passe admin fonctionne
- ✅ Tous les fichiers JSON de démo sont en place (21 groupes, 5 jours, évaluations)
- ✅ La direction artistique (noir · doré · ivoire) est cohérente partout
- ✅ Lisibilité testée : 10 secondes pour comprendre où agir
- ✅ Déploiement Vercel réussi (URL publique fonctionnelle)
- ✅ README.md complet avec instructions
- ✅ Code commenté et lisible
- ✅ Aucune dépendance inutile
- ✅ Performance acceptable (Lighthouse > 80)
- ✅ Zéro erreur console

**Livrables attendus** :
1. Repository GitHub / Vercel clone-ready
2. 8 fichiers JSON de démonstration (`/data/*`)
3. Code Next.js complet avec tous les composants V2
4. Navigation principale avec 7 onglets
5. README.md avec instructions de lancement + déploiement
6. URL Vercel publique prête pour la semaine du séminaire
7. Tous les 7 modules fonctionnels et testés

**Dernière vérification** :
- Tester sur mobile réel (pas juste DevTools)
- Tester toutes les recherches
- Tester le mot de passe admin
- Tester la saisie rapide des notes partiel
- Tester le calcul automatique du total /20
- Vérifier la vue synthétique partiel
- Vérifier le dashboard assiduité (alertes visuelles)
- Vérifier les performances (temps de chargement)
- Vérifier l'affichage sur l'application Vercel live
- Valider la direction artistique (noir/doré/ivoire cohérents)

---

## 17. Notes supplémentaires

**Principes pédagogiques** :
- L'outil ne doit pas être un logiciel RH lourd, mais un petit cockpit d'exploitation premium
- Les enseignants doivent se sentir libérés (accès rapide aux infos) pas chargés (pas de UI complexe)
- Simple > complet. Rapide > sophistiqué. Lisible > technique.
- Professionnalisme > familiarité : univers premium en permanence

**Univers visuel V2** :
- Noir profond : sophistication, focus, opérationnel
- Doré champagne : prestige, repères visuels, accents
- Ivoire : lisibilité, surface de travail, repos pour les yeux
- Typographie : sobre, élégante, contraste maximal
- Aucune ressemblance avec un intranet ou logiciel scolaire

**Environnement d'exécution** :
- Node.js 18+ (standard Vercel)
- npm 9+ ou pnpm
- Pas de dépendances systèmes complexes

**Prochaines itérations possibles** (hors scope MVP / V2) :
- Export/import des notes depuis Excel
- Intégration Edusign en temps réel
- Graphiques / analytics (taux présence, distribution notes)
- Archivage post-séminaire
- Multi-semaines
- Authentification par email (formations futures)
- Base de données légère (PostgreSQL + Supabase) si besoin long terme
