import { openModal, initModal } from "./modal.mjs";
import { menuToggle, themeChange, initGlobalSearch, getFavorites, saveFavorites } from "./ui.mjs";

//create all functions related to the search page here, then call an init function at the end to run them

async function fetchImages(query = "space") {
    const res = await fetch(
        `https://images-api.nasa.gov/search?q=${query}&media_type=image`
    );
    const data = await res.json();

    return data.collection.items.slice(0, 35);
}

function getQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
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
        card.addEventListener("click", () => openModal(images, i));
    });
}

async function loadImages(query) {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    try {
        const images = await fetchImages(query);
        render(images);
    } catch (err) {
        console.error("Search failed:", err);
        document.getElementById("search-results").innerHTML =
            "<p>Failed to load images, please reload the page</p>";
    } finally {
        loader.classList.add("hidden");
    }
}

function init() {
    menuToggle();
    themeChange();
    initGlobalSearch();

    document.getElementById("search-btn").onclick = () => {
        const input = document.getElementById("search-input").value;
        const filter = document.getElementById("search-filter").value;

        const query = `${input} ${filter}`.trim();

        loadImages(query);
    };

    window.addEventListener("DOMContentLoaded", () => {
        initModal();
        const query = getQueryFromURL() || "space";
        loadImages(query);
    });
}

init();