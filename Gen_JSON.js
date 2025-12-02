// Configuration des paramètres GitHub
const url_github_json_raw = "";
const token_perso_github = "";
const nom_utilisateur_github = "";
const nom_repo_github = "";
const chemin_fichier_dans_repo = "";

// Variables globales
let liste_site = [];
let boutons = null;
let repo_sha = "";

// Fonction pour rafraîchir la page
function refreshPage() {
	purgePage();
	const flexConteneur = document.getElementById("conteneur_flex");

	liste_site.forEach((site, index) => {
		const flexItem = document.createElement("section");
		flexItem.classList.add("flex_item");
		flexItem.id = `sect_f_item${index + 1}`;

		flexItem.innerHTML = `
            <form>
                <div class="div_bp">
                    <input id="bp_up${index + 1}" class="bp" type="button" value="&#8593" title="Monter...">
                    <input id="bp_down${index + 1}" class="bp" type="button" value="&#8595" title="Descendre...">
                </div>
                <div class="div_nom">
                    <label for="nom${index + 1}">Nom </label>
                    <input id="nom${index + 1}" class="input_nom" type="text" value="${site.nom}" title="Nom du site...">
                </div>
                <div class="div_url">
                    <label for="url${index + 1}">Url </label>
                    <input id="url${index + 1}" class="input_url" type="url" value="${site.url}" title="URL du site...">
                </div>
                <div class="div_url_image">
                    <label for="url_img${index + 1}">Logo </label>
                    <input id="url_img${index + 1}" class="input_url_image" type="url" value="${site.url_image}" title="Logo du site...">
				</div>
                <div class="select_input">
                    <label for="select_img${index + 1}" class="select_image">...</label>
                    <input id="select_img${index + 1}" class="input_select_image" type="file" accept=".png, .jpg">
				</div>
                <input id="bp_poubelle${index + 1}" class="bp" type="button" value="&#128465" title="Supprimer...">
            </form>
        `;

		flexConteneur.appendChild(flexItem);
		// Gestion de la mise à jour du nom de fichier
        const fileInput = document.getElementById(`select_img${index + 1}`);
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                const fileName = "./Images/"+fileInput.files[0].name;
                const urlInput = document.getElementById(`url_img${index + 1}`);
                urlInput.value = fileName; // Met à jour l'URL avec le nom du fichier sélectionné
            }
        });
	});

	const flexItem = document.createElement("section");
	flexItem.classList.add("flex_item");
	flexItem.innerHTML = `
        <form>
            <input id="bp_plus" class="bp" type="button" value="+">
            <input id="bp_refresh" class="bp" type="button" value="Export en JSON">
        </form>`;
	flexConteneur.appendChild(flexItem);

	boutons = document.querySelectorAll(".bp", ".select_image");
	boutons.forEach((bouton) => {
		bouton.addEventListener("click", checkClick);
	});
}

// Supprimer les éléments existants
function purgePage() {
	document
		.querySelectorAll(".flex_item")
		.forEach((flexItem) => flexItem.remove());
}

// Fonction pour gérer les clics sur les boutons
function checkClick(event) {
	const id = event.target.id;

	if (id === "bp_refresh") {
		form2tab();
		exportGitHub();
	} else if (id === "bp_plus") {
		liste_site.push({ nom: "", url: "", url_image: "" });
		refreshPage();
	} else if (id.startsWith("bp_up")) {
		const index = Number(id.slice(5)) - 1;
		switchLigne(index, index - 1);
	} else if (id.startsWith("bp_down")) {
		const index = Number(id.slice(7)) - 1;
		switchLigne(index, index + 1);
	} else if (id.startsWith("bp_poubelle")) {
		const index = Number(id.slice(11)) - 1;
		liste_site.splice(index, 1);
	}
	refreshPage();
}

// Fonction pour gérer la sélection de fichiers
function fileSelect(callback) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png, .jpg";

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (callback) callback(file);
        }
    });

    fileInput.click();
}

