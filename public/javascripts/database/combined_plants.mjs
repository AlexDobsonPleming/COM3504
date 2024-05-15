import {getPlants as getServerPlants } from "./server_plants.mjs";
import {getPlants as getQueuedPlants } from "./queued_plants.mjs";
import { getPlant as getServerPlant } from "./server_plants.mjs";
import { getPlant as getQueuedPlant } from "./queued_plants.mjs";

export async function getPlants() {
    const server_plants = await getServerPlants();
    const client_plants = await getQueuedPlants();

    return server_plants.concat(client_plants);
}

export async function getPlant(plant_id) {
    const server_plant = await getServerPlant(plant_id);
    if (server_plant) {
        return server_plant;
    }
    return await getQueuedPlant(plant_id);
}