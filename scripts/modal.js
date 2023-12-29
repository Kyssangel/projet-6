let modal = null
const focusableSelector = 'button,a'
let focusables = []

const openModal = function (e) {
  e.preventDefault()
  modal = document.querySelector(e.target.getAttribute('href'))
  focusables = Array.from(modal.querySelectorAll(focusableSelector))
  modal.style.display = null;
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventlistener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventlistener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventlistener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}
const focusInModal = function (e) {
  e.preventDefault()
let index = focusables.findIndex(modal.querySelector(':focus'))
}


document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
  })

window.addEventListener('keydown', function (e){
  if (e.key ==="Escape" || e.key =="esc") {
    closeModal(e)
  }
  if (e.key === 'tab' && modal !== null) {
    this.focus.InModal(e)
  }
})



