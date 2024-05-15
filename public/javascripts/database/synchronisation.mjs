import { getPlants, removePlant } from "./queued_plants.mjs";
export async function attemptUploadOfQueuedPlants() {
    const queuedPlants = await getPlants();

    const plantUploadEndpoint = "/API/plant";
    const plantsAndUploadStatus = queuedPlants.map(async plant => {
        await fetch(plantUploadEndpoint, {
            method: "POST",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(plant)
        }).then((response) => {
            // client/server error has occured
            if (response.status >= 400 && response.status < 600) {
                return {
                    plant: plant,
                    uploadSuccessful: false
                };
            }
            return response;
        }).then((returnedResponse) => {
            //happy path
            return {
                plant: plant,
                uploadSuccessful: true
            };
        }).catch((error) => {
            // network error has occurred
            return {
                plant: plant,
                uploadSuccessful: false
            };
        });

        await Promise.all(plantsAndUploadStatus);

        const plantsSucessfullyUploaded = plantsAndUploadStatus.filter(x => x.uploadSuccessful).forEach(async plant => {
            await removePlant(plant);
        });
    })
}