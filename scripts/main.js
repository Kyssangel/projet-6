const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");

let works = [];
let categories = [];
let isAdmin = sessionStorage.getItem('token')


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
  createFilters(categories);
};

init();
//pour cacher mes projet une fois connecter
if (isAdmin !== null) {
  console.log('dans ces accolades, tu geres le mode admin')
  filtres.style.display = 'none';
}

