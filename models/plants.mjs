// import mongoose from "mongoose";
import {mongoose} from "../databases/plants.mjs";

// Get the Schema class from mongoose
let Schema = mongoose.Schema;

// Define the schema for the plant model
let PlantSchema = new Schema(
    {
        // Define the plant_name field with type String, not required,
        // and max length of 200 characters
        plant_name: { type: String, required: false, max: 200 },
        // Define the status field with type enum, required,
        // and max length of 100 characters
        identify_status: {type: String, enum: ['Completed','In-Progress']},

        description: { type: String, required: true, max: 500 },

        date_time_seen: { type: Date },

        plant_width: { type: Number },

        plant_height: { type: Number },

        plant_location: { lat: Number, long: Number},

        has_flowers: {type: Boolean},

        has_leaves: {type: Boolean},

        has_fruit: {type: Boolean},

        has_seeds: {type: Boolean},

        sun_exposure: {type: String, enum: ['Full sun', 'Partial shade', 'Full shade']},

        plant_colour: {r: Number, g: Number, b: Number},

        flower_colour: {r: Number, g: Number, b: Number},

        comments: [{type: String }],

        img: {type: String }
    }
);

// Configure the 'toObject' option for the schema to include getters
// and virtuals when converting to an object
PlantSchema.set('toObject', { getters: true, virtuals: true });

// Create the mongoose model 'Student' based on the defined schema
let Plant = mongoose.model('plant', PlantSchema);

// Export the plants model for use in other modules
export default Plant;

