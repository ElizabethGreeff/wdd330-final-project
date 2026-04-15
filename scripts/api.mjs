export async function getAPOD() {
    const API_KEY = "JYghugWaXsqKBKTGFVUNmOUbkDI05cdCwhRF4cj2";

    for (let i = 1; i <= 3; i++) {
        try {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const formatted = date.toISOString().split("T")[0];

            const response = await fetch(
                `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formatted}`
            );

            if (!response.ok) continue;

            return await response.json();

        } catch (err) {
            console.warn("Retrying APOD...");
        }
    }

    return {
        title: "Fallback Space Image",
        date: "--/--/----",
        explanation: "NASA API is being moody today so here's a backup image :)",
        url: "https://images-assets.nasa.gov/image/PIA12235/PIA12235~orig.jpg",
        media_type: "image"
    };
    
}

export async function getSunTimes(lat, lng) {
    const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch sun times");
    }

    return await response.json();
}

export async function getMoonTimes(lat, lng) {
    const API_KEY = "1b28878e400d486ab66152827260804";

    const response = await fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${lat},${lng}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch moon data");
    }

    const data = await response.json();
    return data.astronomy.astro;
}

export async function getGalleryImages(query = "galaxy") {
    const response = await fetch(
        `https://images-api.nasa.gov/search?q=${query}&media_type=image`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch gallery images");
    }

    const data = await response.json();

    return data.collection.items.slice(0, 6);
}

const ASTRONOMY_ID = "6d80ecc4-fe31-476f-aadc-825b7f90cad4";
const ASTRONOMY_SECRET = "95db691b25a04d9a0e8a0cac58ac49617b3aaf58dc05e9d77c59f535f649b112746d6d360a28abd371a2e9c7e20b7f15bac81bdceea6d45e4ceb64ba9005aa78a354324f03eab9cd1aa6b365e87e098e3f5ff36883c5b3701ba1f3f181bfe8d32846d1026ab4b41a05d3189073018fcb";

function getAuthHeader() {
    return "Basic " + btoa(`${ASTRONOMY_ID}:${ASTRONOMY_SECRET}`);
}

export async function getVisibleTonight(lat, lng) {
    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(
        `https://api.astronomyapi.com/api/v2/bodies/positions?latitude=${lat}&longitude=${lng}&from_date=${today}&to_date=${today}&time=22:00:00&elevation=0`,
        {
            headers: {
                Authorization: getAuthHeader()
            }
        }
    );

    if (!res.ok) {
        console.error("Astronomy API error:", res.status);
        throw new Error("Failed to fetch visible objects");
    }

    const data = await res.json();

    return data?.data?.table?.rows || [];
}