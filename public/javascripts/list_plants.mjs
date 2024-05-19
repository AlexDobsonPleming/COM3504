"use strict";
import {reloadPlants} from "./database/server_plants.mjs";
import { getPlants } from "./database/combined_plants.mjs";
import {createPlantImage, dateTimeSeenText, createMapEmbed} from "./create_plant_elements.mjs";
import { attemptUploadOfQueuedPlants } from "./database/synchronisation.mjs";
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
    identificationStatusAttribute.value=plantData.identify_status;
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
    try {
        const apiPlants = await (await fetch("API/plants")).json();

        apiPlants.forEach(plant => {
            //fix mongodb stringifying my dates
            plant.date_time_seen = new Date(plant.date_time_seen);
        })

        await reloadPlants(apiPlants);

    } catch (exception) {

    }


    const plants = await getPlants();

    const plantCountElement = document.getElementById('plantEntriesCount');
    plantCountElement.textContent = `${plants.length} plants`;


    const rootListElement = document.getElementById("searchResults");
    const plant_elements = plants
        .map(plant => createPlantCard(plant));
    plant_elements.forEach(plantElement => rootListElement.appendChild(plantElement));

    await attemptUploadOfQueuedPlants();
}

window.onload = load_page;