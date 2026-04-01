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