const $ = (id) => document.getElementById(id);

let livres = copieDepart();

function copieDepart() {
  return LIVRES_DEPART.map((livre) => ({ ...livre }));
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

function afficher() {
  $("grille").replaceChildren(...livres.map(creerCarte));
}

afficher();
