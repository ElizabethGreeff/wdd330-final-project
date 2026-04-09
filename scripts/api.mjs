export async function getAPOD() {
    try {
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
        );

        if (!response.ok) throw new Error("API failed");

        return await response.json();

    } catch (error) {
        console.warn("Using fallback APOD");

        return {
            title: "Fallback Space Image",
            date: "--/--/----",
            explanation: "NASA API is being moody today so here's a backup image from their assets :)",
            url: "https://images-assets.nasa.gov/image/PIA12235/PIA12235~orig.jpg",
            media_type: "image"
        };
    }
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