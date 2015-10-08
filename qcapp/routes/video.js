var express = require('express');
var model = require("../models/video");
var aws = require("../controller/aws");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('video/index', {videos: videolist()});
});

/* GET users listing. */
router.get('/list', function(req, res, next) {
  res.send(videolist());
});

router.get('/:id(\\d+)/', function (req, res){
    var m = new model.Video();
    m.id = req.params.id;
    m.Title = "Video " + req.params.id;
  res.send(m);
});

router.get('/:id(\\d+)/qc/initate', function (req, res){
  var msg = {"id": req.params.id, "when": new Date()};
  aws.send(JSON.stringify(msg));
  res.send("Initiated and Queued" + req.params.id);
});

router.get('/:id(\\d+)/qc/status', function (req, res){
  res.send("Status"  + req.params.id);
});

router.get('/pickup', function (req, res){
  aws.recieve();
  res.send("Picked");
});

router.get('/:id(\\d+)/qc/report', function (req, res){
  res.render('video/report', {report: report(req.params.id)});
});

router.get('/:id(\\d+)/qc/reportdata', function (req, res){
  res.send(report(req.params.id));
});


function videolist(){
var list = [];
  for(i=1;i<10;i++){
    var m = new model.Video();
    m.id =i;
    m.Title = "Video " + i;
    list.push(m);
  }
  return list;
}

function report(id){
  var rep = new model.Report();
  rep.videoid = id;
  return rep;
}

module.exports = router;
