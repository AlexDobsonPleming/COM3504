import {ObjectStoreHandler} from "./database.mjs";

const server_plants_store_name = "server_plants";
const plantHandler = new ObjectStoreHandler(server_plants_store_name);

export async function getPlants() {
    return await plantHandler.getAll();
}

export async function getPlant(plantId) {
    return await plantHandler.get(plantId);
}

export async function addPlant(newPlant) {
    return await plantHandler.add(newPlant);
}

export async function reloadPlants(newPlants) {
    return await plantHandler.reload(newPlants);
}
