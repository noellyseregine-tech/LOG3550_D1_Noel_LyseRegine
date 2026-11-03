# LOG3550 – Devoir 1 : Catalogue de bibliothèque (frontend)

**Étudiant(e) :** Prénom Nom
**Cours :** LOG3550 Développement web – ISTEAH (prof. Samuel Jonathan Joseph)
**Dépôt Git :** https://github.com/VOTRE-COMPTE/LOG3550-devoir1

## Description

Frontend d'une application web de catalogue de bibliothèque, écrit en HTML, CSS et JavaScript purs, sans framework ni bibliothèque externe. On peut y consulter des livres, les rechercher, les filtrer, les trier, en ajouter et en supprimer. Les données sont conservées dans le navigateur (`localStorage`). Ce frontend sera relié à une API FastAPI dans le devoir 2.

Chaque livre a les propriétés `id`, `titre`, `auteur`, `annee`, `categorie` (roman, science, histoire, informatique ou autre) et `disponible` (vrai ou faux).

```
devoir1/
  index.html          page HTML5 sémantique
  css/styles.css      styles, mobile d'abord
  js/data.js          catégories et 10 livres de départ
  js/app.js           affichage, recherche, filtres, tri, ajout, suppression, persistance
  img/logo.svg        logo (dessiné pour ce devoir)
  captures/           captures numérotées
  README.md
  RESULTATS.md        grille de conformité et résultats des vérifications
```

## Mode d'emploi

1. Ouvrir `index.html` dans un navigateur récent (Chrome, Firefox ou Edge). Aucun serveur ni installation n'est nécessaire.
2. **Rechercher** : taper une partie d'un titre ou d'un auteur dans « Titre ou auteur ». La recherche se fait pendant la saisie et ignore les majuscules et les accents (« miserables » trouve « Les Misérables »).
3. **Filtrer** : choisir une catégorie et/ou cocher « Disponibles seulement ». Ces filtres se combinent avec la recherche.
4. **Trier** : par titre (A → Z ou Z → A) ou par année (croissante ou décroissante).
5. Le **compteur** indique le nombre de livres affichés. Un message s'affiche quand aucun livre ne correspond.
6. **Ajouter** : remplir le formulaire « Ajouter un livre », puis cliquer sur « Ajouter le livre ». Les erreurs s'affichent sous chaque champ et le curseur va au premier champ en erreur.
7. **Supprimer** : cliquer sur « Supprimer » sur une carte, puis confirmer.
8. **Changer le statut** : « Marquer emprunté / Marquer disponible » change l'étiquette de la carte.
9. **Réinitialiser** : remet les 10 livres de départ, après confirmation. Le bouton est désactivé tant que les données n'ont pas été modifiées.
10. Au clavier : `Tab` pour avancer, `Maj+Tab` pour reculer, `Entrée` ou `Espace` pour activer. Le premier `Tab` fait apparaître le lien « Aller au catalogue ».

## Choix de conception

- **HTML sémantique** : `header` (avec `nav`), `main`, deux `section` (catalogue et formulaire), `footer`. Un seul `h1`, des `h2` pour les sections et des `h3` pour les cartes. `lang="fr"`, balise `viewport`, un `label` par champ, un `alt` descriptif sur le logo, et un lien d'évitement pour les utilisateurs du clavier.
- **Cartes générées par le DOM** : la grille est vide dans le HTML. Chaque carte est clonée à partir d'un `<template>`, puis remplie avec `textContent`. On n'utilise pas `innerHTML`, ce qui évite toute injection de HTML par un titre saisi.
- **Variables CSS** dans `:root` pour toutes les couleurs et tous les espacements. La palette bleu nuit et vert sarcelle donne un texte bien contrasté. Ratios calculés selon la formule WCAG : texte principal sur fond 14,4:1, texte secondaire 6,8:1, blanc sur l'accent 6,4:1, étiquette « Disponible » 8,6:1, étiquette « Emprunté » 7,7:1. Tous dépassent le seuil AA de 4,5:1.
- **Mobile d'abord** avec CSS Grid : 1 colonne par défaut, 2 colonnes dès 600 px (tablette), 3 dès 960 px (ordinateur) et 4 dès 1280 px (écran large), soit trois points de rupture `@media (min-width: …)`.
- **États visibles** : `:hover` sur les boutons et les cartes, contour jaune `:focus-visible` pour le clavier, bouton désactivé grisé (« Réinitialiser »), étiquettes « Disponible » (vert) et « Emprunté » (orange) avec un liseré de carte assorti.
- **Une seule source de vérité** : le tableau `livres`. Toute modification passe par `mettreAJour()`, qui sauvegarde dans `localStorage` puis réaffiche la liste. L'affichage est toujours recalculé à partir des données et des filtres courants, donc les filtres restent cohérents après un ajout ou une suppression.
- **Validation** : `validerFormulaire()` est une fonction pure qui retourne un objet `{ champ: message }`. L'attribut `novalidate` désactive les bulles natives du navigateur pour que les messages soient en français et placés sous les champs. Chaque message est relié à son champ par `aria-describedby`, annoncé par `aria-live="polite"`, et le champ fautif reçoit `aria-invalid="true"`.
- **Robustesse** : si `localStorage` est indisponible (navigation privée) ou contient des données corrompues, l'application repart des données de départ au lieu de planter.
- **Organisation** : `data.js` ne contient que des données ; `app.js` est découpé en sections (persistance, recherche et filtres, affichage, actions, formulaire, initialisation) faites de petites fonctions.

