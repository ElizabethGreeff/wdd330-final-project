function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function renderAPOD(data) {
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

                <button class="apod-btn">Add to Favorites</button>
            </div>

        </div>
    `;
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