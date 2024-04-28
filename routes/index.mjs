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

router.get('/add', function(req, res, next) {
  res.render('addplant', { title: 'Add Plants' });
});

router.post('/add', upload.single('myImg'), function (req, res, next) {
  let {
      user_name,
      plant_name,
      description,
      identify_status,
      date_time_seen,
      plant_width,
      plant_height,
      latitude,
      longitude,
      has_flowers,
      has_leaves,
      has_fruit,
      has_seeds,
      sun_exposure,
      plant_colour,
      flower_colour,
  } = req.body;
  var imageBase64 = req.file.buffer.toString("base64");

  const newPlant = new Plant({
        user_name: user_name,
        plant_name: plant_name,
        identify_status: identify_status,
        description: description,
        date_time_seen: date_time_seen,
        plant_width: plant_width,
        plant_height: plant_height,
        plant_location: {lat: latitude, long: longitude },
        has_flowers: has_flowers,
        has_fruit: has_fruit,
        has_seeds: has_seeds,
        sun_exposure: sun_exposure,
        plant_colour: {r: 1, g: 50, b: 32},
        flower_colour: {r: 162, g: 162, b: 208},
        comments: [],
        img: `data:image/jpeg;base64,${imageBase64}`
    })

  newPlant.save();
  res.redirect('/');
});


router.get('/API/plants', async function(req, res) {
  const plants = await get_plants();
  res.send(plants);
});

export default router;
