import {ObjectStoreHandler} from "./database.mjs";

const server_plants_store_name = "server_plants";
const plantHandler = new ObjectStoreHandler(server_plants_store_name);

export async function getPlants() {
    const allPlants = await plantHandler.getAll();
    allPlants.forEach(plant => plant.is_queued = false);
    return allPlants;
}

export async function getPlant(plantId) {
    const plant = await plantHandler.get(plantId);
    if (plant) {
        plant.is_queued = false;
    }
    return plant;
}

export async function addPlant(newPlant) {
    return await plantHandler.add(newPlant);
}

export async function updatePlant(plantToUpdate) {
    return await plantHandler.update(plantToUpdate);
}

export async function reloadPlants(newPlants) {
    return await plantHandler.reload(newPlants);
}
