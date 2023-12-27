const form = document.querySelector(".form");
const baliseEmail = document.getElementById("mail");
const balisePasseword = document.getElementById("pass");
const errorElement  =document.querySelector('.error-message')

function verifierChamp(balise) {
  if (balise.value === "") {
    balise.classList.add("error");
    displayErrorElement('Un mot de passe est requis')
    return false
  } else {
    balise.classList.remove("error");
    return true
  }
}

const displayErrorElement = (text) => {
    errorElement.style.display = 'block'
    errorElement.textContent = text
    setTimeout(() => {
        errorElement.style.display = 'none'
        errorElement.textContent = ""
    }, 5000)

}

function verifierEmail(balise) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+.[a-z0-9._-]+");
  if (emailRegExp.test(balise.value)) {
    console.log("ok");
    balise.classList.remove("error");
    return true
  } else {
    balise.classList.add("error");
    console.log("ko");
    displayErrorElement('Une adresse email valide est requise.')
    return false
  }
}

const login = async (data) => {

    return await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

balisePasseword.addEventListener("change", () => {
  verifierChamp(balisePasseword);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const validatedEmail = verifierEmail(baliseEmail)
  const validatedPassword = verifierChamp(balisePasseword);

  if (!validatedEmail || !validatedPassword) return

 const data = {
    email: baliseEmail.value,
    password:balisePasseword.value,
 }


 const response = await login(data)
 console.log(response)

 if (response.status === 404 || response.status === 401) {
    console.log('gerer erreur dans ce if')
 }

 if (response.status === 200) {

     const token = await response.json()
     console.log(token.token)
     sessionStorage.setItem('token', token.token)
     window.location.href = "index.html"
 }

});
