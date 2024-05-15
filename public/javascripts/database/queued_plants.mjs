import {ObjectStoreHandler} from "./database.mjs";

const server_plants_store_name = "queued_plants";
const plantHandler = new ObjectStoreHandler(server_plants_store_name);

export async function getPlants() {
    return await plantHandler.getAll();
}

export async function getPlant(plantId) {
    return await plantHandler.get(plantId);
}

export async function addPlant(newPlant) {
    newPlant._id = self.crypto.randomUUID();
    return await plantHandler.add(newPlant);
}

export async function removePlant(plantToRemove) {
    return await plantHandler.remove(plantToRemove);
}