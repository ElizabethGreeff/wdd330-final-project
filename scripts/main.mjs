import { getAPOD, getSunTimes, getMoonTimes, getGalleryImages } from "./api.mjs";
import { renderAPOD, renderSunTimes, renderGallery } from "./ui.mjs";
import { getUserLocation } from "./location.mjs";
import { openModal, initModal } from "./modal.mjs";

let apodData;

async function init() {
    try {
        try {
            const apodData = await getAPOD();
            renderAPOD(apodData);
        } catch (err) {
            console.warn("APOD failed, skipping...", err);
        }

        document.getElementById("apod-container").addEventListener("click", () => {
            openModal(apodData);
        });

        const { lat, lng } = await getUserLocation();

        const sunData = await getSunTimes(lat, lng);
        const moonData = await getMoonTimes(lat, lng);

        renderSunTimes(sunData.results, moonData);

    } catch (error) {
        console.error("INIT ERROR:", error);
    }

    const images = await getGalleryImages();
    renderGallery(images);

    const queries = ["galaxy", "nebula", "planet", "stars", "universe"];

    document.getElementById("refresh-gallery")
        .addEventListener("click", async () => {
            const randomQuery =
                queries[Math.floor(Math.random() * queries.length)];

            const images = await getGalleryImages(randomQuery);
            renderGallery(images);
        });
}

init();
initModal();