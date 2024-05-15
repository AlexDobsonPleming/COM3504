import { getPlants, removePlant } from "./queued_plants.mjs";
export async function attemptUploadOfQueuedPlants() {
    const queuedPlants = await getPlants();

    const plantUploadEndpoint = "/API/plant";
    const plantsAndUploadStatus = queuedPlants.map(async plant => {
        // try {
        const response = await fetch(plantUploadEndpoint, {
            method: "POST",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(plant)
        });

        if (response.status >= 400 && response.status < 600) {
            return {
                plant: plant,
                uploadSuccessful: false
            };
        }

        const success = ({
            plant: plant,
            uploadSuccessful: true
        });
        return success;
        // } catch (error) {
        //     return {
        //         plant: plant,
        //         uploadSuccessful: false
        //     };
        // }
    });


    const awaitedPlantsAndUploadStatus = await Promise.all(plantsAndUploadStatus);

    const plantsSucessfullyUploaded = awaitedPlantsAndUploadStatus.filter(x => x.uploadSuccessful);

    plantsSucessfullyUploaded.forEach(async plantStatus => {
        await removePlant(plantStatus.plant);
    });
}