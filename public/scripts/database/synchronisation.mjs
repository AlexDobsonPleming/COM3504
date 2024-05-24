import {addPlant, getPlants, removePlant} from "./client_plants.mjs";
import {getPlantFromAPI, getPlantsFromAPI} from "../API/plants.mjs";

function comparePlantsForPatch(plantA, plantB) {
    return (plantA._id.valueOf() === plantB._id.valueOf()) &&
        (plantA.identify_status.status.valueOf()  === plantB.identify_status.status.valueOf()) &&
        (plantA.comments.length === plantB.comments.length);
}

function comparePlantsForSync(plantA, plantB) {
    return plantA._id.valueOf() === plantB._id.valueOf();
}
function complement(set, subset, comparator) {
    return set.filter(x => !subset.find(y => comparator(x, y)))
}
export async function synchronise_all() {
    const remotePlants = await getPlantsFromAPI();

    const clientPlants = await getPlants();

    const plantsInClientButNotRemote = complement(clientPlants, remotePlants, comparePlantsForPatch);

    const plantsInRemoteButNotClient = complement(remotePlants, clientPlants, comparePlantsForSync);

    if (plantsInRemoteButNotClient.length > 0) {
        await Promise.all(plantsInRemoteButNotClient.map(async newRemotePlant => await addPlant(newRemotePlant)));
    }

    if (plantsInClientButNotRemote.length > 0) {
        await uploadPlantsForSync(plantsInClientButNotRemote);
    }
}

export async function synchronise_one(clientPlant) {
    const remotePlant = await getPlantFromAPI(clientPlant._id);

    if (comparePlantsForPatch(clientPlant, remotePlant))
    {
        await uploadPlantForSync(clientPlant);
    }
}

async function uploadPlantForSync(plant) {
    const plantUploadEndpoint = "/API/plant";

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
}

async function uploadPlantsForSync(plants) {


    const plantsAndUploadStatus = plants.map(async plant => {
        return await uploadPlantForSync(plant);
    });


    const awaitedPlantsAndUploadStatus = await Promise.all(plantsAndUploadStatus);

    // const plantsSuccessfullyUploaded = awaitedPlantsAndUploadStatus.filter(x => x.uploadSuccessful);

    // const plantsBeingRemovedPromise = plantsSuccessfullyUploaded.forEach(async plantStatus => {
    //     return await removePlant(plantStatus.plant);
    // });
    //
    // await Promise.all(plantsBeingRemovedPromise);
}