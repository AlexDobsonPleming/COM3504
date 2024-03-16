// Import the plants model
import plantModel from "../models/plants.mjs";

// Function to create new plants
exports.create = function (plantData, filePath) {
    // Create a new plant instance using the provided plant data
    let plant = new plantModel({
        plant_name: plantData.plant_name,
        identify_status: plantData.identify_status,
        description: plantData.description,
        date_time_seen: plantData.date_time_seen,
        plant_width: plantData.plant_width,
        plant_height: plantData.plant_height,
        plant_location: {
            lat: plantData.latitude,
            long: plantData.longitude
        },
        has_flowers: plantData.has_flowers,
        has_leaves: plantData.has_leaves,
        has_fruit: plantData.has_fruit,
        has_seeds: plantData.has_seeds,
        sun_exposure: plantData.sun_exposure,
        plant_colour: {
            r: plantData.colour_r,
            g: plantData.colour_g,
            b: plantData.colour_b
        },
        comments: plantData.comments,
        img: filePath
    });

    // Save the plant to the database and handle success or failure
    return plant.save().then(plant => {
        // Log the created student
        console.log(plant);

        // Return the plant data as a JSON string
        return JSON.stringify(plant);
    }).catch(err => {
        // Log the error if saving fails
        console.log(err);

        // Return null in case of an error
        return null;
    });
};



