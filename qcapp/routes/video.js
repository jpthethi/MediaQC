var express = require('express');
var model = require("../models/video");
var aws = require("../controller/aws");
var dm = require("../controller/datamanager");
var di = require("../controller/datainitializer");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('video/index', {
		videos : dm.getVideoList()
	});
});

/* GET users listing. */
router.get('/list', function(req, res, next) {
	res.send(dm.getVideoList());
});

router.get('/:id(\\d+)/', function(req, res) {
	var m = new model.Video();
	m.id = req.params.id;
	m.Title = "Video " + req.params.id;
	res.send(m);
});

router.get('/:id(\\d+)/qc/initate', function(req, res) {
	var msg = {
		"id" : req.params.id,
		"when" : new Date()
	};
	if (!dm.isQcInitiated(req.params.id)) {
		aws.send(JSON.stringify(msg));
		dm.qcInitiated(req.params.id);
	}
	res.render('video/index', {
		videos : dm.getVideoList()
	});
	// res.send("Initiated and Queued" + req.params.id);
});

router.get('/:id(\\d+)/qc/status', function(req, res) {
	res.send("Status" + req.params.id);
});

router.get('/pickup', function(req, res) {
	aws.recieve();
	res.send("Picked");
});

router.get('/:id(\\d+)/qc/report', function(req, res) {
	dm.getReport(req.params.id, function(data) {
		var reportData = JSON.parse(data);
		var report = new model.Report();
		report.videoid = req.params.id;
		res.render('video/report', {
			report : report
		});
	});

});

router.get('/:id(\\d+)/qc/reportdata', function(req, res) {
	dm.getReport(req.params.id, function(data) {
		res.send(data);
	});
});

// this is just to store videos on S3
router.get('/uploadVideos', function(req, res, next) {
	di.storeVideosInS3();
});

module.exports = router;