## Questions d'explication

**1. Pourquoi les balises sémantiques sont-elles préférables à une suite de `div` ?**
Les balises `header`, `nav`, `main`, `section` et `footer` indiquent aux lecteurs d'écran le rôle de chaque zone et permettent de sauter de l'une à l'autre (accessibilité).
Les moteurs de recherche comprennent mieux la structure de la page et l'importance de chaque contenu (référencement).
En lisant le code, on voit directement le rôle de chaque bloc sans le deviner à partir de noms de classes.
Un balisage cohérent est donc plus facile à relire, à modifier et à partager en équipe (maintenance).
Une `div` n'a aucun sens en soi : il faudrait recréer ce sens à la main avec des rôles ARIA.

**2. Différence entre `map`, `filter` et `forEach`, et lesquels j'ai utilisés**
`forEach` parcourt un tableau pour exécuter une action sur chaque élément et ne retourne rien (`undefined`).
`map` retourne un nouveau tableau de même longueur, dont chaque élément est transformé par la fonction.
`filter` retourne un nouveau tableau qui ne garde que les éléments pour lesquels la fonction renvoie `true`.
Pour la recherche et le filtrage, j'ai utilisé `filter`, enchaîné trois fois (texte, catégorie, disponibilité), puis `sort` pour le tri.
J'utilise aussi `map` pour transformer les livres en cartes, et `forEach` pour remplir les listes déroulantes et brancher les écouteurs.

## Captures d'écran (dossier `captures/`)

1. `01-validation-w3c.png` : validateur W3C (Nu Html Checker), « No errors or warnings to show »
2. `02-ecran-large.png` : écran large (1440 px), 4 colonnes
3. `03-tablette.png` : tablette (768 px), 2 colonnes
4. `04-telephone.png` : téléphone (390 px), 1 colonne
5. `05-validation-formulaire.png` : messages d'erreur sous les champs (complément)
6. `06-aucun-resultat.png` : message quand aucun livre ne correspond (complément)
7. `07-filtres-combines.png` : recherche, catégorie, « disponibles seulement » et tri combinés (complément)

## Difficultés rencontrées

- **Recherche sans accents** : comparer « miserables » et « Misérables » demandait de retirer les accents. J'ai utilisé `normalize("NFD")`, qui sépare chaque lettre de son accent, puis une expression régulière qui supprime les accents (plage Unicode U+0300 à U+036F).
- **Tri des titres** : avec `<` et `>`, les titres accentués et les majuscules se trient mal. `localeCompare(…, "fr")` donne l'ordre alphabétique français.
- **Écouteurs perdus** : au début, je reconstruisais la grille sans rattacher les écouteurs des boutons. Je les branche maintenant dans `creerCarte()`, au moment où chaque carte est créée.
- **Messages d'erreur accessibles** : il a fallu combiner `aria-describedby`, pour lire le message quand on arrive sur le champ, et `aria-live`, pour l'annoncer au moment de la validation. Il a aussi fallu ajouter `novalidate` pour éviter que les bulles du navigateur doublent mes messages.
- **Champ année** : un `input type="number"` vide renvoie `""`, et `Number("")` vaut `0`. La validation vérifie donc d'abord que le champ n'est pas vide.
- **`localStorage`** : il ne stocke que du texte (d'où `JSON.stringify` et `JSON.parse`) et peut être bloqué. Les accès sont donc protégés par `try…catch`.

## Sources et outils d'assistance

- MDN Web Docs : `<template>`, `localStorage`, `String.prototype.normalize`, `Intl`/`localeCompare`, `aria-live`, `aria-describedby`, `:focus-visible`.
- W3C Nu Html Checker : https://validator.w3.org/nu/
- WebAIM Contrast Checker, pour vérifier les contrastes de la palette.
- Police **Literata** (Google Fonts, licence SIL Open Font License), seule ressource externe autorisée.
- Image : `img/logo.svg`, dessinée pour ce devoir (formes géométriques simples), libre de droits. Aucune autre image n'est utilisée.
- Outil d'assistance IA : **Claude (Anthropic)**, utilisé pour générer et réviser le code, rédiger une partie de ce README et produire les captures avec un script de test automatisé (Selenium et Chrome sans interface). J'ai relu, testé et compris chaque partie du code, et je peux l'expliquer.