// Fonction pour échanger deux lignes
function switchLigne(pos1, pos2) {
	[liste_site[pos1], liste_site[pos2]] = [liste_site[pos2], liste_site[pos1]];
}

// Mettre à jour la liste à partir du formulaire
function form2tab() {
	liste_site = liste_site.map((site, index) => ({
		nom: document.getElementById(`nom${index + 1}`).value,
		url: document.getElementById(`url${index + 1}`).value,
		url_image: document.getElementById(`url_img${index + 1}`).value
	}));
}

// Exporter vers GitHub
async function exportGitHub() {
	try {
		// Encoder les données en Base64
		const encodedContent = btoa(JSON.stringify(liste_site));

		// Requête PUT pour mettre à jour le fichier
		const response = await fetch(`https://api.github.com/repos/${nom_utilisateur_github}/${nom_repo_github}/contents/${chemin_fichier_dans_repo}`, {
			method: 'PUT',
			headers: {
				"Authorization": `token ${token_perso_github}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "Mise à jour des données de la liste des sites",
				content: encodedContent,
				sha: repo_sha,
			})
		});
		const data = await response.json();

		if (response.ok) {
			alert("Fichier mis à jour avec succès :", data);
			repo_sha = data.content.sha; // Mettre à jour le SHA
		} else {
			console.error("Erreur lors de la mise à jour :", data);
		}
	} catch (error) {
		console.error("Erreur lors de la mise à jour :", error);
	}
}

// Fonction pour récupérer les données
async function fetchRepoContents() {
	try {
		const response = await fetch(`https://api.github.com/repos/${nom_utilisateur_github}/${nom_repo_github}/contents/${chemin_fichier_dans_repo}`, {
			headers: {
				"Authorization": `token ${token_perso_github}`,
				"Accept": "application/vnd.github.v3+json"
			}
		});
		const data = await response.json();

		if (data.sha) {
			repo_sha = data.sha; // Récupérer le SHA du fichier

			// Requête pour obtenir le contenu du fichier (en base64)
			const fileContent = await fetch(`https://api.github.com/repos/${nom_utilisateur_github}/${nom_repo_github}/contents/${chemin_fichier_dans_repo}`, {
				headers: {
					"Authorization": `token ${token_perso_github}`,
					"Accept": "application/vnd.github.v3+json"
				}
			});
			const fileData = await fileContent.json();

			// Décoder le contenu base64 en texte brut
			const decodedContent = atob(fileData.content);

			// Analyser le contenu JSON et récupération des données
			try {
				const jsonData = JSON.parse(decodedContent);
				liste_site = jsonData; // Assignement du tableau JSON
			} catch (jsonError) {
				console.error("Erreur lors de l'analyse du JSON :", jsonError);
			}
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des données :", error);
	}
}

// Appel initial
const inputLienGitHub = document.getElementById("github");
inputLienGitHub.value = url_github_json_raw;
const inputUserGitHub = document.getElementById("user_github");
inputUserGitHub.value = nom_utilisateur_github;
const inputRepoGitHub = document.getElementById("repo_github");
inputRepoGitHub.value = nom_repo_github;
const inputPathGitHub = document.getElementById("path_github");
inputPathGitHub.value = chemin_fichier_dans_repo;
const inputTokenGitHub = document.getElementById("token_github");
inputTokenGitHub.value = token_perso_github;

if (
	url_github_json_raw != "" &&
	nom_utilisateur_github != "" &&
	nom_repo_github != "" &&
	chemin_fichier_dans_repo != "" &&
	token_perso_github != ""
) {
	const divNoteInfo = document.getElementById("note_info");
	divNoteInfo.style.visibility = "hidden";
	fetchRepoContents().then(refreshPage);
} else {
	const divNoteInfo = document.getElementById("note_info");
	divNoteInfo.style.visibility = "visible";
}
