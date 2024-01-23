const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const modalContent = document.querySelector(".modal-content");
const photoForm = document.querySelector('.ajout-photo')

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


document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const imageContainer = document.querySelector('.ajout');

  fileInput.addEventListener('change', function (event) {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
          // Display the selected image
          displayImage(selectedFile);
      }
  });

  function displayImage(file) {
      // Create a FileReader to read the file
      const reader = new FileReader();
      const existingImg = document.querySelector('.temp-img')
      if (existingImg) {
        existingImg.remove()
      }

      // Define a callback for when the file is loaded
      reader.onload = function (e) {
          // Create an image element and set its source to the loaded data
          const image = document.createElement('img');
          image.src = e.target.result;
          image.classList.add('temp-img')

          // Append the image to the image container
          imageContainer.appendChild(image);
      };

      // Read the file as a data URL (this will trigger the onload callback)
      reader.readAsDataURL(file);
  }
});

const postWork = async(data) => {
  return await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${isAdmin}`,
    },
    body: data,
  })
}

photoForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = new FormData(photoForm)

  for (const [key, value] of data) {
    console.log(`${key}: ${value}\n`);
  }
  
  const response = await postWork(data)
  console.log(response)

  if (response.status === 201) {
    photoForm.reset()
    
  }
  window.location.href = '/index.html';
})

const isLoggedIn = true; // Mettez la valeur appropriée selon votre logique de connexion.

const estConnecte = true; // Remplacez ceci par votre logique de vérification de connexion.

document.addEventListener('DOMContentLoaded', function () {
  const modifierBtn = document.getElementById('modifier-btn');

  // Vérifie si l'utilisateur est connecté
  if (estConnecte) {
    // Affiche le lien une fois connecté
    modifierBtn.style.display = 'inline-block';
  }
});
const édite = true; // Remplacez ceci par votre logique de vérification de connexion.

document.addEventListener('DOMContentLoaded', function () {
  const editionSpan = document.querySelector('.édition');

  // Vérifie si l'utilisateur est connecté
  if (édite) {
    // Affiche le span une fois connecté
    editionSpan.style.display = 'inline';
  }
});