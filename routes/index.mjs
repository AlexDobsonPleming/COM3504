import express from "express";
var router = express.Router();
import plants from "../models/plants.mjs";
import multer from "multer";
import {get_all as get_plants} from "../services/plants.js";
import Plant from "../models/plants.mjs";

let upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home Page' });
});

router.get('/plant/:plant_id', function(req, res, next) {
    res.render('plant', { title: 'Plant Page' });
});

//render default page so service worker can pick it up
router.get('/plant', function(req, res, next) {
    res.render('plant', { title: 'Plant Page' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add Plants' });
});

router.post('/API/plant', upload.single('myImg'), function (req, res, next) {
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
      } = req.body;



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
            comments: [],
            img: img
        })

    newPlant.save();
    res.send(newPlant);


});




router.get('/API/plants', async function(req, res) {
  const plants = await get_plants();
  res.send(plants);
});

export default router;
