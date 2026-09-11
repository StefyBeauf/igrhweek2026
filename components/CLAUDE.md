# CLAUDE.md — Instructions du projet IGRH Week – Espace Formateurs

**Statut du projet** : V2 — Refonte UX/UI majeure + 7 nouveaux modules (en cours)  
**Dernière mise à jour** : [date à compléter]  
**Version du document** : 2.1

---

## 1. Résumé du projet

### Nom du projet
**IGRH Week – Espace Formateurs** (cockpit de pilotage pédagogique premium)

### Type de projet
- [x] Application web (Next.js + React)
- [x] Site web (responsive mobile + desktop)
- [x] Outil interne pédagogique (temporaire, 5 jours)

### Objectif principal

Créer et maintenir un **cockpit opérationnel premium** pour les ~20 enseignants du séminaire IGRH Week 2026 (5 jours). L'outil centralise les informations pédagogiques critiques :
- Briefs et consignes du jour
- Suivi des 21 groupes d'étudiants (compositions, spécialités)
- Présences/absences et assiduité
- Notes contrôle continu (FI, CACG, RH)
- Notes du partiel (soutenance vendredi)
- Commentaires de suivi pédagogique
- Planning des salles et documents utiles

**V2 spécifique** : refonte complète UX/UI (direction artistique premium noir · doré · ivoire) + 7 nouveaux modules pour améliorer lisibilité, hiérarchie visuelle et pilotage en temps réel.

### Résultat attendu

Un site web complet, responsive, déployable sur Vercel, utilisable immédiatement par les enseignants pendant la semaine du séminaire (lundi à vendredi). 

**Critères de délivrance** :
- Accessible en 2-3 clics max depuis desktop ET mobile
- Données modifiables via fichiers JSON simples (pas de BDD)
- Mot de passe admin simple pour zones sensibles
- Lisibilité 10 secondes max : comprendre où agir instantanément
- Direction artistique cohérente partout (noir profond · doré · ivoire)
- Performance acceptable (Lighthouse > 80)
- Zéro bugs pendant la semaine du séminaire

---

## 2. Contexte métier

### Pourquoi ce projet existe

Pendant le séminaire IGRH Week, les enseignants ont besoin d'accéder **rapidement et fiablement** à des informations critiques :
- Présences/absences immédiates
- Notes et commentaires de suivi
- Planning des salles et briefs du jour
- Grilles d'évaluation partiel

