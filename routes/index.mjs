import express from "express";
var router = express.Router();
import plants from "../models/plants.mjs";
import multer from "multer";
import {create_or_update, get_all as get_plants} from "../services/plants.js";
import Plant from "../models/plants.mjs";

let upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home Page' });
});

/* GET home page. */
router.get('/chat', function(req, res, next) {
    res.render('chat', { title: 'Chat' });
});

router.get('/plant/:plant_id', function(req, res, next) {
    const plantId = req.params.plant_id;
    res.render('plant', { title: 'Plant Page', plant_id: plantId });
});

//render default page so service worker can pick it up
router.get('/plant', function(req, res, next) {
    res.render('plant', { title: 'Plant Page' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add Plants' });
});

router.post('/API/plant', upload.single('myImg'), async function (req, res, next) {
      let plant = req.body;

      const document = await create_or_update(plant);

      res.send(document);
});




router.get('/API/plants', async function(req, res) {
  const plants = await get_plants();
  res.send(plants);
});

export default router;
