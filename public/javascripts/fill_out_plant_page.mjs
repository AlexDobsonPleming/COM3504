import {createMapEmbed, dateTimeSeenText} from "./create_plant_elements.mjs";
import {getPlant, reloadPlants} from "./database.mjs";
function assignCheckbox(paragraph, checkStatus) {

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checkStatus;
    input.disabled = true;
    paragraph.appendChild(input);
}

function createColouredText(text, colour) {
    const plantColourElement = document.createElement("p");
    plantColourElement.textContent = text;
    plantColourElement.style.backgroundColor = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    return plantColourElement;
}

function setValuesOnPlantPage(plantData) {

    const plant_name = document.getElementById("plant_name");
    plant_name.innerText = plantData.plant_name;

    const identification_status = document.getElementById("plant_identification_status");
    identification_status.innerText = plantData.identify_status;


    const plantDescription = document.getElementById("plant_description");
    plantDescription.textContent = plantData.description;

    const plant_image = document.getElementById("plant_image");
    plant_image.src = plantData.img;
    plant_image.alt = plantData.name;

    const date_time_seen = document.getElementById("date_time_seen");
    date_time_seen.innerText = dateTimeSeenText(plantData.date_time_seen)

    const width = document.getElementById("width");
    width.innerText = `${width.innerText}: ${plantData.plant_width}cm`;

    const height = document.getElementById("height");
    height.innerText = `${height.innerText}: ${plantData.plant_height}cm`;

    let plantMap = document.getElementById("map");
    plantMap.appendChild(createMapEmbed(plantData.plant_location));

    const hasFlowersElement = document.getElementById("has_flowers");
    assignCheckbox(hasFlowersElement, plantData.has_flowers);

    const hasFruitElement = document.getElementById("has_fruit");
    assignCheckbox(hasFruitElement, plantData.has_fruit);

    const hasSeedsElement = document.getElementById("has_seeds");
    assignCheckbox(hasSeedsElement, plantData.has_seeds);


    const sunExposure = document.getElementById("sun_exposure");
    sunExposure.textContent = `${sunExposure.textContent} ${plantData.sun_exposure}`;

    const plant_colour = document.getElementById("plant_colour");
    plant_colour.appendChild(createColouredText(rgbToHex(plantData.plant_colour), plantData.plant_colour));

    const flower_colour = document.getElementById("flower_colour");
    flower_colour.appendChild(createColouredText(rgbToHex(plantData.flower_colour), plantData.flower_colour));
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(colour) {
    return "#" + componentToHex(colour.r) + componentToHex(colour.g) + componentToHex(colour.b);
}

async function load_page() {
    const href = window.location.href;
    const elements = href.split("/");
    const plant_id = elements[elements.length - 1];

    const plant = await getPlant(plant_id);

    setValuesOnPlantPage(plant);
}

window.onload = load_page;