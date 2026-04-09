import { openModal, initModal } from "./modal.mjs";

async function fetchImages(query = "space") {
    const res = await fetch(
        `https://images-api.nasa.gov/search?q=${query}&media_type=image`
    );
    const data = await res.json();

    return data.collection.items.slice(0, 25);
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

function toggleFavorite(item, button) {
    let favs = getFavorites();
    const img = item.links?.[0]?.href;

    const exists = favs.find(f => f.links?.[0]?.href === img);

    if (exists) {
        favs = favs.filter(f => f.links?.[0]?.href !== img);
        button.textContent = "☆";
    } else {
        favs.push(item);
        button.textContent = "★";
    }

    saveFavorites(favs);
}

function render(images) {
    const container = document.getElementById("search-results");
    const favorites = getFavorites();

    container.innerHTML = images.map((item, i) => {
        const img = item.links?.[0]?.href;
        const title = item.data?.[0]?.title;

        const isFav = favorites.some(f => f.links?.[0]?.href === img);

        return `
            <div class="gallery-card" data-index="${i}">
                <img src="${img}">
                <p>${title}</p>

                <button class="fav-btn" data-index="${i}">
                    ${isFav ? "★" : "☆"}
                </button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            const i = btn.dataset.index;
            toggleFavorite(images[i], btn);
        });
    });

    document.querySelectorAll(".gallery-card").forEach((card, i) => {
        card.addEventListener("click", () => openModal(images[i]));
    });
}

document.getElementById("search-btn").onclick = () => {
    const input = document.getElementById("search-input").value;
    const filter = document.getElementById("search-filter").value;

    const query = `${input} ${filter}`.trim();

    loadImages(query);
};

async function loadImages(query) {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const images = await fetchImages(query);

    loader.classList.add("hidden");

    render(images);
}

window.addEventListener("DOMContentLoaded", () => {
    initModal();
    loadImages("space");
});

