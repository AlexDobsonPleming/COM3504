import {ObjectStoreHandler} from "./database.mjs";

const server_plants_store_name = "queued_plants";
const plantHandler = new ObjectStoreHandler(server_plants_store_name);

export async function getPlants() {
    const allPlants = await plantHandler.getAll();
    allPlants.forEach(plant => plant.is_queued = true);
    return allPlants;
}

export async function getPlant(plantId) {
    const plant = await plantHandler.get(plantId);
    if (plant) {
        plant.is_queued = true;
    }
    return plant;
}

export async function addPlant(newPlant) {
    newPlant._id = self.crypto.randomUUID();
    return await plantHandler.add(newPlant);
}

export async function removePlant(plantToRemove) {
    return await plantHandler.remove(plantToRemove);
}