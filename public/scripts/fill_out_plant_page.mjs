import {createMapEmbed, dateTimeSeenText} from "./create_plant_elements.mjs";
import {getPlant} from "./database/client_plants.mjs";
import {getUsername} from "./username.mjs";
import {updatePlant} from "./database/client_plants.mjs";

let plant;
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

function getDBPedia(plantName) {
    // Construct the DBpedia resource URL based on the plant name
    const resource = `http://dbpedia.org/resource/${encodeURIComponent(plantName)}`;

    // DBpedia SPARQL endpoint URL
    const endpointUrl = 'https://dbpedia.org/sparql';

    // SPARQL query to retrieve abstract for the given resource (plant)
    const sparqlQuery = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbo: <http://dbpedia.org/ontology/>

        SELECT ?abstract
        WHERE {
            <${resource}> dbo:abstract ?abstract .
            FILTER (langMatches(lang(?abstract), "en"))
        }
    `;

    // Encode the query as a URL parameter
    const encodedQuery = encodeURIComponent(sparqlQuery);

    // Build the URL for the SPARQL query
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // The results are in the 'data' object
            const bindings = data.results.bindings;
            if (bindings.length > 0) {
                const abstract = bindings[0].abstract.value;
                // Insert the abstract into the element with the ID 'abstract'
                const abstractElement = document.getElementById("plant_abstract");
                abstractElement.textContent = abstract;

                const uriElement = document.getElementById("db_link");
                uriElement.textContent = resource;
            } else {
                console.log('No abstract found for the plant');
            }
        })
        .catch(error => {
            console.error('Error fetching abstract from DBpedia:', error);
        });
}
function setValuesOnPlantPage(plantData) {

    const plant_name = document.getElementById("plant_name");
    let name_to_set = plantData.plant_name;
    if (plantData.is_queued) {
        name_to_set = `${name_to_set} (queued for upload)`;
    }
    plant_name.innerText = name_to_set;

    if (plantData.user_name == getUsername()){
        const isYours = document.createElement("p");
        isYours.innerText = "You created this";
        plant_name.after(isYours);
    }

    const identification_status = document.getElementById("identifyStatus");
    identification_status.value = plantData.identify_status.status;
    identification_status.addEventListener("change", identificationStatusChanged);


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

    getDBPedia(plantData.plant_name)
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(colour) {
    return "#" + componentToHex(colour.r) + componentToHex(colour.g) + componentToHex(colour.b);
}

async function identificationStatusChanged() {
    const identification_status_dropdown = document.getElementById("identifyStatus");
    const identification_status = identification_status_dropdown.value;

    plant.identify_status = {
        status: identification_status,
        time_updated: Date.now()
    }
    await updatePlant(plant);
}

// Function to handle the change name button click event
function handleChangeNameClick() {
    // Hide the change name button
    document.getElementById("change_name_button").style.display = "none";
    // Show the name input container
    document.getElementById("name_input").style.display = "block";
}

// Function to handle the submit name button click event
async function handleSubmitNameClick() {
    const newPlantNameInput = document.getElementById("new_plant_name");
    const newPlantName = newPlantNameInput.value;

    if (newPlantName !== "") { // Check if a new name is provided
        plant.plant_name = newPlantName; // Update the plant object with the new name
        await updatePlant(plant); // Update the plant name in the database
        console.log('Plant name updated successfully.');
        // Update the plant name displayed on the page
        document.getElementById("plant_name").innerText = newPlantName;
    }

    // Hide the name input container
    document.getElementById("name_input").style.display = "none";
    // Show the change name button
    document.getElementById("change_name_button").style.display = "block";
    // Clear the input field
    newPlantNameInput.value = "";
}

// Add event listeners to the change name button and submit name button
document.getElementById("change_name_button").addEventListener("click", handleChangeNameClick);
document.getElementById("submit_name_button").addEventListener("click", handleSubmitNameClick);


async function load_page() {
    const href = window.location.href;
    const elements = href.split("/");
    const plant_id = elements[elements.length - 1];

    plant = await getPlant(plant_id);

    setValuesOnPlantPage(plant);
}
window.onload = load_page;
