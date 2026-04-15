import { openModal, initModal } from "./modal.mjs";
import { menuToggle, themeChange, initGlobalSearch, getFavorites, saveFavorites } from "./ui.mjs";

// Create all functions related to the favorites page here, then call an init function at the end to run them
function renderFavorites() {
    const container = document.getElementById("favorites-gallery");
    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet, go search for some!</p>";
        return;
    }

    container.innerHTML = favorites.map((item, i) => {
        const img = item.links?.[0]?.href;
        const title = item.data?.[0]?.title;

        return `
            <div class="gallery-card">
                <img src="${img}">
                <p>${title}</p>
                <button class="remove-btn" data-index="${i}">✖</button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            removeFavorite(btn.dataset.index);
        });
    });

    document.querySelectorAll(".gallery-card").forEach((card, i) => {
        card.addEventListener("click", () => {
            const favorites = getFavorites();
            openModal(favorites[i], favorites, i);
        });
    });
}

function removeFavorite(index) {
    let favs = getFavorites();
    favs.splice(index, 1);
    saveFavorites(favs);
    renderFavorites();
}

function init() {
    // Render favorites section
    renderFavorites();
    initModal();
    menuToggle();
    themeChange();
    initGlobalSearch();
}

init();