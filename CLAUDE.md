# CLAUDE.md — Instructions du projet IGRH Week – Espace Formateurs

## 1. Résumé du projet

**Nom du projet** : IGRH Week – Espace Formateurs

**Type de projet** :
- [x] Application web
- [x] Site web
- [ ] Automatisation Make / n8n
- [x] Outil interne

**Objectif principal** :
Créer un petit cockpit opérationnel pour les enseignants pendant le séminaire IGRH Week 2026 (5 jours). L'outil centralise les informations pédagogiques (briefs, groupes, suivi, présences, notes, documents, salles) et les rend accessibles en 2-3 clics maximum depuis desktop et mobile.

**Résultat attendu** :
Un site web complet, responsive, déployable sur Vercel, utilisable immédiatement par ~20 enseignants pendant la semaine du séminaire. Les données sont modifiables via des fichiers JSON simples ; pas de base de données ni d'authentification complexe.

---

## 2. Contexte métier

**Pourquoi ce projet existe** :
Pendant le séminaire IGRH Week, les enseignants ont besoin d'accéder rapidement à des informations critiques (présences, notes, commentaires de suivi, planning des salles, briefs du jour). Un intranet papier ou un email classique sont trop lents. Un logiciel lourd est hors de question. Solution : un petit site léger, rapide et pensé comme un cockpit d'exploitation.

**Qui va utiliser le résultat** :
- Les ~20 enseignants intervenants (consultants RH, formateurs)
- Pendant 5 jours consécutifs (lundi à vendredi)
- Accès via ordinateur (salle commune) ET téléphone (en circulation)

**Niveau technique des utilisateurs finaux** :
- [x] Intermédiaire (consultants, formateurs, RH)
- Non technique requis pour le quotidien, juste de la consultation

**Ce qui compte le plus** :
- [x] Rapidité de mise en place
- [x] Facilité d'usage (mobile en priorité)
- [x] Design professionnel et premium
- [x] Fiabilité (pas de bugs en semaine du séminaire)
- [x] Facilité de maintenance (modification des données simples)

---

## 3. Périmètre du projet

**Ce que le projet doit faire** :
- Afficher le brief du jour, objectifs, livrables, intervenants, salles, alertes
- Lister les 21 groupes avec composition (noms des étudiants par spécialité : RH, Finance, CACG)
- Afficher les commentaires de suivi pédagogique organisés par jour et spécialité
- Permettre d'ajouter simplement un commentaire de suivi
- Afficher les présences/absences/retards par groupe
- Afficher les notes (contrôle continu + partiel)
- Centraliser les documents utiles (sujet, consignes, planning, grilles, supports, etc.)
- Afficher la répartition des groupes dans les salles par jour
- Protéger les zones sensibles (admin) avec un mot de passe simple

**Ce que le projet ne doit pas faire pour l'instant** :
- Intégration directe avec Edusign (import manuel via fichier)
- Calcul automatique de moyennes ou statistiques complexes
- Système de messagerie ou notifications
- Gestion des comptes utilisateurs
- Interface d'édition temps réel pour les données (JSON uniquement)
- Rapports ou analyses sophistiquées
- Archivage des données après la semaine

**Version souhaitée** :
- [x] MVP simple mais utilisable
- [x] Version propre et présentable
- [x] Prototype rapide avec données fictives

**Priorité principale** :
Version fonctionnelle et déployée **avant le lundi de la semaine du séminaire**. Préférer simple et livré à parfait et retardé.

---

## 4. Contraintes importantes

**Contraintes de temps** :
Semaine 1 : version complète déployée sur Vercel. Pas de délai pour itération majeure après le lundi.

**Contraintes de budget** :
Zéro coût (hébergement Vercel gratuit, stack open source, aucun service payant).

**Contraintes techniques** :
- ✅ Next.js 15 App Router + React + Tailwind CSS obligatoires
- ✅ Données dans `/data/*.json` modifiables manuellement
- ✅ Déploiement Vercel sans processus complexe
- ❌ Pas de Supabase, Firebase, base SQL
- ❌ Pas de système d'authentification lourd (simple mot de passe suffisant)
- ❌ Pas de dépendances lourdes (Material-UI, AntDesign)
- ❌ Pas de back-end complexe

**Contraintes de design** :
- Premium, épuré, moderne, minimaliste
- Cartes, badges, typographie élégante, icônes simples
- Pas d'effet « intranet scolaire »
- Pas de tableaux énormes
- Navigation latérale desktop, compacte mobile
- **Mobile-first absolu** : un enseignant sort son téléphone et trouve son info en secondes

