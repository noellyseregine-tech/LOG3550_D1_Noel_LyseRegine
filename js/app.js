const $ = (id) => document.getElementById(id);

let livres = copieDepart();

function copieDepart() {
  return LIVRES_DEPART.map((livre) => ({ ...livre }));
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
  carte.querySelector(".btn-statut").textContent = livre.disponible ? "Marquer emprunté" : "Marquer disponible";
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
}

/* ---------- Initialisation ---------- */

function remplirCategories() {
  CATEGORIES.forEach((cat) => {
    [$("filtre-categorie"), $("categorie")].forEach((liste) => liste.append(new Option(cat, cat)));
  });
}

function init() {
  remplirCategories();
  ["recherche", "filtre-categorie", "tri", "dispo-seulement"].forEach((id) => {
    $(id).addEventListener("input", afficher);
  });
  afficher();
}

init();
