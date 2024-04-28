"use strict";
import {addPlant, reloadPlants, getPlants} from "./database.mjs";

function createPlantImage(plantData) {
    const plantImage = document.createElement("img");
    plantImage.src = plantData.img;
    plantImage.alt = plantData.plant_name;

    return plantImage;
}

function createPlantName(plantData) {
    const plantName = document.createElement("h2");
    plantName.textContent = plantData.plant_name;
    return plantName;
}

function createPlantIdentificationStatus(plantData) {
    const identificationStatus = document.createElement("p");
    identificationStatus.textContent = `Identification status: ${plantData.identify_status}`;
    return identificationStatus;
}

function createDateTimeSeen(date_time) {
    const plantDateTimeSeen = document.createElement("p");
    const dateComponent = date_time.toLocaleDateString();
    const timeComponent = date_time.toLocaleTimeString();
    let outFormat = "";
    if (timeComponent == "00:00:00") {
        outFormat = `Date seen: ${dateComponent}`;
    } else {
        outFormat = `Date & Time seen: ${dateComponent} ${timeComponent}`
    }
    plantDateTimeSeen.textContent = outFormat;

    return plantDateTimeSeen;
}

function createMapEmbed(plant_location) {
    const plantMapLocation = document.createElement("iframe");
    plantMapLocation.width = "300";
    plantMapLocation.height = "170";
    plantMapLocation.frameBorder = "0";
    plantMapLocation.scrolling = "no";
    plantMapLocation.marginHeight = "0";
    plantMapLocation.marginWidth = "0";
    plantMapLocation.src = `https://maps.google.com/maps?q=${plant_location.lat},${plant_location.long}&hl=en&z=14&output=embed`;
    return plantMapLocation;
}

function createPlantDetailedElement(plantData) {
    const rootPlantDiv = document.createElement("div");
    rootPlantDiv.className="searchEntry";

    const dateTimeAttribute= document.createAttribute("datetime");
    dateTimeAttribute.value=plantData.date_time_seen;
    rootPlantDiv.setAttributeNode(dateTimeAttribute);

    const identificationStatusAttribute= document.createAttribute("identification");
    identificationStatusAttribute.value=plantData.identify_status;
    rootPlantDiv.setAttributeNode(identificationStatusAttribute);

    const latitudeAttribute= document.createAttribute("lat");
    latitudeAttribute.value=plantData.plant_location.lat;
    rootPlantDiv.setAttributeNode(latitudeAttribute);

    const longtitudeAttribute= document.createAttribute("long");
    longtitudeAttribute.value=plantData.plant_location.long;
    rootPlantDiv.setAttributeNode(longtitudeAttribute);



    rootPlantDiv.appendChild(createPlantName(plantData));

    rootPlantDiv.appendChild(createPlantIdentificationStatus(plantData));

    const plantDescription = document.createElement("p");
    plantDescription.textContent = plantData.description;
    rootPlantDiv.appendChild(plantDescription);


    rootPlantDiv.appendChild(createPlantImage(plantData));

    rootPlantDiv.appendChild(createDateTimeSeen(plantData.date_time_seen));

    const plantDimensions = document.createElement("p");
    plantDimensions.textContent = `Plant is ${plantData.plant_width} cm wide and ${plantData.plant_height}cm high`;
    rootPlantDiv.appendChild(plantDimensions);

    const plantMapLocation = document.createElement("iframe");
    plantMapLocation.width = "300";
    plantMapLocation.height = "170";
    plantMapLocation.frameBorder = "0";
    plantMapLocation.scrolling = "no";
    plantMapLocation.marginHeight = "0";
    plantMapLocation.marginWidth = "0";
    plantMapLocation.src = `https://maps.google.com/maps?q=${plantData.plant_location.lat},${plantData.plant_location.long}&hl=en&z=14&output=embed`;
    rootPlantDiv.appendChild(plantMapLocation);
    //TODO add offline detector and don't render iframe if offline

    function getParagraphAndCheckbox(label, checkStatus) {
        const paragraph = document.createElement("p");
        paragraph.textContent = label;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checkStatus;
        input.disabled = true;
        paragraph.appendChild(input);
        return paragraph;
    }

    const hasFlowersCheckbox = getParagraphAndCheckbox("Has flowers ", plantData.has_flowers);
    rootPlantDiv.appendChild(hasFlowersCheckbox);
    const hasFruitCheckbox = getParagraphAndCheckbox("Has fruit ", plantData.has_fruit);
    rootPlantDiv.appendChild(hasFruitCheckbox);
    const hasSeedsCheckbox = getParagraphAndCheckbox("Has seeds ", plantData.has_seeds);
    rootPlantDiv.appendChild(hasSeedsCheckbox);

    const sunExposure = document.createElement("p");
    sunExposure.textContent = plantData.sun_exposure;
    rootPlantDiv.appendChild(sunExposure);

    function createColouredText(text, colour) {
        const plantColourElement = document.createElement("p");
        plantColourElement.textContent = text;
        plantColourElement.style.backgroundColor = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
        return plantColourElement;
    }


    const plantColourElement =createColouredText("Plant colour", plantData.plant_colour)
    rootPlantDiv.appendChild(plantColourElement);

    const flowerColourElement = createColouredText("Flower colour", plantData.flower_colour);
    rootPlantDiv.appendChild(flowerColourElement);

    return rootPlantDiv;

}

