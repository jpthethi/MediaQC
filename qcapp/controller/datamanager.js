/**
 * Purpose of datamanger is to keep track of assets and related QC operations on
 * them.
 */

var model = require("../models/video");
var videos = [];

function initializeVideoList() {
	for (i = 1; i < 10; i++) {
		var m = new model.Video();
		m.id = i;
		m.Title = "Video " + i;
		videos.push(m);
	}
	return videos;
}

function getVideoList() {
	return videos;
}

function qcInitiated(id) {
	videos[id - 1].initiated = true;
}

function reportAvailable(id){
	videos[id - 1].reportAvailable = true;
}

function isReportAvailable(id){
	videos[id - 1].reportAvailable
}

function isQcInitiated(id){
	return videos[id - 1].initiated;
}

initializeVideoList();

exports.getVideoList = getVideoList;
exports.qcInitiated = qcInitiated;
exports.isQcInitiated = isQcInitiated;
exports.reportAvailable = reportAvailable;
exports.isReportAvailable = isReportAvailable;