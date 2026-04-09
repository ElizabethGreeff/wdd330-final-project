import { openModal, initModal } from "./modal.mjs";

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

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

renderFavorites();
initModal();