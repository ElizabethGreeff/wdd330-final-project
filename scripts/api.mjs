const API_KEY = "JYghugWaXsqKBKTGFVUNmOUbkDI05cdCwhRF4cj2"; 

export async function getAPOD() {
    const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch APOD");
    }

    return await response.json();
}