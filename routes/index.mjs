import express from "express";
var router = express.Router();
import plants from "../models/plants.mjs";
import multer from "multer";
import fs from "fs";
import {get_all as get_plants} from "../services/plants.js";

// storage defines the storage options to be used for file upload with multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    var filename =  Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
let upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plant classification fun' });
});

router.get('/add', function(req, res, next) {
  res.render('addplant', { title: 'Add Plants' });
});

router.post('/add', upload.single('myImg'), function (req, res, next) {
  let plantData = req.body;
  //var bitmap = new Buffer(fs.readFileSync(req.file)).toString('base64');
  var fileInfo = [];
  for(var i = 0; i < req.files.length; i++) {
    fileInfo.push({
      "originalName": req.files[i].originalName,
      "size": req.files[i].size,
      "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
    });
    fs.unlink(req.files[i].path);
  }
  res.send(fileInfo);
  let result = plants.create(plantData, imageData);
  console.log(result);
  res.redirect('/');
});

router.get('/plants', async function (req, res, next) {
  const plants = await get_plants();
  res.render('plants', { plants: plants });
});

router.get('/API/plants', async function(req, res) {
  const plants = await get_plants();
  res.send(plants);
});

export default router;
