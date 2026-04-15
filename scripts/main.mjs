import { getAPOD, getSunTimes, getMoonTimes, getGalleryImages, getVisibleTonight } from "./api.mjs";
import { renderAPOD, renderSunTimes, renderGallery, renderVisibleTonight, themeChange, menuToggle, initGlobalSearch } from "./ui.mjs";
import { getUserLocation } from "./location.mjs";
import { openModal, initModal } from "./modal.mjs";

async function init() {
    let lat, lng;
    themeChange();

    menuToggle();

    initGlobalSearch();

    const images = await getGalleryImages();
    renderGallery(images);

    document.querySelectorAll(".gallery-card").forEach((card, index) => {
        card.addEventListener("click", () => {
            openModal(images, index);
        });
    });

    const queries = ["galaxy", "nebula", "planet", "stars", "universe", "moon", "sun", "black hole", "supernova", "comet", "asteroid", "satellite", "space station", "cosmos", "quasar", "pulsar", "meteor", "eclipse", "aurora", "constellation", "dark matter", "exoplanet", "gravity", "light year", "wormhole", "multiverse", "dark energy", "event horizon", "singularity", "space-time", "interstellar", "galactic cluster", "red giant", "white dwarf", "neutron star", "hubble", "kepler", "spitzer", "james webb", "voyager", "cassini", "apollo", "sputnik", "iss"];

    const refreshBtn = document.getElementById("refresh-gallery");

    refreshBtn.addEventListener("click", async () => {
        refreshBtn.classList.add("spinning");

        const randomQuery =
            queries[Math.floor(Math.random() * queries.length)];

        const images = await getGalleryImages(randomQuery);
        renderGallery(images);

        document.querySelectorAll(".gallery-card").forEach((card, index) => {
            card.addEventListener("click", () => {
                openModal(images, index);
            });
        });

        setTimeout(() => {
            refreshBtn.classList.remove("spinning");
        }, 800);
    });

    
    const location = await getUserLocation();
    lat = location.lat;
    lng = location.lng;

    const sunData = await getSunTimes(lat, lng);
    const moonData = await getMoonTimes(lat, lng);

    renderSunTimes(sunData.results, moonData);

    try {
        const visible = await getVisibleTonight(lat, lng);
        renderVisibleTonight(visible);
    } catch (err) {
        console.warn("Visible tonight failed", err);
    }

    try {
        const apodData = await getAPOD();
        renderAPOD(apodData);
    } catch (err) {
        console.warn("APOD failed, skipping...", err);
    }
}

init();
initModal();