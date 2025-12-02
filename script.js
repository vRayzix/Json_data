fetch('https://raw.githubusercontent.com/vRayzix/Json_data/refs/heads/main/data_page_accueil.json')
.then((response) => response.json())
.then((liste_site) => {
const flexContainer = document.getElementById("conteneur_flex");
liste_site.forEach((site) => {
const flexItem = document.createElement("figure");
flexItem.classList.add("f_item");
flexItem.innerHTML = `
<a href="${site.url}" class="info_bulle">
<img src="${site.url_image}">
<span class="ib_text">${site.nom}</span>
</a>
`;
flexContainer.appendChild(flexItem);
});
})
.catch((error) => alert("Erreur lors du chargement des données JSON :", error)
);
