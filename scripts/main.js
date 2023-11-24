const gallery = document.querySelector('.gallery')

fetch('http://localhost:5678/api/works').then(response => response.json()).then(data =>createWorks(data))

const createWorks = (works) => {
    works.forEach(work => {
        const figure = document.createElement('figure')
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')

        image.src  = work.imageUrl;
        image.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(image)
        figure.appendChild(figcaption)

        gallery.appendChild(figure)
    });
}

// .classList   - .add()   - .remove()
