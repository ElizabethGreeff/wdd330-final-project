let currentIndex = 0;
let currentList = [];
let startX = 0;
let endX = 0;

export function initModal() {
    const modal = document.getElementById("modal");

    modal.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    modal.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    document.getElementById("close-modal").onclick = closeModal;

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.getElementById("next-btn").onclick = () => changeSlide(1);
    document.getElementById("prev-btn").onclick = () => changeSlide(-1);

    document.addEventListener("keydown", (e) => {
        if (modal.classList.contains("hidden")) return;

        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") changeSlide(1);
        if (e.key === "ArrowLeft") changeSlide(-1);
    });
}

export function openModal(item, list = [item], index = 0) {
    currentList = list;
    currentIndex = index;

    updateModal();

    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");

    setTimeout(() => modal.classList.add("show"), 10);
}

function updateModal() {
    const item = currentList[currentIndex];

    document.getElementById("modal-img").src =
        item.links?.[0]?.href || item.url;

    document.getElementById("modal-title").textContent =
        item.data?.[0]?.title || item.title;

    document.getElementById("modal-desc").textContent =
        item.data?.[0]?.description || item.explanation || "";
}

function changeSlide(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = currentList.length - 1;
    if (currentIndex >= currentList.length) currentIndex = 0;

    updateModal();
}

function handleSwipe() {
    const threshold = 50;

    if (startX - endX > threshold) {
        changeSlide(1); 
    } else if (endX - startX > threshold) {
        changeSlide(-1); 
    }
}


export function closeModal() {
    const modal = document.getElementById("modal");

    modal.classList.remove("show");

    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}