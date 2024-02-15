const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const modalContent = document.querySelector(".modal-content");
const photoForm = document.querySelector(".ajout-photo");
const editionSpan = document.querySelector(".édition");
const modifierBtn = document.getElementById("modifier-btn");

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
  gallery.innerHTML = "";
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
  modalContent.innerHTML = "";
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
      createWorks(works);
    } else {
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id
      );
      createWorks(filteredWorks);
    }
  });

  filtres.appendChild(button);
};

const createFilters = () => {
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
  createFilters();
};

init();

if (isAdmin !== null) {
  const filtresElement = document.querySelector(".filtres");
  if (filtresElement) {
    filtresElement.classList.add("hidden");
  }
}
async function deleteProjet(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${isAdmin}` },
  });

  if (response.status === 204) {
    console.log("Suppression réussie");
    updateUi();
  } else {
    console.error(response);
  }
}

async function updateUi() {
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
      displayImage(selectedFile);
    }
  });

  function displayImage(file) {
    const reader = new FileReader();
    const existingImg = document.querySelector(".temp-img");
    if (existingImg) {
      existingImg.remove();
    }

    reader.onload = function (e) {
      const image = document.createElement("img");
      image.src = e.target.result;
      image.classList.add("temp-img");

      imageContainer.appendChild(image);
    };

    reader.readAsDataURL(file);
  }

  const modalCloseButton2 = document.querySelector("#modal2 .js-modal-close");
  const modalLeftLink2 = document.querySelector("#modal2 .js-modal.left");

  modalCloseButton2.addEventListener("click", function () {
    clearSelectedImage();
  });

  modalLeftLink2.addEventListener("click", function () {
    clearSelectedImage();
  });

  function clearSelectedImage() {
    const existingImg = document.querySelector(".temp-img");
    if (existingImg) {
      existingImg.remove();
      fileInput.value = null;
    }
  }
});

const postWork = async (data) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${isAdmin}`,
    },
    body: data,
  });

  return response;
};

const updateProjects = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  gallery.innerHTML = "";
  modalContent.innerHTML = "";
  createWorks(works);
  createModalWorks(works);

  const existingImg = document.querySelector(".temp-img");
  if (existingImg) {
    existingImg.remove();
  }
};

photoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(photoForm);

  const response = await postWork(data);
  console.log(response);

  if (response.status === 201) {
    photoForm.reset();
    await updateProjects();
  }
});

if (isAdmin !== null) {
  editionSpan.style.display = "inline-block";
  modifierBtn.style.display = "inline-block";
}

const loginLogoutLi = document.getElementById("loginLogout");

if (isAdmin !== null) {
  loginLogoutLi.innerHTML = '<a href="#">Logout</a>';
} else {
  loginLogoutLi.innerHTML = '<a href="login.html">Login</a>';
}

const logout = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/users/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    sessionStorage.removeItem("token");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Une erreur s'est produite lors de la déconnexion :", error);
  }
};

const logoutlink = document.getElementById("loginLogout");
logoutlink.addEventListener("click", logout);
