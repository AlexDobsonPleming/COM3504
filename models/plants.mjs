// import mongoose from "mongoose";
import {mongoose} from "../databases/plants.mjs";

// Get the Schema class from mongoose
let Schema = mongoose.Schema;

// Define the schema for the plant model
let PlantSchema = new Schema(
    {
        _id: { type: String, required: true },

        // Define the plant_name field with type String, not required,
        // and max length of 200 characters
        user_name: { type: String, required: true, max: 50},
        plant_name: { type: String, required: true, max: 200 },
        // Define the status field with type enum, required,
        // and max length of 100 characters
        identify_status: {
                status: {type: String, enum: ['Completed','In-Progress', 'Unknown']},
                time_updated: Date
        },

        description: { type: String, max: 500 },

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

        comments: [{
                name: String,
                message: String,
                date_time_sent: Date
        }],

        img: {type: String}
    },
    { _id: false }
);

// Configure the 'toObject' option for the schema to include getters
// and virtuals when converting to an object
PlantSchema.set('toObject', { getters: true, virtuals: true });

// Create the mongoose model 'Student' based on the defined schema
let Plant = mongoose.model('plant', PlantSchema);

// Export the plants model for use in other modules
export default Plant;