**Contraintes d'usage** :
- Les données doivent pouvoir être modifiées en éditant les fichiers JSON
- Modification JSON → git commit → vercel deploy automatique (ou redéploiement manuel simple)
- Pas besoin de UI d'édition temps réel pour les données
- Les enseignants ne doivent pas toucher au code

**Contraintes de sécurité / données** :
- ❌ Pas de stockage de données personnelles réelles après le séminaire
- ❌ Pas de transmission d'emails ou SMS
- ✅ Mot de passe admin simple (PPAIRH2026) — suffisant pour outil interne temporaire
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
│   ├── layout.tsx           # Layout global + navigation
│   ├── page.tsx             # Page d'accueil (redirection ou accès rapide)
│   ├── /aujourd-hui
│   │   └── page.tsx         # Brief du jour
│   ├── /groupes
│   │   └── page.tsx         # Liste groupes + recherche + fiches détaillées
│   ├── /suivi
│   │   └── page.tsx         # Commentaires de suivi par groupe/jour/spécialité
│   ├── /presences
│   │   └── page.tsx         # Présents/absents/retards
│   ├── /notes
│   │   └── page.tsx         # Notes CC et partiel
│   ├── /documents
│   │   └── page.tsx         # Docs utiles par catégorie
│   ├── /salles
│   │   └── page.tsx         # Répartition groupes/salles par jour
│   └── /admin
│       └── page.tsx         # Page admin (mot de passe, gestion données)
├── /components
│   ├── Navigation.tsx       # Barre de nav (desktop + mobile)
│   ├── SearchBar.tsx        # Moteur de recherche réutilisable
│   ├── Card.tsx             # Composant carte standard
│   ├── Badge.tsx            # Badge pour statuts
│   ├── DayBriefCard.tsx     # Fiche brief du jour
│   └── GroupCard.tsx        # Fiche groupe
├── /lib
│   ├── data.ts              # Utilitaires de lecture des JSON
│   └── utils.ts             # Fonctions utilitaires
├── /data
│   ├── groups.json          # 21 groupes + composition
│   ├── attendance.json      # Présences/absences par jour
│   ├── comments.json        # Commentaires de suivi
│   ├── notes.json           # Notes (CC + partiel)
│   ├── rooms.json           # Salles et répartition groupes
│   ├── briefs.json          # Briefs des 5 jours
│   └── documents.json       # Documents utiles
├── /styles
│   └── globals.css          # Styles Tailwind + CSS personnalisé
├── /public
│   └── (icônes, favicon)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md                # Instructions de lancement et déploiement
```

**Fichiers à ne pas modifier sans validation** :
- `tailwind.config.js` (design system)
- `next.config.js` (configuration de build)

**Fichiers ou dossiers à ignorer** :
- `.next/`
- `node_modules/`
- `.git/`
- `.env.local`

---

## 7. Données, fichiers et contenus

**Sources utilisées** :
- JSON local statique dans `/data/`
- Pas de base de données
- Pas d'API externe

**Emplacement des données** :
Tous les fichiers dans `/data/` :
- `groups.json` : 21 groupes avec ~5-6 étudiants chacun
- `attendance.json` : Présences/absences/retards
- `comments.json` : Commentaires pédagogiques
- `notes.json` : Notes (contrôle continu + partiel)
- `rooms.json` : Salles et répartition groupes
- `briefs.json` : Brief du jour pour chaque jour du séminaire
- `documents.json` : Liens vers documents utiles

**Format d'entrée** :
JSON structurés, modifiables manuellement dans un éditeur de texte.

**Format de sortie** :
Interface web responsive (HTML/CSS/JS compilé via Next.js).

**Règles de traitement des données** :
- ✅ Tous les 21 groupes doivent être lisibles
- ✅ Les noms des étudiants doivent être affichés par spécialité (RH, Finance, CACG)
- ✅ Statuts de présence : « Présent », « Absent », « Retard »
- ✅ Commentaires de suivi : organisés par jour (lundi-vendredi) et spécialité
- ✅ Notes : affichées brutes (pas de calcul complexe)
- ✅ Documents : lien externe (URL), pas stockage interne
- ✅ Salles : affichage du groupe → numéro de salle + jour

**Données sensibles** :
Aucune donnée réelle sensible attendue. Les données sont fictives pour la démo.

---

## 8. Site web / Application

**Objectif de l'interface** :
Permettre aux enseignants de consulter rapidement les informations critiques du séminaire (briefs, groupes, présences, notes, commentaires) sans friction, depuis desktop ou mobile.

**Pages / écrans nécessaires** :
1. **Aujourd'hui** : Brief du jour, objectifs, livrables, intervenants, salles, alertes + 4 CTA rapides
2. **Groupes** : Liste des 21 groupes (cartes), recherche, fiche détaillée groupe
3. **Suivi** : Commentaires par groupe/jour/spécialité, formulaire simple d'ajout
4. **Présences** : Synthèse absents/retards, recherche par nom/groupe
5. **Notes** : Deux sections (CC + Partiel), tableau simple notes
6. **Documents** : Cartes documents par catégorie, liens externes
7. **Salles** : Répartition groupes/salles par jour, recherche groupe → salle
8. **Admin** : Mot de passe, accès modification données (téléchargement JSON possible)

**Contenus importants** :
- Titre principal : « IGRH Week – Espace Formateurs »
- Promesse : « Toutes les infos du séminaire, en 2 clics »
- CTA principal : Accès aux 7 sections
- Sections obligatoires : Toutes les 7
- Éléments de réassurance : Logo EDC, dates/jours, formateurs présents

**Style visuel souhaité** :
- Premium, épuré, minimaliste
- Cartes, badges, typographie Geist
- Pas de tableaux énormes
- Pas d'effet « intranet »
- Icônes simples (Lucide)
- Navigation latérale (desktop), compacte (mobile)
- Hiérarchie visuelle forte

**Références / inspirations** :
- Cockpit d'exploitation (opérationnel, rapide, efficace)
- SaaS moderne (Figma, Linear, Notion)
- Pas de : logiciels administratifs, interfaces lourdes, « web 2000 »

**Règles UX** :
- ✅ Toute info importante accessible en 2-3 clics max
- ✅ Mobile-first : responsive sans dégradation
- ✅ Textes simples, orientsés bénéfice utilisateur
- ✅ Pas d'interface trop complexe si une version simple suffit
- ✅ Pas de formulaires lourdingues
- ✅ Pas de scroll infini
- ✅ Pas de popup intrusives
- ✅ Navigation claire et logique

---

## 9. Commandes utiles

**Installation** :
```bash
npm install
```

**Lancer le projet en local** :
```bash
npm run dev
# Accessible sur http://localhost:3000
```

**Build production** :
```bash
npm run build
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

