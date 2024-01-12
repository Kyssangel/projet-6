const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const modalContent = document.querySelector(".modal-content");

let works = [];
let categories = [];
let isAdmin = sessionStorage.getItem("token");

const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  works = [...data];
};

const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();
  categories = [...data];
};

const createWorks = (works) => {
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.src = work.imageUrl;
    image.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
};

const createModalWorks = (works) => {
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = work.imageUrl;
    image.alt = work.title;

    figure.appendChild(image);

    modalContent.appendChild(figure);
  });
};

const createFilter = (category) => {
  const button = document.createElement("button");

  button.textContent = category.name;

  button.addEventListener("click", () => {
    if (category.id === 0) {
      gallery.innerHTML = "";
      createWorks(works);
      return;
    }

    const filteredWorks = works.filter(
      (work) => work.categoryId === category.id
    );

    gallery.innerHTML = "";
    createWorks(filteredWorks);
  });

  filtres.appendChild(button);
};

const createFilters = (categories) => {
  createFilter({ id: 0, name: "Tous" });
  categories.forEach((category) => {
    createFilter(category);
  });
};

const init = async () => {
  await getWorks();
  await getCategories();
  createWorks(works);
  createModalWorks(works);
  createFilters(categories);
  deleteWork(works);
};

init();
//pour cacher mes projet une fois connecter
if (isAdmin !== null) {
  console.log("dans ces accolades, tu geres le mode admin");
  filtres.style.display = "none";
}

/*gestion supression img*/
const btnDelete = document.querySelector(".js-delete-work");
// Event listener sur les boutons supprimer par apport a leur id
function deleteWork() {
  let btnDelete = document.querySelectorAll(".js-delete-work");
  for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", deleteProjets);
  }
}

// Supprimer le projet
async function deleteProjets() {
  console.log("DEBUG DEBUT DE FUNCTION SUPRESSION");
  console.log(this.classList[0]);
  console.log(token);

  await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      console.log(response);
      // Token good
      if (response.status === 204) {
        console.log("DEBUG SUPPRESION DU PROJET " + this.classList[0]);
        refreshPage(this.classList[0]);
      }
      // Token inorrect
      else if (response.status === 401) {
        alert(
          "Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide"
        );
        window.location.href = "login.html";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Rafraichit les projets sans recharger la page
async function refreshPage(i) {
  modaleProjets(); // Re lance une génération des projets dans la modale admin

  // supprime le projet de la page d'accueil
  const projet = document.querySelector(`.js-projet-${i}`);
  projet.style.display = "none";
}


