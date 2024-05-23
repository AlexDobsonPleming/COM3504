"use strict";
import { getPlants } from "./database/client_plants.mjs";
import {createPlantImage, dateTimeSeenText, createMapEmbed} from "./create_plant_elements.mjs";
import { synchronise_all } from "./database/synchronisation.mjs";
import {getUsername} from "./username.mjs";


function createPlantName(plantData) {
    const plantName = document.createElement("h2");
    plantName.textContent = plantData.plant_name;
    return plantName;
}

function createPlantIdentificationStatus(plantData) {
    const identificationStatus = document.createElement("p");
    identificationStatus.textContent = `Identification status: ${plantData.identify_status.status}`;
    return identificationStatus;
}

function createDateTimeSeen(date_time) {
    const plantDateTimeSeen = document.createElement("p");
    plantDateTimeSeen.textContent = dateTimeSeenText(date_time);

    return plantDateTimeSeen;
}

function createPlantCard(plantData) {
    const rootPlantLink = document.createElement("a");
    rootPlantLink.href = `/plant/${plantData._id}`
    rootPlantLink.className="card-link searchEntry";

    //add data attributes
    const dateTimeAttribute= document.createAttribute("data-datetime");
    dateTimeAttribute.value=plantData.date_time_seen;
    rootPlantLink.setAttributeNode(dateTimeAttribute);

    const identificationStatusAttribute= document.createAttribute("data-identification");
    identificationStatusAttribute.value=plantData.identify_status.status;
    rootPlantLink.setAttributeNode(identificationStatusAttribute);

    const latitudeAttribute= document.createAttribute("data-lat");
    latitudeAttribute.value=plantData.plant_location.lat;
    rootPlantLink.setAttributeNode(latitudeAttribute);

    const longtitudeAttribute= document.createAttribute("data-long");
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

    if (plantData.user_name == getUsername()){
        const isYours = document.createElement("p");
        isYours.innerText = "You created this";
        cardContent.appendChild(isYours);

        cardContent.classList.add("owned");
    }

    if (plantData.is_queued){
        const isQueued = document.createElement("p");
        isQueued.innerText = "Queued for upload";
        cardContent.appendChild(isQueued);

        cardContent.classList.add("queued");
    }

    const plantIdentificationStatus = createPlantIdentificationStatus(plantData);
    cardContent.appendChild(plantIdentificationStatus);

    cardContent.appendChild(createDateTimeSeen(plantData.date_time_seen));

    const map = createMapEmbed(plantData.plant_location);
    cardContent.appendChild(map);

    plantArticle.appendChild(cardContent);

    rootPlantLink.appendChild(plantArticle);

    return rootPlantLink;
}


async function load_page() {
    await synchronise_all();

    const plants = await getPlants();

    const plantCountElement = document.getElementById('plantEntriesCount');
    plantCountElement.textContent = `${plants.length} plants`;


    const rootListElement = document.getElementById("searchResults");
    const plant_elements = plants
        .map(plant => createPlantCard(plant));
    plant_elements.forEach(plantElement => rootListElement.appendChild(plantElement));
}

window.onload = load_page;