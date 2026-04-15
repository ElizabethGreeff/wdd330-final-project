export async function renderAPOD(data) {
  const container = document.getElementById("apod-container");

  if (!container) return;

  container.innerHTML = `
        <div class="apod-card-inner">
            <div class="apod-image">
                ${data.media_type === "image"
      ? `<img src="${data.url}" alt="${data.title}" />`
      : `<iframe src="${data.url}" frameborder="0"></iframe>`
    }
            </div>
            <div class="apod-content">
                <h3 class="apod-title">${data.title}</h3>
                <p class="apod-date">${data.date}</p>

                <p class="apod-description">
                    ${data.explanation.substring(0, 200)}...
                </p>
            </div>
        </div>
    `;
    const btn = container.querySelector(".apod-btn");
}

export function renderSunTimes(sunData, moonData) {
    const formatTime = (time) =>
        new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.querySelector(".sunrise").textContent =
        formatTime(sunData.sunrise);

    document.querySelector(".sunset").textContent =
        formatTime(sunData.sunset);

    document.querySelector(".moonrise").textContent = moonData.moonrise;
    document.querySelector(".moonset").textContent = moonData.moonset;
}

export function renderGallery(images) {
    const container = document.getElementById("gallery");
    const favorites = getFavorites();

    container.innerHTML = images.map((item, index) => {
        const img = item.links?.[0]?.href;
        const title = item.data?.[0]?.title;
        const isFav = favorites.some(f => f.links?.[0]?.href === img);

        return `
            <div class="gallery-card">
                <img src="${img}" alt="${title}">
                <p>${title}</p>
                <button class="fav-btn" data-index="${index}">
                    ${isFav ? "★" : "☆"}
                </button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            toggleFavorite(images[i], btn);
        });
    });
}

function getVisibilityLabel(altitude) {
    if (altitude > 60) return "Excellent";
    if (altitude > 30) return "Good";
    if (altitude > 10) return "Low";
    return "Not visible";
}

export function renderVisibleTonight(data) {
    const container = document.getElementById("visible-content");

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const scored = data.map(item => {
        const name = item.entry.name;
        const altitude =
            item.cells[0].position?.horizontal?.altitude?.degrees || 0;
        const magnitude =
            item.cells[0].extraInfo?.magnitude ?? 10;
        const brightnessScore = 10 - magnitude;
        const altitudeScore = altitude / 10;
        const score = brightnessScore + altitudeScore;
        const visibility = getVisibilityLabel(altitude);

        return {
            name,
            altitude,
            magnitude,
            score,
            visibility
        };
    });
    scored.sort((a, b) => b.score - a.score);
    const topThree = scored.slice(0, 3);

    container.innerHTML = topThree.map((item, i) => {
        return `
            <div class="visible-card ${i === 0 ? "highlight" : ""}">
                <h4>${item.name}</h4>
                <p>Altitude: ${Math.round(item.altitude)}°</p>
                <p>Magnitude: ${item.magnitude}</p>
                <p>${item.visibility}</p>
            </div>
        `;
    }).join("");
}

function toggleFavorite(item, button) {
    let favorites = getFavorites();
    const img = item.links?.[0]?.href;

    const exists = favorites.find(f => f.links?.[0]?.href === img);

    if (exists) {
        favorites = favorites.filter(f => f.links?.[0]?.href !== img);
        button.textContent = "☆";
    } else {
        favorites.push(item);
        button.textContent = "★";
    }

    saveFavorites(favorites);
}

//Stuff for other/all pages

// Theme toggle functionality
export function themeChange() {
    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light");

            themeToggle.textContent =
                document.body.classList.contains("light") ? "☾" : "☼";
        });
    }
}

// Menu toggle functionality
export function menuToggle() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("side-menu");
    const closeBtn = document.getElementById("close-menu");

    toggle?.addEventListener("click", () => {
        menu.classList.add("open");
    });

    closeBtn?.addEventListener("click", () => {
        menu.classList.remove("open");
    });
}    

// Global search functionality
export function initGlobalSearch() {
    const input = document.getElementById("global-search");
    const button = document.getElementById("global-search-btn");

    function runSearch() {
        const query = input.value;
        if (!query) return;

        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }

    if (button) {
        button.addEventListener("click", runSearch);
    }

    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                runSearch();
            }
        });
    }
}

//Favorite functionality for APOD and gallery

export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}