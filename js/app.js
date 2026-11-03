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
}

// Toute modification des données passe par ici, puis on rafraîchit l'affichage
function mettreAJour(nouveauxLivres) {
  livres = nouveauxLivres;
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
