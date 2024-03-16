import Plant from "../models/plants.mjs";
export async function get_all() {
    let existing_plants = await Plant.find({});

    return existing_plants;
}