**Après la modification** :
1. Résumer ce qui a changé (fichiers modifiés, lignes clé).
2. Expliquer comment vérifier que tout fonctionne (`npm run dev`, test sur navigateur).
3. Signaler les limites, risques ou points à améliorer.
4. Proposer une prochaine étape claire.

---

## 11. Tests et vérification

**Méthode de vérification attendue** :
1. L'application se lance sans erreur avec `npm run dev`
2. Les 7 sections sont accessibles et affichent des données
3. La navigation fonctionne sans bug
4. L'interface est lisible sur mobile (largeur < 480px) et desktop
5. Les recherches (groupes, noms) fonctionnent
6. Les formulaires d'ajout de commentaire fonctionnent
7. Le mot de passe admin fonctionne

**Données / scénario de test** :
- Groupe 01 visible dans « Groupes »
- Recherche « Alice Dupont » retourne Groupe 01
- Brief lundi affichable dans « Aujourd'hui »
- Présences lundi visible dans « Présences »
- Commentaire de suivi lundi/RH visible pour Groupe 01
- Document « Sujet » accessible dans « Documents »
- Recherche groupe « 03 » → affiche salle 202 dans « Salles »

**Critères de réussite** :
- ✅ Zéro erreur console au lancement
- ✅ Toutes les 7 sections fonctionnelles
- ✅ Responsive mobile (testé sur téléphone réel ou DevTools)
- ✅ Performance acceptable (chargement < 2s)
- ✅ Mot de passe admin sécurisé (pas visible en clair)
- ✅ Données fictives cohérentes et réalistes
- ✅ Déploiement Vercel sans erreur

---

## 12. Sécurité et points de vigilance

**Claude doit faire attention à** :
- ❌ Ne jamais exposer de clés API, tokens, mots de passe en clair dans le code
- ❌ Ne pas utiliser le mot de passe dans les variables d'environnement non-chiffrées
- ❌ Ne pas supprimer de fichiers JSON sans demander
- ❌ Ne pas écraser un fichier de données sans validation
- ⚠️ Le mot de passe admin est stocké côté client (hachage simple acceptable pour outil interne temporaire)
- ⚠️ Pas de données sensibles réelles ne doivent être stockées

**Informations sensibles à ne jamais inclure** :
- Clés API
- Tokens d'authentification Vercel ou GitHub
- Mots de passe réels (seulement PPAIRH2026 pour la démo)
- Données personnelles de véritables étudiants

