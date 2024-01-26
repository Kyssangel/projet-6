const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const modalContent = document.querySelector(".modal-content");
const photoForm = document.querySelector(".ajout-photo");
// Récupérer l'élément span avec la classe "édition"
const editionSpan = document.querySelector(".édition");
const modifierBtn = document.getElementById("modifier-btn")

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
    const bouton = document.createElement("button");

    image.src = work.imageUrl;
    image.alt = work.title;

    bouton.classList.add("delete-button");

    bouton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

    bouton.addEventListener("click", () => {
      console.log("bouton suppression", work.id);
      deleteProjet(work.id);
    });

    figure.appendChild(image);
    figure.appendChild(bouton);

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
    btnDelete[i].addEventListener("click", deleteProjet);
  }
}

// Supprimer le projet
async function deleteProjet(id) {
  console.log("DEBUG DEBUT DE FUNCTION SUPRESSION");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${isAdmin}` },
  });

  if (response.status === 204) {
    console.log('ici on refait l"ui');
    updateUi();
  }

  if (!response.ok) {
    console.error(response);
  }
}

// Rafraichit les projets sans recharger la page
async function updateUi() {
  gallery.innerHTML = "";
  modalContent.innerHTML = "";
  await getWorks();
  createWorks(works);
  createModalWorks(works);
}

document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const imageContainer = document.querySelector(".ajout");

  fileInput.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
    // Afficher l'image sélectionnée
      displayImage(selectedFile);
    }
  });

  function displayImage(file) {
    // Crée un FileReader pour lire le fichier
    const reader = new FileReader();
    const existingImg = document.querySelector(".temp-img");
    if (existingImg) {
      existingImg.remove();
    }

   // Définir un rappel lorsque le fichier est chargé
    reader.onload = function (e) {
     // Crée un élément d'image et définit sa source sur les données chargées
      const image = document.createElement("img");
      image.src = e.target.result;
      image.classList.add("temp-img");

      // Ajoute l'image au conteneur d'images
      imageContainer.appendChild(image);
    };

   // Lit le fichier en tant qu'URL de données (cela déclenchera le rappel onload)
    reader.readAsDataURL(file);
  }
});

const postWork = async (data) => {
  return await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${isAdmin}`,
    },
    body: data,
  });
};

photoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(photoForm);

  for (const [key, value] of data) {
    console.log(`${key}: ${value}\n`);
  }

  const response = await postWork(data);
  console.log(response);

  if (response.status === 201) {
    photoForm.reset();
  }
  window.location.href = 'index.html';
});

/////////////

// Vérifier si l'utilisateur est connecté
if (isAdmin !== null) {
  console.log("affichage mode édition");
  editionSpan.style.display = "inline-block";

    console.log("affichage modifier");
  modifierBtn.style.display = "inline-block";
}
//changement login en logout

        // Récupérer l'élément li avec l'ID "loginLogout"
        const loginLogoutLi = document.getElementById('loginLogout');

        // Vérifier si l'utilisateur est connecté
        if (isAdmin !== null) {
            // Changer le texte de l'élément li en "Logout"
            loginLogoutLi.innerHTML = '<a href="#">Logout</a>';
        } else {
            // L'utilisateur n'est pas connecté, laisser le texte en "Login"
            loginLogoutLi.innerHTML = '<a href="login.html">Login</a>';
        }

    ///////////////
       
// deconnection link logout

const logout = async () => {
  try {
    // Appel à votre endpoint de déconnexion côté serveur
    const response = await fetch("http://localhost:5678/api/users/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    // Réinitialiser le token côté client
    sessionStorage.removeItem("token");

    // Rediriger l'utilisateur vers la page de connexion
    window.location.href = 'login.html';
  } catch (error) {
    console.error("Une erreur s'est produite lors de la déconnexion :", error);
  }
};

// Ajoutez cet événement sur le lien de déconnexion
const logoutlink = document.getElementById("loginLogout"); 
logoutlink.addEventListener("click", logout);

///////
 