function createPlantCard(plantData) {
    const rootPlantLink = document.createElement("a");
    rootPlantLink.className="card-link searchEntry";

    //add data attributes
    const dateTimeAttribute= document.createAttribute("datetime");
    dateTimeAttribute.value=plantData.date_time_seen;
    rootPlantLink.setAttributeNode(dateTimeAttribute);

    const identificationStatusAttribute= document.createAttribute("identification");
    identificationStatusAttribute.value=plantData.identify_status;
    rootPlantLink.setAttributeNode(identificationStatusAttribute);

    const latitudeAttribute= document.createAttribute("lat");
    latitudeAttribute.value=plantData.plant_location.lat;
    rootPlantLink.setAttributeNode(latitudeAttribute);

    const longtitudeAttribute= document.createAttribute("long");
    longtitudeAttribute.value=plantData.plant_location.long;
    rootPlantLink.setAttributeNode(longtitudeAttribute);

    const plantArticle = document.createElement("article");
    plantArticle.className = "card";

    const plantImage = createPlantImage(plantData);
    plantArticle.appendChild(plantImage);

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const plantName = createPlantName(plantData);
    cardContent.appendChild(plantName);

    const plantIdentificationStatus = createPlantIdentificationStatus(plantData);
    cardContent.appendChild(plantIdentificationStatus);

    cardContent.appendChild(createDateTimeSeen(plantData.date_time_seen));

    const map = createMapEmbed(plantData.plant_location);
    cardContent.appendChild(map);

    plantArticle.appendChild(cardContent);

    rootPlantLink.appendChild(plantArticle);

    return rootPlantLink;
}


function createPlantListElement(plantData) {
    return createPlantCard(plantData);
}

async function load_page() {
    const apiPlants = await (await fetch("API/plants")).json();

    apiPlants.forEach(plant => {
        //fix mongodb stringifying my dates
        plant.date_time_seen = new Date(plant.date_time_seen);
    })

    await reloadPlants(apiPlants);
    const plants = await getPlants();

    const plantCountElement = document.getElementById('plantEntriesCount');
    plantCountElement.textContent = `${plants.length} plants`;


    const rootListElement = document.getElementById("searchResults");
    const plant_elements = plants
        .map(plant => createPlantListElement(plant));
    plant_elements.forEach(plantElement => rootListElement.appendChild(plantElement));

}




window.onload = load_page;