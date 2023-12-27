const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");

let works = [];
let categories = [];

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

/*let attempt = 3; 
function validate(){
const Email = document.getElementById("mail");
const password = document.getElementById("pass");

if ( Email == "Formget" && password == "formget#123"){
alert ("Login successfully");
window.location = "success.html"; 
return false;
}

else{
attempt --;
alert("You have left "+attempt+" attempt;");

if( attempt == 0){
document.getElementById("mail").disabled = true;
document.getElementById("pass").disabled = true;
document.getElementById("submit").disabled = true;
return false;
console.log(Email);
}
}
}*/

/*
function validateLogin() {
 
 const Email = document.querySelector(".place").value;
  const password = document.getElementById("pass").value;

  
  if (Email === "" || password === "") {
      alert("Veuillez remplir tous les champs.");
  } else {
      
      alert("Connexion réussie pour l'utilisateur : " + Email);
      
  }
}*/

/*const form = document.querySelector('form');

// Quand on submit
form.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    console.log("Il n’y a pas eu de rechargement de page");


       // On récupère les deux champs et on affiche leur valeur
       const password = document.getElementById("pass").value;
       const email = document.getElementById("mail").value;
       console.log(password);
       console.log(email);
   });*/

/* [a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+*/

