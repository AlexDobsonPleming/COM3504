//displays the plant image
export function createPlantImage(plantData) {
    const plantImage = document.createElement("img");
    plantImage.src = plantData.img;
    plantImage.alt = plantData.plant_name;

    return plantImage;
}


//formats the view of the date and time seen
export function dateTimeSeenText(date_time) {
    const dateComponent = date_time.toLocaleDateString();
    const timeComponent = date_time.toLocaleTimeString();
    let outFormat = "";
    if (timeComponent == "00:00:00") {
        return `Date seen: ${dateComponent}`;
    } else {
        return `Date & Time seen: ${dateComponent} ${timeComponent}`
    }
}

//creates map of location shown in plant cards and the individual page
export function createMapEmbed(plant_location) {
    // Create the div that will wrap the iframe
    const mapContainer = document.createElement("div");
    mapContainer.className = "map"; // Add the 'map' class

    const plantMapLocation = document.createElement("iframe");
    plantMapLocation.width = "300";
    plantMapLocation.height = "170";
    plantMapLocation.frameBorder = "0";
    plantMapLocation.scrolling = "no";
    plantMapLocation.marginHeight = "0";
    plantMapLocation.marginWidth = "0";
    plantMapLocation.src = `https://maps.google.com/maps?q=${plant_location.lat},${plant_location.long}&hl=en&z=14&output=embed`;

    // Append the iframe to the div container
    mapContainer.appendChild(plantMapLocation);

    // Return the div container
    return mapContainer;
}




