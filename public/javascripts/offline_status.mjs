import {getPlants} from "./database/queued_plants.mjs";

const offlineStatusElement = document.getElementById("plantOfflineStatus");

const queuedPlants = await getPlants();
if (queuedPlants.length > 0) {
    offlineStatusElement.innerText = `${queuedPlants.length} plants queued for upload`;
}