# Résultats – LOG3550 Devoir 1

Ce document met chaque exigence de l'énoncé en regard de sa réalisation dans le projet et de sa preuve (fichier, capture ou test).

## 1. Validation W3C

| Outil | Fichier | Résultat |
|---|---|---|
| Nu Html Checker (validator.w3.org/nu, vnu 26.11.3) | `index.html` | **0 erreur, 0 avertissement** – « Document checking completed. No errors or warnings to show. » |

Preuve : `captures/01-validation-w3c.png`

## 2. Tests fonctionnels (Chrome sans interface, 36 vérifications)

**Résultat : 36 / 36 réussies.**

| # | Vérification | Résultat |
|---|---|---|
| 1 | Au moins 8 cartes générées depuis `data.js` (10) | ✅ |
| 2 | Grille vide dans le HTML : aucune carte écrite à la main | ✅ |
| 3 | Compteur « 10 livres affichés sur 10 » | ✅ |
| 4 | « Réinitialiser » désactivé à l'état de départ | ✅ |
| 5 | Un seul `h1` | ✅ |
| 6 | Toutes les images ont un `alt` | ✅ |
| 7 | Recherche insensible à la casse et aux accents (« MISERABLES » → *Les Misérables*) | ✅ |
| 8 | Recherche par auteur sans accent (« exupery » → *Le Petit Prince*) | ✅ |
| 9 | Filtre catégorie « science » (2 livres) | ✅ |
| 10 | Filtres combinés science + disponibles (→ *Cosmos*) | ✅ |
| 11 | Message clair et compteur à 0 quand aucun résultat | ✅ |
| 12 | Tri titre croissant | ✅ |
| 13 | Tri titre décroissant | ✅ |
| 14 | Tri année croissante | ✅ |
| 15 | Tri année décroissante | ✅ |
| 16 | Formulaire vide : 4 messages d'erreur | ✅ |
| 17 | Erreurs reliées aux champs par `aria-describedby` | ✅ |
| 18 | Erreurs annoncées (`aria-live="polite"`) | ✅ |
| 19 | Focus placé sur le premier champ invalide | ✅ |
| 20 | Titre d'un caractère refusé | ✅ |
| 21 | Année 1300 refusée | ✅ |
| 22 | Année future (2999) refusée | ✅ |
| 23 | Ajout d'un livre valide sans rechargement | ✅ |
| 24 | Formulaire vidé après l'ajout | ✅ |
| 25 | « Réinitialiser » activé après une modification | ✅ |
| 26 | Suppression annulée si on refuse la confirmation | ✅ |
| 27 | Suppression effectuée après confirmation | ✅ |
| 28 | Rechargement : l'ajout est conservé (`localStorage`) | ✅ |
| 29 | Rechargement : la suppression est conservée (`localStorage`) | ✅ |
| 30 | « Réinitialiser » remet les 10 livres de départ | ✅ |
| 31 | Réinitialisation conservée après rechargement | ✅ |
| 32 | Clavier : le premier `Tab` atteint le lien d'évitement | ✅ |
| 33 | Téléphone (390 px) : 1 colonne | ✅ |
| 34 | Tablette (768 px) : 2 colonnes | ✅ |
| 35 | Ordinateur (1024 px) : 3 colonnes | ✅ |
| 36 | Écran large (1440 px) : 4 colonnes | ✅ |

## 3. Contrastes de la palette (formule WCAG 2.1)

| Paire | Ratio | Seuil AA (4,5:1) |
|---|---|---|
| Texte `#1c2433` / fond `#f4f6f9` | 14,4:1 | ✅ |
| Texte secondaire `#4a566b` / fond | 6,8:1 | ✅ |
| Blanc / accent `#0b6b63` (boutons) | 6,4:1 | ✅ |
| Blanc / bleu nuit `#14233c` (en-tête, pied) | 15,7:1 | ✅ |
| Rouge `#a3261f` / blanc (Supprimer, erreurs) | 7,4:1 | ✅ |
| Étiquette « Disponible » | 8,6:1 | ✅ |
| Étiquette « Emprunté » | 7,7:1 | ✅ |

## 4. Grille de conformité à l'énoncé

### Partie 1 – Structure HTML (20 pts)
| Exigence | Réalisation |
|---|---|
| `header` avec `nav`, `main`, section catalogue, section formulaire, `footer` | `index.html` |
| Un seul `h1`, titres hiérarchisés | `h1` → `h2` (sections) → `h3` (cartes) |
| `lang="fr"` et `viewport` | `<html lang="fr">`, `<meta name="viewport">` |
| `label` associé à chaque champ | `for`/`id` sur les 8 champs |
| Images avec `alt` | logo `img/logo.svg` avec un `alt` descriptif |
| Navigation au clavier | ordre naturel, lien d'évitement, `:focus-visible` |
| Validation W3C sans erreur + capture | section 1, `captures/01-validation-w3c.png` |
| Explication en 5 lignes | `README.md`, question 1 |

### Partie 2 – CSS et page adaptative (25 pts)
| Exigence | Réalisation |
|---|---|
| Variables CSS (`:root`) pour couleurs et espacements | `css/styles.css`, en tête du fichier |
| Palette lisible | section 3 |
| Cartes en Grid : 1 / 2 / 3+ colonnes | `.grille` ; tests 33 à 36 |
| Mobile d'abord, au moins 2 `@media` | 3 points de rupture : 600, 960 et 1280 px (`min-width`) |
| `:hover`, `:focus-visible`, bouton désactivé, étiquettes colorées | boutons et cartes, `:focus-visible`, `button:disabled`, `.etiquette.disponible` et `.etiquette.emprunte` |
| Trois captures | `02-ecran-large.png`, `03-tablette.png`, `04-telephone.png` |

### Partie 3 – Interactivité JavaScript (30 pts)
| Exigence | Réalisation |
|---|---|
| Cartes générées par le DOM | `<template id="modele-carte">` + `creerCarte()` |
| Recherche en temps réel (casse et accents) | `normaliser()` + événement `input` ; tests 7 et 8 |
| Filtre catégorie + « disponibles seulement », combinables | `livresAffiches()` ; test 10, capture 07 |
| Tri titre et année, dans les deux sens | `comparer()` + `<select id="tri">` ; tests 12 à 15 |
| Nombre de résultats + message si aucun | `#compteur`, `#vide` ; test 11, capture 06 |
| Ajout et suppression avec confirmation, sans rechargement | `ajouterLivre()`, `supprimerLivre()` ; tests 23 à 27 |
| Explication `map` / `filter` / `forEach` | `README.md`, question 2 |

### Partie 4 – Validation et persistance (10 pts)
| Exigence | Réalisation |
|---|---|
| Titre et auteur ≥ 2 caractères, année entre 1450 et l'année en cours, catégorie choisie | `validerFormulaire()` ; tests 16 à 22 |
| Messages sous chaque champ, annoncés | `<p class="erreur">` + `aria-describedby` + `aria-live` ; capture 05 |
| `localStorage` + bouton « Réinitialiser » | `chargerLivres()`, `sauvegarder()`, `reinitialiser()` ; tests 28 à 31 |

### Partie 5 – Qualité du code et livraison (15 pts)
| Exigence | Réalisation |
|---|---|
| Petites fonctions nommées clairement, sans duplication ni code mort | `js/app.js` (21 fonctions, regroupées par section) |
| Au moins 8 commits aux messages significatifs | `git log --oneline` (13 commits) |
| README : description, mode d'emploi, choix, difficultés, sources | `README.md` |
| Captures numérotées + réponses aux questions | `captures/01` à `07`, `README.md` |
