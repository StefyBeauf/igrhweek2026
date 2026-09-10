# IGRH Week – Espace Formateurs

Site web cockpit pour les enseignants du séminaire IGRH Week 2026 (5 jours).
Centralise briefs, groupes, suivi pédagogique, présences, notes, documents et salles.

## Lancement

```bash
npm install
npm run dev
```

Accessible sur http://localhost:3000

## Modifier les données

Toutes les données sont dans `/data`, au format JSON simple, modifiable dans n'importe quel éditeur de texte :

- `groups.json` : les 21 groupes et leur composition (nom, spécialité RH/Finance/CACG)
- `days.json` : les 5 jours du séminaire (clé, libellé, date)
- `briefs.json` : brief du jour (objectifs, livrables, intervenants, salles, alertes) pour chaque jour
- `attendance.json` : présences/absences/retards par jour et par groupe
- `comments.json` : commentaires de suivi pédagogique par groupe/jour/spécialité
- `notes.json` : notes de contrôle continu et de partiel
- `rooms.json` : salle attribuée à chaque groupe, par jour
- `documents.json` : liens vers les documents utiles (sujet, consignes, supports...)

Après modification, redéployez le site (voir ci-dessous) pour publier les changements.

### Ajouter un groupe

Ajoutez un objet dans `groups.json` avec un `id` unique (ex: `"G22"`), un `name` et la liste `students`. Pensez à compléter aussi `attendance.json`, `rooms.json` et `notes.json` si besoin.

### Ajouter un document

Ajoutez un objet dans `documents.json` avec `id`, `titre`, `categorie` (une des catégories existantes : Sujet, Consignes, Planning, Grilles, Supports, Fiches, Autres) et `url`.

## Zone admin

Accessible via l'icône cadenas (page `/admin`), protégée par un mot de passe simple. Elle permet de consulter et d'exporter les fichiers JSON en cours. Les commentaires ajoutés depuis la page « Suivi » sont temporaires (durée de la session du navigateur) : pour les conserver, reportez-les dans `data/comments.json`.

## Build production

```bash
npm run build
```

## Déploiement Vercel

```bash
vercel deploy
```

Ou connectez le dépôt Git à Vercel pour un déploiement automatique à chaque `git push`.

## Limites connues

- Pas de base de données : toute donnée doit être modifiée via les fichiers JSON puis redéployée.
- Les commentaires ajoutés via l'interface « Suivi » ne sont pas persistés côté serveur.
- Le mot de passe admin est une protection légère adaptée à un usage interne temporaire, pas une authentification sécurisée.