---

## 13. Documentation attendue

**Documentation utile** :
- Instructions de lancement (`npm install`, `npm run dev`)
- Comment modifier les données JSON
- Comment ajouter un nouveau groupe / document
- Comment déployer sur Vercel
- Structure simple du projet
- Limites connues

**Emplacement** :
- [ ] README.md (fichier racine)
- Commentaires dans le code pour les sections complexes

**Exemple README minimal** :
```markdown
# IGRH Week – Espace Formateurs

Site web cockpit pour les enseignants du séminaire IGRH Week 2026.

## Lancement

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
- etc.

Puis redéployez sur Vercel.

## Déploiement

\`\`\`bash
vercel deploy
\`\`\`
```

---

## 14. Décisions déjà prises

**Décisions importantes** :
1. ✅ Stack Next.js 15 + React + Tailwind — rapide, léger, déployable Vercel
2. ✅ Données JSON modifiables manuellement — pas de base de données complexe
3. ✅ Mot de passe admin simple (PPAIRH2026) — suffisant pour outil interne temporaire
4. ✅ Pas de système d'authentification — seule la zone admin protégée
5. ✅ Design premium minimaliste — cockpit opérationnel, pas intranet
6. ✅ Mobile-first priorité absolue — enseignants consultent depuis téléphone
7. ✅ Données fictives de démonstration pour 21 groupes — prêtes à remplacer

**Choix refusés** :
- ❌ Supabase / Firebase — trop lourd pour un outil temporaire
- ❌ Redux / Zustand — state management non justifié
- ❌ Material-UI — trop massif, slow
- ❌ Intégration Edusign en temps réel — import manuel suffisant
- ❌ Back-end custom — complexité inutile
- ❌ Authentification multi-utilisateurs — scope hors limites

---

## 15. Questions ouvertes

**Questions à clarifier** :
- Sera-t-il besoin de sauvegarder les commentaires de suivi après la semaine ? (Hypothèse : non, données temporaires)
- Les notes seront-elles saisies via un formulaire ou importées d'Excel/CSV ? (Hypothèse : JSON manuel pour MVP)
- Faut-il un historique des modifications ? (Hypothèse : non, version simple)

**Hypothèses raisonnables** :
- Les données de présence/notes seront mises à jour manuellement via édition JSON et redéploiement
- Les commentaires de suivi sont temporaires (pas d'archivage après séminaire)
- Le mot de passe admin est connu de tous les enseignants (confiance mutuelle)
- La semaine est bien 5 jours (lundi à vendredi, pas de dimanche)

---

## 16. Définition de terminé

**La tâche est terminée quand** :
- ✅ Le code est compilable sans erreur (`npm run dev` fonctionne)
- ✅ Les 7 sections sont fonctionnelles et affichent des données de démo
- ✅ L'interface est responsive mobile + desktop
- ✅ Le mot de passe admin fonctionne
- ✅ Tous les fichiers JSON de démo sont en place (21 groupes, 5 jours)
- ✅ Déploiement Vercel réussi (URL publique fonctionnelle)
- ✅ README.md complet avec instructions
- ✅ Code commenté et lisible
- ✅ Aucune dépendance inutile
- ✅ Performance acceptable (Lighthouse > 80)

**Livrables attendus** :
1. Repository GitHub / Vercel clone-ready
2. 7 fichiers JSON de démonstration (`/data/*`)
3. Code Next.js complet avec tous les composants
4. README.md avec instructions de lancement + déploiement
5. URL Vercel publique prête pour la semaine du séminaire

**Dernière vérification** :
- Tester sur mobile réel (pas juste DevTools)
- Tester toutes les recherches
- Tester le mot de passe admin
- Vérifier les performances (temps de chargement)
- Vérifier l'affichage sur l'application Vercel live

---

## 17. Notes supplémentaires

**Principes pédagogiques** :
- L'outil ne doit pas être un logiciel RH lourd, mais un petit cockpit d'exploitation
- Les enseignants doivent se sentir libérés (accès rapide aux infos) pas chargés (pas de UI complexe)
- Simple > complet. Rapide > sophistiqué. Lisible > technique.

**Environnement d'exécution** :
- Node.js 18+ (standard Vercel)
- npm 9+ ou pnpm
- Pas de dépendances systèmes complexes

**Prochaines itérations possibles** (hors scope MVP) :
- Export/import des notes depuis Excel
- Intégration Edusign en temps réel
- Graphiques / analytics (taux présence, distribution notes)
- Archivage post-séminaire
- Multi-semaines
- Authentification par email (formation futures)
