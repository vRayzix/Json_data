const liste_site = [
    { "nom": "Deezer", "url": "https://www.deezer.com/fr/", "url_image": "https://i.ibb.co/fQHhJn0/Deezer.png" },
    { "nom": "Netflix", "url": "https://www.netflix.com/", "url_image": "https://i.ibb.co/TPd27kq/Netflix.png" }, // Comma added here
    { "nom": "Apple", "url": "https://www.apple.com/fr/", "url_image": "https://i.ibb.co/nb9RqWG/Apple.png" },
    { "nom": "UHA", "url": "https://e-services.uha.fr/fr/index.html", "url_image": "https://i.ibb.co/bFQMLHZ/UHA.png" },
    { "nom": "CodePen", "url": "https://codepen.io/", "url_image": "https://i.ibb.co/Y7ZC6LV/Code-Pen-io.png" },
    { "nom": "ImgBB", "url": "https://imgbb.com/", "url_image": "https://i.ibb.co/FnL82vF/Ibb.png" },
    { "nom": "Gmap", "url": "https://www.google.com/maps/", "url_image": "https://i.ibb.co/nrqpbMD/Gmap.png" },
    { "nom": "Wiki", "url": "https://fr.wikipedia.org/wiki/Wiki", "url_image": "https://i.ibb.co/Dk4HhMC/Wiki.png" }
];

const flexConteneur = document.getElementById("conteneur_flex");
liste_site.forEach((site) => {
    const flexItem = document.createElement("figure");
    flexItem.classList.add("f_item");
    flexItem.innerHTML = `
    <a href="${site.url}" class="info_bulle">
        <img src="${site.url_image}" alt="${site.nom}">
        <span class="ib-text">${site.nom}</span>
    </a>`;
    flexConteneur.appendChild(flexItem);
});
