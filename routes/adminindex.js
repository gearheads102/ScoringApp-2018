var express = require('express');
var router = express.Router();

// Solely for Admin index - any actual business logic functionality
// should be inside a separate JS file, for example 'scoutingpairs.js'

/* GET index page. */
router.get('/', function(req, res) {
  res.render('./adminindex', { title: 'Admin pages' });
});

module.exports = router;
