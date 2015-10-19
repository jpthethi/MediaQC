var express = require('express');
var router = express.Router();
var dm = require("../controller/datamanager");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('video/index', {
		videos : dm.getVideoList()
	});
});

module.exports = router;
