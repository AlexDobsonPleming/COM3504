import {getPlants as getServerPlants } from "./server_plants.mjs";
import {getPlants as getQueuedPlants } from "./queued_plants.mjs";

export async function getPlants() {
    const server_plants = await getServerPlants();
    const client_plants = await getQueuedPlants();

    return server_plants.concat(client_plants);
}