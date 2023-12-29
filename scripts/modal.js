let modal = null
const focusableSelector = "button,a"
let focusables = []

const openModal = function (e) {
  if (modal) {
    closeModal(e)
    modal = null;
  }
  if (!modal) {
  e.preventDefault()
  modal = document.querySelector(e.target.getAttribute("href"))
  focusables = Array.from(modal.querySelectorAll(focusableSelector))
  modal.style.display = null
  modal.removeAttribute("aria-hidden")
  modal.setAttribute("aria-modal", "true")

  modal.addEventListener("click", closeModal)
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation)
  }
}

const closeModal = function (e) {
  
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")
  modal.removeEventListener("click", closeModal)
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal)
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}
const focusInModal = function (e) {
  e.preventDefault()
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"))
  index++
  if (index >= focusables.length){
    index = 0
  }
  focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key == "esc") {
    closeModal(e)
  }
  if (e.key === "tab" && modal !== null) {
    focusInModal(e)
  }
})
