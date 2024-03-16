import Plant from "../models/plants.mjs";
export default class PlantsService {

    async get_all() {
        let existing_plants = await Plant.find({});
    }
}