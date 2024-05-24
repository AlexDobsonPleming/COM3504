import express from "express";
var router = express.Router();
import plants from "../models/plants.mjs";
import multer from "multer";
import {create_or_update, get_all as get_plants} from "../services/plants.js";
import Plant from "../models/plants.mjs";
import * as PlantService from "../services/plants.js";

let upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home Page' });
});

// GET route to retrieve comments for a specific plant using query parameter
router.get('/chat', async function(req, res) {
    const plantId = req.query.plant_id;  // Get plant ID from query parameter
    try {
        const comments = await PlantService.getComments(plantId);
        res.render('chat', { title: 'Chat', comments: comments, plantId: plantId });
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.render('chat', { title: 'Chat', comments: [], plantId: plantId });
    }
});

// POST route to add a comment to a specific plant using query parameter
router.post('/chat', async function(req, res) {
    const plantId = req.query.plant_id; // Get plant ID from query parameter
    const comment = {
        name: req.body.name,
        message: req.body.message,
        date_time_sent: new Date()
    };
    try {
        const updatedPlant = await PlantService.addComment(plantId, comment);
        res.json(updatedPlant);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: "Error adding comment", error });
    }
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
