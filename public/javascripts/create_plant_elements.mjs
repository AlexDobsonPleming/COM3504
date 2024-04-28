export function createPlantImage(plantData) {
    const plantImage = document.createElement("img");
    plantImage.src = plantData.img;
    plantImage.alt = plantData.plant_name;

    return plantImage;
}



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


export function createMapEmbed(plant_location) {
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




