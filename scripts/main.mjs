import { getAPOD } from "./api.mjs";
import { renderAPOD } from "./ui.mjs";

async function init() {
    try {
        const data = await getAPOD();
        console.log(data); 
        renderAPOD(data);
    } catch (error) {
        console.error(error);
    }
}

init();