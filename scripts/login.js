const form = document.querySelector(".form");
const baliseEmail = document.getElementById("mail");
const balisePassword = document.getElementById("pass");
const errorElement = document.querySelector(".error-message");

//si la champs et vide,balise prendre class list erreur
function verifierChamp(balise) {
  if (balise.value === "") {
    balise.classList.add("error");
    displayErrorElement("Un mot de passe est requis");
    return false;
  } else {
    balise.classList.remove("error");
    return true;
  }
}

const displayErrorElement = (text) => {
  errorElement.style.display = "block";
  errorElement.textContent = text;
  setTimeout(() => {
    errorElement.style.display = "none";
    errorElement.textContent = "";
  }, 5000);
};

//vérifier la valeur de balise et bonne ,sinon class erreur
function verifierEmail(balise) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (emailRegExp.test(balise.value)) {
    console.log("ok");
    balise.classList.remove("error");
    return true;
  } else {
    balise.classList.add("error");
    console.log("ko");
    displayErrorElement("Une adresse email valide est requise.");
    return false;
  }
}

const login = async (data) => {
  return await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

//vérifier champs
balisePassword.addEventListener("change", () => {
  verifierChamp(balisePassword);
});

baliseEmail.addEventListener("change", () => {
  verifierChamp(baliseEmail);
});
//récuperer les évenement submit,éviter chargement de la page 
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const validatedEmail = verifierEmail(baliseEmail);
  const validatedPassword = verifierChamp(balisePassword);

  if (!validatedEmail || !validatedPassword) return;

  const data = {
    email: baliseEmail.value,
    password: balisePassword.value,
  };

  const response = await login(data);
  console.log(response);

  if (response.status === 404 || response.status === 401) {
    console.log("gerer erreur dans ce if");
  }

  if (response.status === 200) {
    const token = await response.json();
    console.log(token.token);
    sessionStorage.setItem("token", token.token);
    window.location.assign('/')
  }
});


