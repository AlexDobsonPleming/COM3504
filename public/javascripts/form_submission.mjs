import { getImageAsBase64 } from "./form_interactivity_common.mjs";

async function submitForm() {
    const imageField = document.getElementById("myImage");
    const file = imageField.files ? imageField.files[0] : undefined;

    const image = file? await getImageAsBase64(file) : undefined;

    const plantNameField = document.getElementById("plantName");
    const plantName = plantNameField.value;

    const plantDescriptionField = document.getElementById("description");
    const plantDescription = plantDescriptionField.value;

    const userNameField = document.getElementById("userName");
    const userName = userNameField.value;

    const identifyStatusField = document.getElementById("identifyStatus");
    const identificationStatus = identifyStatusField.value;

    const dateAndTimeSeenField = document.getElementById("dateTime");
    const dateAndTimeSeen = dateAndTimeSeenField.value;

    const latitudeField = document.getElementById("latitude");
    const latitude = latitudeField.value;

    const longitudeField = document.getElementById("longitude");
    const longitude = longitudeField.value;

    const plantWidthField = document.getElementById("plantWidth");
    const plantWidth = plantWidthField.value;

    const plantHeightField = document.getElementById("plantHeight");
    const plantHeight = plantHeightField.value;

    const hasFlowersField = document.getElementById("hasFlowers");
    const hasFlowers = hasFlowersField.value;

    const hasLeavesField = document.getElementById("hasLeaves");
    const hasLeaves = hasLeavesField.value;

    const hasFruitField = document.getElementById("hasFruit");
    const hasFruit = hasFruitField.value;

    const hasSeedsField = document.getElementById("hasSeeds");
    const hasSeeds = hasSeedsField.value;

    const sunExposureField = document.getElementById("sunExposure");
    const sunExposure = sunExposureField.value;

    const plantColourField = document.getElementById("plantColour");
    const plantColour = plantColourField.value;

    const flowerColourField = document.getElementById("flowerColour");
    const flowerColour = flowerColourField.value;

    const plant = {
        user_name: userName,
        plant_name: plantName,
        description: plantDescription,
        identify_status: identificationStatus,
        date_time_seen: dateAndTimeSeen,
        plant_width: plantWidth,
        plant_height: plantHeight,
        latitude: longitude,
        longitude: latitude,
        has_flowers: hasFlowers,
        has_leaves: hasLeaves,
        has_fruit: hasFruit,
        has_seeds: hasSeeds,
        sun_exposure: sunExposure,
        plant_colour: plantColour,
        flower_colour: flowerColour,
        img_base64: image
    }

    await fetch("/add", {
        method: "POST",
        body: plant,
    })
}

const addPlantForm = document.getElementById("addPlantForm");
addPlantForm.onsubmit = async (_) => {await submitForm()};
