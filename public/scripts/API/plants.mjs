
function fixPlant(plant) {
    plant.date_time_seen = new Date(plant.date_time_seen);
}
export async function getPlantsFromAPI() {
    try {
        const apiPlants = await (await fetch(`${window.location.origin}/API/plants`)).json();

        apiPlants.forEach(plant => fixPlant(plant))

        return apiPlants;
    } catch (exception) {
        return undefined;
    }
}

export async function getPlantFromAPI(id) {
    try {
        const resourceLocation = `${window.location.origin}/API/plant/${id}`;
        const apiPlant = await (await fetch(path)).json();

        fixPlant(apiPlant);

        return apiPlant;
    } catch (exception) {
        return undefined;
    }
}