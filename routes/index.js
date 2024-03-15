var express = require('express');
var router = express.Router();
var plants = require('../controllers/plants')
var multer = require('multer');

// storage defines the storage options to be used for file upload with multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    filename =  Date.now() + '.' + file_extension[file_extension.length-1];
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
  let filePath = req.file.path;
  let result = plants.create(plantData, filePath);
  console.log(result);
  res.redirect('/');
});

module.exports = router;
