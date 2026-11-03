const CLE_STOCKAGE = "bibliotheque-livres";
const CHAMPS_FORMULAIRE = ["titre", "auteur", "annee", "categorie"];
const $ = (id) => document.getElementById(id);

let livres = chargerLivres();

/* ---------- Persistance ---------- */

function copieDepart() {
  return LIVRES_DEPART.map((livre) => ({ ...livre }));
}

function chargerLivres() {
  try {
    const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
    return Array.isArray(donnees) ? donnees : copieDepart();
  } catch {
    return copieDepart(); // stockage indisponible ou JSON corrompu
  }
}

function sauvegarder() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(livres));
  } catch {
    // Quota dépassé ou navigation privée : l'application continue en mémoire
  }
}

function estEtatDepart() {
  return JSON.stringify(livres) === JSON.stringify(LIVRES_DEPART);
}

/* ---------- Recherche, filtres et tri ---------- */

// Retire les accents et la casse pour comparer des textes
function normaliser(texte) {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function comparer(a, b, champ) {
  return champ === "annee" ? a.annee - b.annee : a.titre.localeCompare(b.titre, "fr");
}

function livresAffiches() {
  const recherche = normaliser($("recherche").value.trim());
  const categorie = $("filtre-categorie").value;
  const dispoSeulement = $("dispo-seulement").checked;
  const [champ, sens] = $("tri").value.split("-");

  return livres
    .filter((l) => !recherche || normaliser(`${l.titre} ${l.auteur}`).includes(recherche))
    .filter((l) => !categorie || l.categorie === categorie)
    .filter((l) => !dispoSeulement || l.disponible)
    .sort((a, b) => (sens === "desc" ? -1 : 1) * comparer(a, b, champ));
}

/* ---------- Affichage ---------- */

function creerCarte(livre) {
  const carte = $("modele-carte").content.firstElementChild.cloneNode(true);
  const statut = livre.disponible ? "disponible" : "emprunte";
  const etiquette = carte.querySelector(".etiquette");

  carte.classList.add(statut);
  etiquette.classList.add(statut);
  etiquette.textContent = livre.disponible ? "Disponible" : "Emprunté";
  carte.querySelector(".carte-titre").textContent = livre.titre;
  carte.querySelector(".carte-auteur").textContent = livre.auteur;
  carte.querySelector(".carte-meta").textContent = `${livre.annee} · ${livre.categorie}`;

  const boutonStatut = carte.querySelector(".btn-statut");
  boutonStatut.textContent = livre.disponible ? "Marquer emprunté" : "Marquer disponible";
  boutonStatut.addEventListener("click", () => basculerStatut(livre.id));

  const boutonSupprimer = carte.querySelector(".btn-supprimer");
  boutonSupprimer.setAttribute("aria-label", `Supprimer « ${livre.titre} »`);
  boutonSupprimer.addEventListener("click", () => supprimerLivre(livre.id));
  return carte;
}

function texteCompteur(nombre, total) {
  return `${nombre} livre${nombre > 1 ? "s" : ""} affiché${nombre > 1 ? "s" : ""} sur ${total}`;
}

function afficher() {
  const resultats = livresAffiches();
  $("grille").replaceChildren(...resultats.map(creerCarte));
  $("vide").hidden = resultats.length > 0;
  $("compteur").textContent = texteCompteur(resultats.length, livres.length);
  $("reinitialiser").disabled = estEtatDepart();
}

// Toute modification des données passe par ici : sauvegarde puis rafraîchissement
function mettreAJour(nouveauxLivres) {
  livres = nouveauxLivres;
  sauvegarder();
  afficher();
}

/* ---------- Actions ---------- */

function basculerStatut(id) {
  mettreAJour(livres.map((l) => (l.id === id ? { ...l, disponible: !l.disponible } : l)));
}

function supprimerLivre(id) {
  const livre = livres.find((l) => l.id === id);
  if (!confirm(`Supprimer « ${livre.titre} » du catalogue ?`)) return;
  mettreAJour(livres.filter((l) => l.id !== id));
}

function reinitialiser() {
  if (!confirm("Remettre les données de départ ? Vos ajouts et suppressions seront perdus.")) return;
  mettreAJour(copieDepart());
}

/* ---------- Formulaire ---------- */

// Retourne un objet { champ: message } ; vide si tout est valide
function validerFormulaire(valeurs) {
  const erreurs = {};
  const anneeCourante = new Date().getFullYear();
  const annee = Number(valeurs.annee);

  if (valeurs.titre.length < 2) erreurs.titre = "Le titre est obligatoire (2 caractères minimum).";
  if (valeurs.auteur.length < 2) erreurs.auteur = "L'auteur est obligatoire (2 caractères minimum).";
  if (valeurs.annee === "" || !Number.isInteger(annee) || annee < 1450 || annee > anneeCourante) {
    erreurs.annee = `L'année doit être un nombre entier entre 1450 et ${anneeCourante}.`;
  }
  if (!CATEGORIES.includes(valeurs.categorie)) erreurs.categorie = "Choisissez une catégorie.";
  return erreurs;
}

function afficherErreurs(erreurs) {
  CHAMPS_FORMULAIRE.forEach((champ) => {
    $(`erreur-${champ}`).textContent = erreurs[champ] || "";
    $(champ).setAttribute("aria-invalid", champ in erreurs);
  });
}

function lireFormulaire() {
  return {
    titre: $("titre").value.trim(),
    auteur: $("auteur").value.trim(),
    annee: $("annee").value.trim(),
    categorie: $("categorie").value
  };
}

function ajouterLivre(evenement) {
  evenement.preventDefault();
  const valeurs = lireFormulaire();
  const erreurs = validerFormulaire(valeurs);
  afficherErreurs(erreurs);

  const premierChampInvalide = CHAMPS_FORMULAIRE.find((champ) => champ in erreurs);
  if (premierChampInvalide) {
    $(premierChampInvalide).focus();
    return;
  }

  const nouvelId = Math.max(0, ...livres.map((l) => l.id)) + 1;
  mettreAJour([...livres, { id: nouvelId, ...valeurs, annee: Number(valeurs.annee), disponible: true }]);
  $("form-ajout").reset();
  $("titre").focus();
}

/* ---------- Initialisation ---------- */

function remplirCategories() {
  CATEGORIES.forEach((cat) => {
    [$("filtre-categorie"), $("categorie")].forEach((liste) => liste.append(new Option(cat, cat)));
  });
}

function init() {
  remplirCategories();
  $("annee").max = new Date().getFullYear();
  ["recherche", "filtre-categorie", "tri", "dispo-seulement"].forEach((id) => {
    $(id).addEventListener("input", afficher);
  });
  $("reinitialiser").addEventListener("click", reinitialiser);
  $("form-ajout").addEventListener("submit", ajouterLivre);
  afficher();
}

init();