Un intranet papier est trop lent. Un email classique est fragmenté. Un logiciel lourd RH (Paie, ATS, LMS) est hors de question (coût, complexité, délai d'intégration).

**Solution** : un petit site web léger, pensé comme un **cockpit d'exploitation**, accessible partout, modifiable en secondes.

### Qui va utiliser le résultat

| Utilisateur | Contexte | Accès |
|---|---|---|
| ~20 enseignants intervenants | Pendant 5 jours (lun-ven) | Desktop (salle commune) + Mobile (en circulation, en classe) |
| Stéphanie (admin) | Gestion + mise à jour données | Desktop + JSON direct |
| Participants (étudiants) | Optionnel : consultation briefs | Mobile (lecture seule) |

### Niveau technique des utilisateurs finaux

- [x] **Enseignants** : intermédiaire à avancé (consultants RH, cadres, formateurs)
- [x] **Stéphanie (admin)** : très avancé (connaît le code et JSON)
- [ ] Étudiants : aucune compétence requise (lecture seule optionnelle)

**Implications UX** :
- Interface simple et intuitive — aucune formation technique requise
- Consultation rapide en secondes
- Saisie de données simples (notes, commentaires) sans friction
- Navigation « muscle memory » (mêmes positions, mêmes raccourcis)

### Ce qui compte le plus (par ordre de priorité)

- [x] **Fiabilité absolue** : zéro bugs pendant la semaine (déploiement stable avant lundi)
- [x] **Vitesse d'accès** : information trouvée en 10 secondes max
- [x] **Responsivité mobile** : enseignants consultant depuis le téléphone en circulation
- [x] **Design professionnel** : cockpit opérationnel, pas intranet scolaire ou logiciel lourd
- [x] **Lisibilité maximale** : contraste, hiérarchie, spacing
- [x] **Facilité de modification** : données JSON modifiables sans développeur
- [x] **Expérience premium** : univers luxe (noir · doré · ivoire), sensation de maîtrise

---

## 3. Périmètre du projet

### Ce que le projet doit faire

#### Vue générale et briefing
- Afficher un **brief du jour** (objectifs, consignes, points de vigilance, échéances)
- Lister les **21 groupes** avec composition (noms étudiants par spécialité : RH, Finance, CACG)
- Afficher les **commentaires de suivi pédagogique** organisés par jour et spécialité
- Centraliser les **documents utiles** (sujet, consignes, planning, grilles, supports)

#### Suivi opérationnel
- Afficher les **présences/absences/retards par groupe** avec dashboard d'alerte rapide
- **Dashboard assiduité** : identifier immédiatement les groupes à risque (seuil 80%)
- Afficher la **répartition des groupes dans les salles par jour**
- Ajouter et modifier les **commentaires de suivi pédagogique**

#### Évaluations
- Afficher les **notes CC (contrôle continu)** par spécialité (FI, CACG, RH) avec saisie possible
- Afficher et gérer les **notes du partiel** (soutenance vendredi) avec grille de critères (6 critères /20)
- **Vue synthétique** des résultats du partiel (total /20, classement par groupe)
- Permettre une **saisie rapide pendant les soutenances** (2-3 clics max)

#### Administration
- Protéger les zones sensibles (Admin, Notes, Partiel) avec mot de passe simple
- Permettre la modification des données JSON via édition manuelle
- Interface claire pour que Stéphanie puisse mettre à jour sans aide

### Ce que le projet ne doit pas faire (pour l'instant)

- [ ] Intégration Edusign en temps réel (import manuel via fichier JSON suffisant) ⚠️ À considérer pour V3
- [ ] Calcul automatique de moyennes complexes (MVP : sommes simples uniquement)
- [ ] Système de messagerie ou notifications push
- [ ] Gestion de comptes utilisateurs multiples (pas d'authentification)
- [ ] Interface d'édition temps réel pour les données (JSON manuel suffisant pour MVP)
- [ ] Rapports ou analyses sophistiquées
- [ ] Archivage automatique post-séminaire
- [ ] Export/import Excel massif (prochaine itération)
- [ ] Suivi du bien-être ou psychométrie des participants
- [ ] Synchronisation données Salesforce ou logiciel RH existant

### Version souhaitée

- [x] **V1** : MVP livré (prototype avec données fictives, navigation de base, pages principales)
- [x] **V2** : refonte UX/UI majeure + 7 nouveaux modules (en cours)
  - [ ] Direction artistique noir · doré · ivoire
  - [ ] Dashboard assiduité revisité
  - [ ] Grille partiel 6 critères
  - [ ] Saisie rapide notes CC et partiel
  - [ ] Navigation premium horizontale
  - [ ] Favicon et branding
  - [ ] Composants réutilisables premium
- [ ] **V3** (future) : Edusign, exports Excel, authentification multi-users, base données légère

### Priorité principale

**V2 fonctionnelle et déployée AVANT LE LUNDI de la semaine du séminaire.**

Hiérarchie de priorité :
1. Direction artistique (noir · doré · ivoire) en place partout
2. Dashboard assiduité avec alertes visuelles
3. Saisie rapide notes partiel (grille 6 critères)
4. Navigation premium horizontale
5. Responsive mobile parfait
6. Optimisations cosmétiques et micro-interactions

**Principe directeur** : préférer simple et livré à parfait et retardé.

---

## 4. Contraintes importantes

### Contraintes de temps

| Phase | Échéance | État |
|---|---|---|
| V1 (MVP) | [date livrée] | ✅ Livrée |
| V2 (refonte + modules) | **Vendredi avant le séminaire** | 🔄 En cours |
| Déploiement Vercel | Avant lundi | ⏳ Critique |
| Itérations mineure V2+ | Pendant la semaine (hotfixes seuls) | Gelé |

### Contraintes de budget

- **Budget zéro** : aucun coût autorisé
- Hébergement Vercel gratuit
- Stack open source (Next.js, React, Tailwind)
- Aucun service payant (CDN, monitoring, analytics)
- Police d'écriture : system fonts ou Geist (Vercel default)

### Contraintes techniques

#### ✅ Obligatoires
- Next.js 15 App Router
- React 19
- TypeScript strict (`tsconfig.json` : `"strict": true`)
- Tailwind CSS 4
- Vercel déploiement
- Données JSON dans `/data/*.json`
- Déploiement automatique via git push (Vercel GitHub integration)

#### ❌ Interdits
- Supabase, Firebase, PostgreSQL (trop lourd pour 5 jours)
- Redux, Zustand, Jotai, Recoil (state management complexe)
- Material-UI, AntDesign, Chakra UI (dépendances massives)
- Back-end custom, API routes complexes
- Authentification multi-utilisateurs (mot de passe simple suffisant)
- Framer Motion, animations GPU lourdes
- GraphQL
- Dépendances inutiles (moins de dépendances = plus de vitesse + maintenance facile)

### Contraintes de design

#### Direction artistique (NON NÉGOCIABLE)

| Élément | Valeur | Usage |
|---|---|---|
| Fond principal | Noir profond `#080808` ou `#0B0B0B` | Partout |
| Surfaces secondaires | Noir `#111111` ou `#151515` | Cartes, panneaux |
| Accent principal | Doré champagne `#C5A46D` | Séparateurs, onglets actifs, numéros, bordures |
| Texte principal | Ivoire `#F4F0E8` | Corps de texte, titres |
| Texte secondaire | Gris chaud `#A89968` ou champagne atténué | Subtitres, labels |
| Bordures | Très fines (`0.5px`-`1px`) doré ou gris chaud | Séparation légère |
| Ombres | Minimalistes, très subtiles | Élevation légère seulement si besoin |
| Hover | Ivoire + fond `#1A1A1A` | Boutons, lignes tableau |
| Focus | Doré subtil `0 0 0 2px #C5A46D` | Accessibilité |

#### Principes de design

- **Premium** : univers luxe contemporain, pas corporate lourd, pas design system SaaS générique
- **Épuré** : minimaliste mais pas vide — beaucoup d'espace blanc maîtrisé
- **Moderne** : lignes fines, alignements précis, grille rigoureuse (4px, 8px, 12px, 16px, 24px)
- **Mobile-first absolu** : enseignant sort son téléphone et trouve l'info en secondes
- **Typographie** : sans-serif lisible (Geist, Inter, system fonts) pour données; optionnel serif pour titres éditoriaux
- **Icônes** : Lucide (léger, simple, aucune « personnalité »)
- **Contraste maximal** : lisibilité immédiate, pas de dégradés ou superpositions visuelles
- **Pas d'effet « logiciel lourd »** : aucune ressemblance avec Material, Ant Design, Chakra
- **Navigation** : une seule ligne desktop, compacte mobile (ne pas empiler les onglets)
- **Tableaux** : pas d'énormes cartes non lisibles — préférer des grilles denses et compactes
- **Feedback utilisateur** : animations très légères, transitions `150ms`, pas de suspense
- **Une idée = 10 secondes** : max pour comprendre où agir

#### Antipatterns à éviter
- ❌ Gros blocs de couleur
- ❌ Dégradés ou shadowing lourd
- ❌ Cartes verticales empilées (trop d'espace perdu)
- ❌ Formulaires larges avec un champ par ligne
- ❌ Hamburger menu sur desktop
- ❌ Modales trop grandes ou modales imbriquées
- ❌ Toasts de confirmation pour chaque action
- ❌ Animations qui ralentissent
- ❌ Icônes trop allusives ou "entreprise"

### Contraintes d'usage

- Les données doivent pouvoir être modifiées en éditant les fichiers JSON (pas de CMS lourd)
- Modification JSON → git commit → Vercel deploy automatique (ou redéploiement manuel simple)
- Les enseignants ne doivent jamais toucher au code
- Stéphanie (admin) peut modifier les données sans aide technique
- Données doivent pouvoir être importées depuis fichier CSV/Excel (futur, pas MVP)

### Contraintes de sécurité et données

#### ✅ Accepté
- Mot de passe admin simple : `PPAIGRH2026` (suffisant pour outil interne temporaire)
- Hachage simple côté client (bcrypt léger ou équivalent)
- Données fictives de démonstration
- Session basée sur localStorage (pas de session back-end)
- HTTPS obligatoire sur Vercel (automatique)

#### ❌ Interdit
- Stockage de données personnelles réelles après la semaine
- Transmission d'emails ou SMS
- Clés API exposées en code
- Tokens d'authentification en clair dans les variables d'environnement
- Données sensibles réelles (SSN, numéros de compte)
- Historique de mot de passe
- Logs détaillés d'activité utilisateur

#### ⚠️ À surveiller
- Le mot de passe admin est connu de tous les enseignants (confiance mutuelle, outil interne)
- Pas d'obligation RGPD critique (données démo en l'état)
- Données archivées ou supprimées après la semaine
- Aucune donnée en base permanente post-séminaire

---

## 5. Outils, plateformes et technologies

### Outils / plateformes imposés

| Outil | Version | Rôle |
|---|---|---|
| Next.js | 15 App Router | Framework React |
| React | 19 | UI engine |
| TypeScript | 5.x strict | Type safety |
| Tailwind CSS | 4 | Styling |
| Vercel | Deploy | Hébergement + CI/CD |

### Outils / plateformes préférés

| Outil | Raison | Optionnel ? |
|---|---|---|
| Shadcn/ui | Composants simples et customisables | ✅ Oui (sinon Tailwind pur) |
| Lucide Icons | Léger, simple, aucune personnalité | ✅ Préféré si icônes requises |
| Geist Font | Police Vercel standard, lisible | ✅ Oui (system fonts acceptées) |
| Vercel Analytics | Monitoring léger (optionnel) | ✅ Oui (pas critique) |

### Outils / plateformes à éviter

| Outil | Raison |
|---|---|
| Supabase, Firebase | Trop lourd pour outil temporaire 5 jours |
| Redux, Zustand, Jotai | State management complexe non justifié (React Context suffit) |
| Material-UI, AntDesign, Chakra | Dépendances massives, slow, lourd |
| Framer Motion | Animations non critiques |
| GraphQL | REST JSON suffisant |
| Express, Fastify | Back-end inutile, JSON en local suffit |
| PostgreSQL, MongoDB | BDD hors scope |
| Prisma, Drizzle | ORM inutile |

### Décision si technologie inconnue

Si une technologie manque ou est inconnue :
1. Claude propose la **solution la plus simple** qui répond au besoin
2. Claude explique brièvement pourquoi cette solution est pertinente
3. Claude valide avec Stéphanie si le choix a un impact important

---

## 6. Structure du projet

### Arborescence de référence

```
/igrh-week-espace-formateurs
├── /app                           # Next.js App Router
│   ├── layout.tsx                 # Layout global + navigation premium
│   ├── page.tsx                   # Accueil (redirection rapide)
│   ├── /suivi-journalier
│   │   └── page.tsx               # Brief du jour (MODULE 1 — V2)
│   ├── /assiduité
│   │   └── page.tsx               # Dashboard assiduité + alertes (MODULE 2 — V2)
│   ├── /notes-cc
│   │   └── page.tsx               # Notes CC par spécialité (MODULE 3)
│   ├── /partiel
│   │   └── page.tsx               # Saisie + vue synthétique partiel (MODULE 4 + 5 — V2)
│   ├── /groupes
│   │   └── page.tsx               # Liste groupes + compositions
│   ├── /documents
│   │   └── page.tsx               # Docs utiles
│   ├── /salles
│   │   └── page.tsx               # Planning salles par jour
│   ├── /admin
│   │   └── page.tsx               # Zone protégée, gestion données
│   └── /api (optionnel)           # Pas d'API pour MVP (JSON local)
│
├── /components                    # Composants React réutilisables
│   ├── Navigation.tsx             # Menu premium horizontal
│   ├── Header.tsx                 # En-tête avec brief du jour
│   ├── TableRow.tsx               # Ligne tableau compacte (réutilisable)
│   ├── Badge.tsx                  # Badge status (OK, VIGILANCE, ALERTE)
│   ├── InputInline.tsx            # Saisie directe en ligne
│   ├── DaySelector.tsx            # Sélecteur jour (Lun-Ven)
│   ├── GroupCard.tsx              # Carte groupe compacte
│   ├── ModalAdmin.tsx             # Modal protection admin
│   └── [...autres composants]
│
├── /data                          # Données JSON modifiables
│   ├── groups.json                # 21 groupes (noms, spécialités, composition)
│   ├── briefs.json                # Briefs des 5 jours
│   ├── attendance.json            # Présences/absences par jour et groupe
│   ├── notes-cc.json              # Notes contrôle continu (FI, CACG, RH)
│   ├── partiel.json               # Notes et évaluations partiel
│   ├── comments.json              # Commentaires de suivi pédagogique
│   ├── rooms.json                 # Planning salles par jour
│   ├── documents.json             # Docs utiles (liens, descriptions)
│   └── config.json                # Config globale (password, etc.)
│
├── /styles                        # Global styles (optionnel)
│   └── globals.css                # Tailwind directives + CSS custom si besoin
│
├── /lib                           # Utilitaires
│   ├── utils.ts                   # Fonctions helper (formatage, calcul, etc.)
│   ├── auth.ts                    # Vérification mot de passe
│   └── [...autres utilitaires]
│
├── /public                        # Assets statiques
│   ├── favicon.ico                # Favicon (branding V2)
│   ├── logo.svg                   # Logo SJ Conseil optionnel
│   └── [...autres assets]
│
├── next.config.ts                 # Config Next.js
├── tailwind.config.ts             # Config Tailwind (palette premium)
├── tsconfig.json                  # TypeScript config (strict: true)
├── package.json                   # Dependencies (minimal)
├── README.md                       # Instructions lancement + déploiement
├── .env.local (GIT IGNORED)       # Env local (optionnel, pas en production)
├── .gitignore
├── .github/workflows/deploy.yml   # CI/CD Vercel (automatique)
└── CLAUDE.md                       # Ce fichier

```

### Fichiers importants à ne pas modifier sans validation

- `tailwind.config.ts` — palette et design system (modifier uniquement avec validation)
- `next.config.ts` — configuration build
- `/app/layout.tsx` — layout global et navigation principale
- `/data/config.json` — configuration globale (password hash, etc.)

### Fichiers ou dossiers à ignorer

- `/node_modules/` — dépendances (jamais commiter)
- `/.next/` — build cache (jamais commiter)
- `.env.local` — variables d'environnement locales (jamais commiter)
- `/dist/` `/build/` — résultats build (jamais commiter)

### Comment Claude doit explorer le projet

Si la structure est inconnue :
1. Commencer par `/app` et comprendre les routes
2. Consulter `/components` pour les composants réutilisables
3. Consulter `/data` pour la structure des données
4. Lire `README.md` et ce fichier `CLAUDE.md`
5. Résumer la structure simple avant modif importante
6. Demander validation si structure modifie

---

## 7. Données, fichiers et contenus

### Sources utilisées

- [x] Fichiers JSON locaux (`/data/*.json`)
- [ ] CSV (à prévoir pour imports futurs)
- [ ] Excel (à prévoir pour exports futurs)
- [ ] Google Sheets (optionnel pour gestion collaborative)
- [ ] Notion (optionnel)
- [ ] API Edusign (futur, import manuel pour MVP)

### Emplacement des données

Tous les fichiers de données se trouvent dans `/data/` à la racine du projet.

Chaque fichier JSON est modifiable directement sans développeur.

### Format d'entrée

| Source | Format | Exemple |
|---|---|---|
| Groupes | JSON array d'objets | `[{"id": "G01", "name": "Groupe 1", "specialty": ["RH", "Finance"], "students": [...]}]` |
| Briefs | JSON object par jour | `{"monday": "Objectif du jour: ...", "tuesday": ...}` |
| Présences | JSON array de records | `[{"groupId": "G01", "date": "2026-01-20", "present": 5, "absent": 1, "late": 0}]` |
| Notes CC | JSON structure par spécialité | `{"FI": {"G01": 18, "G02": 16}, "CACG": {...}, "RH": {...}}` |
| Partiel | JSON avec grille critères | `[{"groupId": "G01", "criteria": [4, 3, 3.5, 3, 3.5, 2.5], "total": 19.5}]` |

### Format de sortie attendu

| Vue | Format | Média |
|---|---|---|
| Consommation données | React components affichent JSON | Browser |
| Export pour l'admin | JSON simple modifiable | Fichier texte |
| Export pour rapports | JSON + CSV (futur V3) | Fichier export |
| Affichage enseignants | HTML responsive | Desktop + Mobile |

### Règles de traitement

- Les données JSON sont la **source unique de vérité**
- Aucune donnée importante ne doit être stockée en `localStorage` uniquement (synchroniser avec JSON)
- Les commentaires de suivi sont temporaires (pas d'archivage post-séminaire)
- Les notes seront saisies via formulaire web (V2) et sauvegardées dans JSON
- Calcul du total partiel : somme des 6 critères
- Seuil assiduité « à risque » : moins de 80% de présence (alerter)
- Les absences/retards sont modifiables par jour et groupe

### Données sensibles

- **Données personnelles réelles** : aucune (données fictives démo seulement)
- **Mot de passe admin** : hachage simple côté client (pas en clair)
- **Numéros d'identité / emails réels** : à anonymiser si données réelles utilisées

### Exemple structure JSON (groupes)

```json
[
  {
    "id": "G01",
    "name": "Groupe 1",
    "specialties": ["RH", "Finance"],
    "students": [
      {"name": "Alice Dupont", "specialty": "RH"},
      {"name": "Bob Martin", "specialty": "Finance"},
      ...
    ],
    "notes": {
      "cc": {"FI": 18, "CACG": 17, "RH": 19},
      "partiel": 19.5
    }
  },
  ...
]
```

---

## 8. Commandes utiles

### Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur dev (http://localhost:3000)
npm run dev

# Build production
npm run build

# Démarrer la version de production en local
npm run start

# Vérifier les erreurs TypeScript
npm run type-check

# Formater le code (si prettier installé)
npm run format

# Linter (si eslint installé)
npm run lint
```

### Déploiement Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer en preview (branche de travail)
vercel deploy --presets next

# Déployer en production (git push à main, Vercel déploie automatique)
git push origin main
```

### Vérification qualité

```bash
# TypeScript
npm run type-check

# Performance Lighthouse (via DevTools Chrome)
# F12 → Lighthouse → Generate report
```

### Tester les données

```bash
# Éditer /data/groups.json
nano data/groups.json

# Redémarrer le serveur (hot reload automatique)
# Verifier http://localhost:3000
```

---

## 9. Site web / Application — Objectif et UX

### Objectif de l'interface

L'interface doit permettre aux enseignants de :
1. **Consulter rapidement** les infos du jour (brief, planning, profs, salles)
2. **Piloter l'assiduité** en temps réel (identifier les absences/retards immédiatement)
3. **Saisir et consulter** les notes (CC et partiel) sans friction
4. **Ajouter des commentaires** de suivi pédagogique compacts
5. **Accéder à la doc utile** (sujets, grilles, supports)

### Pages ou écrans nécessaires

| Écran | Rôle | Priorité | État V2 |
|---|---|---|---|
| Accueil | Redirection rapide vers brief du jour | P0 | ✅ |
| Brief du jour | Info critique du jour + contexte | P0 | 🔄 |
| Groupes | Liste 21 groupes + compositions | P1 | ✅ |
| Assiduité | Dashboard alertes présences | P0 | 🔄 |
| Notes CC | Saisie et consultation notes contrôle continu | P1 | 🔄 |
| Partiel | Saisie grille partiel (6 critères) + synthèse | P0 | 🔄 |
| Commentaires | Ajouter/consulter suivi pédagogique | P2 | ✅ |
| Salles | Planning répartition par jour | P2 | ✅ |
| Documents | Liens et fichiers utiles | P2 | ✅ |
| Admin | Gestion données (zone protégée) | P1 | ✅ |

### Contenus importants

| Élément | Contenu | Affichage |
|---|---|---|
| **Titre principal** | IGRH Week – Espace Formateurs | Header permanent |
| **Promesse** | Cockpit opérationnel pour 5 jours | Sous-titre accueil |
| **CTA principal** | "Voir le brief du jour" | Bouton accueil |
| **Jour courant** | Lundi / Mardi / ... / Vendredi | Sélecteur permanent |
| **Sections obligatoires** | Brief, Groupes, Assiduité, Notes, Partiel, Admin | Navigation |
| **Éléments de réassurance** | "Sauvegarde automatique", "Données en JSON" | Pied de page admin |

### Style visuel souhaité

| Dimension | Cible |
|---|---|
| Univers | Cockpit de direction premium, luxe contemporain |
| Ambiance | Sophistication, maîtrise, opérationnel, professionnel |
| Palette | Noir profond · doré champagne · ivoire |
| Typographie | Sans-serif lisible (Geist), optionnel serif pour titres |
| Icônes | Lucide (simple, aucune "personnalité") |
| Animations | Très légères, transitions `150ms` |
| Espaces | Beaucoup de blanc maîtrisé |
| Densité | Compacte mais lisible (pas de gaspillage d'espace) |
| Mobile | Responsive intelligent, scroll horizontal si besoin |

### Références et inspirations

| Référence | Raison | Lien |
|---|---|---|
| Apple Intelligence dashboard | Design premium, données denses | icloud.com |
| Vercel Dashboard | Noir profond, accent, lisibilité | vercel.com/dashboard |
| Bloomberg Terminal (concept) | Cockpit opérationnel, densité info | - |
| Notion dark mode | Contraste maximal, données structurées | notion.so |

### Règles UX (non négociables)

- ✅ L'interface doit être claire pour un utilisateur non technique (mais cadre/formateur)
- ✅ Les actions principales (voir brief, consulter notes) doivent être visibles immédiatement
- ✅ Les textes doivent être simples, orientés action, pas jargon technique
- ✅ Éviter les interfaces trop complexes si une version simple suffit
- ✅ Lisibilité 10 secondes max : comprendre où agir sans réfléchir
- ✅ Navigation « muscle memory » : mêmes positions, mêmes couleurs partout
- ✅ Feedback utilisateur : sauvegardes silencieuses, pas de pop-ups intrusive
- ✅ Pas de modales imbriquées ou fenêtres qui bloquent
- ✅ Mobile-first : si ça marche sur téléphone, ça marche partout

---

## 10. Règles de travail pour Claude dans ce projet

### Avant de modifier

1. **Comprendre l'objectif** : pourquoi cette tâche ? Quel problème résout-elle ?
2. **Identifier les fichiers concernés** : quelles routes, composants, données sont impliqués ?
3. **Expliquer brièvement le plan d'action** si la modification est importante (plus de 50 lignes ou modification structurelle)
4. **Demander validation** avant toute action risquée ou difficile à annuler
5. **Vérifier la direction artistique** : est-ce cohérent avec noir · doré · ivoire ?

### Pendant la modification

- ✅ Privilégier la **solution la plus simple** qui répond au besoin
- ✅ Éviter la **sur-ingénierie** (abstraction inutile, patterns trop complexes)
- ✅ **Ne pas ajouter de dépendances inutiles** (chaque dépendance = coût maintenance)
- ✅ **Ne pas modifier** les fichiers sans rapport avec la tâche
- ✅ **Garder le projet compréhensible** pour une personne non développeuse
- ✅ **Commenter les sections complexes** (algorithme, logique métier)
- ✅ TypeScript strict — **pas de `any`**, types explicites
- ✅ **Code lisible > code compact** (priorité à la clarté)
- ✅ **Tester en local** avant de valider

### Après la modification

1. **Résumer ce qui a été changé** (liste des fichiers + raison)
2. **Indiquer comment vérifier** que tout fonctionne (tester sur mobile, vérifier Lighthouse)
3. **Signaler les limites, risques ou points à améliorer** (si pas parfait, être transparent)
4. **Proposer une prochaine étape claire** (qu'est-ce qui vient après ?)
5. **Vérifier zéro erreurs console** (F12 → Console)

---

## 11. Tests et vérification

### Méthode de vérification attendue

La tâche est testée avec succès si :
- [ ] L'application se lance sans erreur (`npm run dev` fonctionne)
- [ ] Aucune erreur TypeScript (`npm run type-check` passe)
- [ ] Aucune erreur console (F12 → Console = vide)
- [ ] Responsive desktop (1920×1080) et mobile (375×667)
- [ ] Performances acceptables (Lighthouse > 80)
- [ ] Direction artistique cohérente (noir · doré · ivoire appliqués)
- [ ] Lisibilité 10 secondes : comprendre où cliquer immédiatement
- [ ] Données JSON chargent correctement
- [ ] Mot de passe admin fonctionne (accès Admin + logout)

### Données ou scénario de test

| Scénario | Étapes | Résultat attendu |
|---|---|---|
| **Consultation accueil** | 1. Ouvrir localhost:3000 2. Vérifier brief du jour | Brief visible en 3 secondes |
| **Navigation** | 1. Cliquer sur "Assiduité" 2. Vérifier liste groupes | 21 groupes listés, alertes visibles |
| **Saisie notes CC** | 1. Aller Notes CC 2. Saisir note G01/FI 3. Quitter | Note sauvegardée, pas de freeze |
| **Mot de passe admin** | 1. Aller Admin 2. Saisir PPAIGRH2026 3. Accéder données | Accès accordé, possibilité modifier |
| **Mobile** | 1. F12 → Device toolbar (iPhone 12) 2. Naviguer partout | Responsive OK, pas de débordement |
| **Performance** | 1. DevTools → Lighthouse 2. Générer rapport | Score > 80 (Performance + Accessibility) |

### Critères de réussite

- ✅ Le code est compilable sans erreur (`npm run dev` lance)
- ✅ Les 8 sections principales sont fonctionnelles
- ✅ **Les 7 modules V2 sont implémentés** :
  1. Brief du jour (affichage + saisie)
  2. Dashboard assiduité avec alertes
  3. Saisie rapide notes CC
  4. Grille partiel 6 critères
  5. Vue synthétique résultats partiel
  6. Navigation premium horizontale
  7. Favicon + branding SJ Conseil
- ✅ L'interface est responsive mobile + desktop
- ✅ Mot de passe admin fonctionne (`PPAIGRH2026`)
- ✅ Tous les fichiers JSON de démo en place (21 groupes, 5 jours, notes, évaluations)
- ✅ Direction artistique (noir · doré · ivoire) cohérente partout
- ✅ Lisibilité testée : 10 secondes pour comprendre où agir
- ✅ Déploiement Vercel réussi (URL publique fonctionnelle)
- ✅ README.md complet (instructions + déploiement)
- ✅ Code commenté et lisible (conventions TypeScript respectées)
- ✅ Aucune dépendance inutile (auditer avec `npm ls`)
- ✅ Lighthouse : Performance > 80, Accessibility > 90, Best Practices > 90
- ✅ Zéro erreur console (F12 → Console)
- ✅ Zéro warnings TypeScript (`npm run type-check`)

---

## 12. Sécurité et points de vigilance

### Claude doit faire attention à

#### ❌ Sévère
- Ne jamais exposer de clés API, tokens, mots de passe en clair dans le code
- Ne pas utiliser le mot de passe dans les variables d'environnement non-chiffrées
- Ne pas supprimer de fichiers JSON sans demander d'abord
- Ne pas écraser un fichier de données important sans validation
- Ne pas modifier la charte visuelle sans validation explicite
- Ne pas ajouter de dépendances massives (Material-UI, Redux, etc.)
- Ne pas créer de back-end complexe ou BDD

#### ⚠️ À surveiller
- Le mot de passe admin est stocké côté client (hachage simple acceptable pour outil interne temporaire)
- Aucune donnée sensible réelle ne doit être stockée post-séminaire
- Les commentaires de suivi pédagogique sont temporaires (pas d'archivage)
- Vercel logs sont minimaux (pas de données sensibles loggées)

#### ✅ Recommended
- Commenter les sections de sécurité (auth, validation)
- Vérifier les dépendances avec `npm audit` avant deploy
- Tester le mot de passe admin avant commit
- Auditer les performances avec Lighthouse régulièrement

### Informations sensibles à ne jamais inclure

- [ ] Clés API (aucune API n'est requise)
- [ ] Tokens GitHub, Vercel, ou d'authentification
- [ ] Mots de passe réels (seulement `PPAIGRH2026` pour la démo, hachée)
- [ ] Données personnelles réelles (SSN, numéros de compte, emails)
- [ ] Numéros de téléphone réels
- [ ] Secrets ou variables d'environnement en `.env` (jamais commiter)

---

## 13. Documentation attendue

### Documentation utile

- [ ] **Instructions de lancement** : `npm install`, `npm run dev`, accès localhost:3000
- [ ] **Comment modifier les données** : éditer fichiers `/data/*.json`, redéployer
- [ ] **Comment ajouter un groupe** : exemple complet dans README
- [ ] **Comment ajouter un document** : exemple structure JSON
- [ ] **Comment déployer sur Vercel** : `vercel deploy` ou git push
- [ ] **Structure simple du projet** : arborescence + rôle dossiers
- [ ] **Direction artistique appliquée** : palette couleurs, typographie
- [ ] **Limites connues** : ce qu'on peut/ne peut pas faire (importation Edusign, rapports SQL, etc.)
- [ ] **Description des 7 modules V2** : à quoi servent-ils, comment les utiliser
- [ ] **Troubleshooting** : erreurs courantes et solutions
- [ ] **Prochaines étapes** : V3, améliorations envisagées

### Emplacement souhaité

- [ ] **README.md** : instructions lancement, structure, déploiement, démarrage rapide
- [ ] **CLAUDE.md** : ce fichier (référence complète pour Claude)
- [ ] **Commentaires dans le code** : sections complexes, choix de design, patterns
- [ ] **Wiki ou page dédiée** : optionnel (futur si doc trop longue)

### Exemple README minimal V2

Voir section "Exemple README minimal" du CLAUDE.md v1 (section 13).

À adapter avec :
- [ ] Description V2 (refonte UX/UI + 7 modules)
- [ ] Screenshots (brief, assiduité, notes, partiel)
- [ ] GIF de navigation mobile
- [ ] Architecture de la palette (noir · doré · ivoire)

---

## 14. Décisions déjà prises

### Décisions importantes

| # | Décision | Raison | Validé |
|---|---|---|---|
| 1 | Stack Next.js 15 + React 19 + TypeScript + Tailwind | Rapide, léger, déployable Vercel en secondes | ✅ |
| 2 | Données JSON modifiables manuellement | Pas de BDD complexe = maintenance simple pour Stéphanie | ✅ |
| 3 | Mot de passe admin simple (`PPAIGRH2026`) | Suffisant pour outil interne temporaire 5 jours | ✅ |
| 4 | Pas d'authentification multi-utilisateurs | Scope hors limites, confiance mutuelle suffisante | ✅ |
| 5 | Design premium minimaliste (noir · doré · ivoire) | Cockpit opérationnel, pas intranet | ✅ |
| 6 | Mobile-first priorité absolue | Enseignants consultent depuis téléphone en circulation | ✅ |
| 7 | Données fictives de démonstration (21 groupes) | Prêtes à remplacer, permet test sans données réelles | ✅ |
| 8 | **V2 : Direction artistique noir · doré · ivoire** | Univers premium, cockpit de direction | ✅ |
| 9 | **V2 : 7 nouveaux modules** | Brief, Assiduité, Notes CC, Partiel, Vue synthétique, Navigation, Favicon | ✅ |
| 10 | **V2 : Dashboard assiduité avec alertes visuelles** | Identifier rapidement groupes à risque (< 80% présence) | ✅ |
| 11 | **V2 : Grille partiel 6 critères /20** | Saisie rapide pendant soutenances (2-3 clics) | ✅ |
| 12 | **V2 : Lisibilité en 10 secondes max** | Principe directeur absolu (comprendre où agir instantanément) | ✅ |

### Choix refusés

| Choix | Raison | Rejeté |
|---|---|---|
| Supabase / Firebase | Trop lourd pour outil temporaire 5 jours | ✅ |
| Redux / Zustand / Jotai | State management complexe non justifié (React Context suffit) | ✅ |
| Material-UI / AntDesign / Chakra | Dépendances massives, slow, lourd, pas premium | ✅ |
| Intégration Edusign temps réel | Import manuel JSON suffisant (V3 future) | ✅ |
| Back-end custom / Express | Complexité inutile, JSON local suffit | ✅ |
| Authentification multi-utilisateurs | Scope hors limites (5 jours, confiance mutuelle) | ✅ |
| Autres couleurs que noir/doré/ivoire | Charte imposée, univers premium non-négociable | ✅ |
| Animations complexes (Framer Motion) | Vitesse de compréhension = priorité > animations | ✅ |
| Graphiques / analytics | Non critiques pour MVP (données brutes suffisent) | ✅ |
| Export Excel automatique | Prochaine itération (V3), import manuel OK pour MVP | ✅ |

---

## 15. Questions ouvertes

### Questions à clarifier

| # | Question | Impact | Hypothèse actuelle |
|---|---|---|---|
| 1 | Les notes seront-elles saisies via formulaire web ou importées Excel/CSV ? | Medium | Formulaire web V2, import CSV V3 futur |
| 2 | Faut-il un historique des modifications (qui a changé quoi, quand) ? | Low | Non, version simple (timestamp sauvegardes seulement) |
| 3 | Les données seront-elles archivées après la semaine ? | Low | Non, supprimées ou stockée localement post-séminaire |
| 4 | Stéphanie peut-elle modifier les données JSON directement ou via UI ? | Medium | JSON direct préféré (simple), UI admin optionnelle V3 |
| 5 | Y a-t-il des étudiants mineurs dont il faut protéger les données ? | High | Non mentionné, données fictives en l'état |
| 6 | Faut-il calculer des statistiques (moyenne par groupe, taux présence, etc.) ? | Low | Non, MVP affiche données brutes seulement |
| 7 | Peut-on utiliser Edusign pour import automatique des présences ? | High | Non pour MVP (import manuel V3), API Edusign à vérifier |

### Hypothèses raisonnables

Si la réponse n'est pas disponible, Claude fait **une hypothèse raisonnable** et l'indique explicitement :

- Les données de présence/notes seront mises à jour manuellement via édition JSON + git commit (ou formulaire web V2)
- Les commentaires de suivi sont temporaires : pas d'historique, pas d'archivage
- Le mot de passe admin est connu de tous les enseignants (confiance mutuelle, outil interne)
- La semaine est bien 5 jours (lundi à vendredi, pas de dimanche)
- Stéphanie peut modifier les données JSON directement sans aide développeur
- Les données réelles (noms étudiants, etc.) seront remplacées avant le séminaire (utiliser démo fictive jusque-là)
- Pas de transmission de données à des tiers après le séminaire

---

## 16. Définition de terminé (Definition of Done)

### La tâche est terminée quand

#### Code et fonctionnalité

- ✅ `npm run dev` lance sans erreur
- ✅ `npm run type-check` passe (zéro warnings TypeScript)
- ✅ Zéro erreur console (F12 → Console = vide)
- ✅ Les **8 sections principales** sont fonctionnelles :
  1. Accueil (redirection)
  2. Brief du jour
  3. Groupes (liste + compositions)
  4. Assiduité (dashboard + alertes)
  5. Notes CC (saisie + consultation)
  6. Partiel (grille + synthèse)
  7. Commentaires (suivi pédagogique)
  8. Admin (zone protégée)
- ✅ **Les 7 modules V2** sont implémentés et testés
- ✅ Mot de passe admin fonctionne (`PPAIGRH2026`)
- ✅ Tous les fichiers JSON de démo en place (21 groupes, 5 jours, etc.)

#### Design et UX

- ✅ Direction artistique (noir · doré · ivoire) cohérente partout
- ✅ Lisibilité testée : 10 secondes pour comprendre où agir
- ✅ Responsive mobile (375×667) + desktop (1920×1080)
- ✅ Pas de débordement horizontal sur mobile
- ✅ Contraste maximal (WCAG AA+)
- ✅ Navigation claire et « muscle memory »
- ✅ Saisie rapide notes/partiel (2-3 clics max)

#### Performance et qualité

- ✅ Lighthouse : Performance > 80, Accessibility > 90, Best Practices > 90
- ✅ Temps de chargement initial < 3 secondes
- ✅ Aucune dépendance inutile (`npm ls` audit)
- ✅ Code commenté (sections complexes)
- ✅ Conventions TypeScript respectées (strict mode)

#### Déploiement et documentation

- ✅ Déploiement Vercel réussi (URL publique fonctionnelle)
- ✅ README.md complet :
  - Instructions lancement (`npm install`, `npm run dev`)
  - Modifier les données (JSON)
  - Ajouter un groupe (exemple)
  - Déployer (`vercel deploy` ou git push)
  - Structure du projet
  - Direction artistique V2
- ✅ Ce fichier CLAUDE.md à jour
- ✅ Pas de secrets exposés en clair
- ✅ `.gitignore` complet (node_modules, .next, .env.local)

### Livrables attendus

1. ✅ Repository GitHub clone-ready
2. ✅ 8 fichiers JSON de démonstration complets (`/data/*`)
3. ✅ Code Next.js complet avec tous les composants V2
4. ✅ Navigation principale avec 8 onglets + logo favicon
5. ✅ README.md avec instructions détaillées
6. ✅ URL Vercel publique prête pour le lundi du séminaire
7. ✅ Tous les 7 modules V2 fonctionnels et testés
8. ✅ Documentation des données (format JSON pour chaque fichier)

### Dernière vérification (avant livraison)

- [ ] Tester sur mobile réel (iPhone 12 ou Android, pas juste DevTools)
- [ ] Tester toutes les navigations (cliquer sur tous les onglets)
- [ ] Tester le mot de passe admin (accès correct, logout fonctionne)
- [ ] Tester la saisie rapide notes partiel (grille 6 critères, calcul /20 automatique)
- [ ] Vérifier le calcul total partiel (6 critères → /20)
- [ ] Vérifier la vue synthétique partiel (classement groupes, résultats visibles)
- [ ] Vérifier le dashboard assiduité (alertes visuelles < 80% présence)
- [ ] Vérifier les performances (F12 → Lighthouse, score > 80)
- [ ] Vérifier l'affichage sur l'app Vercel live (URL publique)
- [ ] Valider la direction artistique (noir/doré/ivoire cohérents partout)
- [ ] S'assurer que README.md est clair et complet
- [ ] Vérifier qu'aucune donnée sensible n'est loggée

---

## 17. Notes supplémentaires

### Principes pédagogiques

- L'outil ne doit pas être un logiciel RH lourd, mais un **petit cockpit d'exploitation premium**
- Les enseignants doivent se sentir **libérés** (accès rapide aux infos) pas chargés (pas d'UI complexe)
- **Simple > complet. Rapide > sophistiqué. Lisible > technique.**
- **Professionnalisme > familiarité** : univers premium en permanence (pas de "hey" ou emoji)

### Univers visuel V2 (cohérence absolue)

| Dimension | Approche |
|---|---|
| **Noir profond** | Sophistication, focus, environnement opérationnel (espace de travail) |
| **Doré champagne** | Prestige, repères visuels, accents (highlights, séparateurs) |
| **Ivoire** | Lisibilité maximale, surface de travail, repos pour les yeux |
| **Typographie** | Sobre, élégante, contraste maximal (pas de dégradés ou superpositions) |
| **Aucune ressemblance** | Intranet scolaire, logiciel administratif, dashboard SaaS générique |
| **Sensation** | "C'est un cockpit de pilotage exclusif, noir, précis et élégant" |

### Environnement d'exécution

- Node.js 18+ (standard Vercel)
- npm 9+ ou pnpm
- Pas de dépendances systèmes complexes (tout ce qu'il faut en Node)
- Vercel = infrastructure automatique (HTTPS, CDN, auto-scaling)

### Prochaines itérations possibles (V3+, hors scope MVP/V2)

- [ ] **Export/import Excel/CSV** des notes et présences
- [ ] **Intégration Edusign temps réel** (API REST, import automatique présences)
- [ ] **Graphiques et analytics** (taux présence par groupe, distribution notes, tendances)
- [ ] **Archivage post-séminaire** (télécharger les données en JSON/ZIP)
- [ ] **Multi-semaines** (gérer plusieurs sessions IGRH Year)
- [ ] **Authentification par email** (pour formations futures, plusieurs administrateurs)
- [ ] **Base de données légère** (PostgreSQL + Supabase) si besoin long terme
- [ ] **Notifications email** (briefs du jour, alertes assiduité)
- [ ] **Commentaires en temps réel** avec Supabase Realtime
- [ ] **Mobile app native** (React Native, si usage critiques quotidien)

### Maintenance et support

- Stéphanie (admin) peut modifier les données sans aide (JSON simple + git push ou redeploy Vercel)
- Claude Code peut être sollicité pour bugs ou améliorations rapides
- Après le séminaire : données archivées ou supprimées (pas de stockage long terme)
- Pour future séminaire : dupliquer le repo, remplacer données JSON, redéployer

---

## Version Journal

| Version | Date | Changements |
|---|---|---|
| 1.0 | [date] | CLAUDE.md initial (project-ccode v1) |
| 2.0 | [date] | V2 : refonte UX/UI + 7 modules |
| 2.1 | [maintenant] | Alignement sur template complet + enrichissement sections |

---

**Dernière révision** : [à compléter avec date]  
**Prochaine révision** : Après livraison V2 (intégration feedback séminaire)

