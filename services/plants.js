import Plant from "../models/plants.mjs";
export async function get_all() {
    let existing_plants = await Plant.find({});

    return existing_plants;
}

export async function create_or_update(plant) {
    let {
        _id,
        user_name,
        plant_name,
        description,
        identify_status,
        date_time_seen,
        plant_width,
        plant_height,
        plant_location,
        has_flowers,
        has_leaves,
        has_fruit,
        has_seeds,
        sun_exposure,
        plant_colour,
        flower_colour,
        img,
        comments
    } = plant;

    const filter = {_id: _id}
    const existing_plant = await Plant.find(filter);

    if (existing_plant === undefined) {
        const newPlant = new Plant({
            _id: _id,
            user_name: user_name,
            plant_name: plant_name,
            identify_status: identify_status,
            description: description,
            date_time_seen: new Date(date_time_seen),
            plant_width: plant_width,
            plant_height: plant_height,
            plant_location: plant_location,
            has_flowers: has_flowers,
            has_fruit: has_fruit,
            has_seeds: has_seeds,
            has_leaves: has_leaves,
            sun_exposure: sun_exposure,
            plant_colour: plant_colour,
            flower_colour: flower_colour,
            comments: comments,
            img: img
        })

        let doc = await newPlant.save();
        return doc;
    } else {
        const update = {
            identify_status: identify_status,
            comments: comments
        }

        let doc = await Plant.findOneAndUpdate(filter, update);
        return doc;
    }
}