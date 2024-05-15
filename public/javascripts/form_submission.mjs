import { getImageAsBase64 } from "./form_interactivity_common.mjs";
import {addPlant} from "./database/queued_plants.mjs";

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
    const dateAndTimeSeen = new Date(dateAndTimeSeenField.value);

    const latitudeField = document.getElementById("latitude");
    const latitude = latitudeField.value;

    const longitudeField = document.getElementById("longitude");
    const longitude = longitudeField.value;

    const plantWidthField = document.getElementById("plantWidth");
    const plantWidth = plantWidthField.value;

    const plantHeightField = document.getElementById("plantHeight");
    const plantHeight = plantHeightField.value;

    const hasFlowersField = document.getElementById("hasFlowers");
    const hasFlowers = hasFlowersField.checked;

    const hasLeavesField = document.getElementById("hasLeaves");
    const hasLeaves = hasLeavesField.checked;

    const hasFruitField = document.getElementById("hasFruit");
    const hasFruit = hasFruitField.checked;

    const hasSeedsField = document.getElementById("hasSeeds");
    const hasSeeds = hasSeedsField.checked;

    const sunExposureField = document.getElementById("sunExposure");
    const sunExposure = sunExposureField.value;

    const plantColourField = document.getElementById("plantColour");
    const plantColour = plantColourField.value;

    const flowerColourField = document.getElementById("flowerColour");
    const flowerColour = flowerColourField.value;

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : undefined;
    }
    const plantColourRgb = hexToRgb(plantColour);
    const flowerColourRgb = hexToRgb(flowerColour);

    const plant = {
        user_name: userName,
        plant_name: plantName,
        description: plantDescription,
        identify_status: identificationStatus,
        date_time_seen: dateAndTimeSeen,
        plant_width: plantWidth,
        plant_height: plantHeight,
        plant_location: {
            lat: latitude,
            long: longitude
        },
        has_flowers: hasFlowers,
        has_leaves: hasLeaves,
        has_fruit: hasFruit,
        has_seeds: hasSeeds,
        sun_exposure: sunExposure,
        plant_colour: plantColourRgb,
        flower_colour: flowerColourRgb,
        img: image
    }

    await addPlant(plant);

    document.location.href = "/";
}

const addPlantButton = document.getElementById("addPlantButton");
addPlantButton.onclick = async (_) => {await submitForm()};
