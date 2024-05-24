//retrieves all plants
export async function getPlantsFromAPI() {
    try {
        const apiPlants = await (await fetch("API/plants")).json();

        apiPlants.forEach(plant => {
            //fix mongodb stringifying my dates
            plant.date_time_seen = new Date(plant.date_time_seen);
        })

        return apiPlants;
    } catch (exception) {
        return undefined;
    }
}