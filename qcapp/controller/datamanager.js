/**
 * Purpose of datamanger is to keep track of assets and related QC operations on
 * them.
 */

var model = require("../models/video");
var aws = require("./aws");
var constants = require("./constants");
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

function reportAvailable(id, results) {
	videos[id - 1].report = resultsToReport(results);
}

function isReportAvailable(id) {
	videos[id - 1].report != null;
}

function isQcInitiated(id) {
	return videos[id - 1].initiated;
}

function getTranscodedVideoId(id) {
	return id + constants.transcodedFileIdSuffix;
}

function getReportId(id) {
	return id + constants.reportIdSuffix;
}

/**
 * Will fetch data corresponding to the passed id from S3 and populate the
 * model.Report object accordingly and then return it.
 */
function getReport(id, reportObjectRequired, fn) {
	aws.fetchObject(null, getReportId(id), function(data) {
		if (reportObjectRequired) {
			fn(resultsToReport(data.Body.toString()));
		} else {
			fn(JSON.stringify(data.Body.toString()))
		}

	});
}

/**
 * This method take string representation of JSON results and returns
 * model.Report object corresponding to it.
 */
function resultsToReport(results) {
	var reportData = JSON.parse(results);
	var report = new model.Report();
	report.videoid = reportData["videoid"];
	report.runDate = reportData["runDate"];
	report.status = reportData["status"];
	report.parameters = reportData["parameters"];
	console.log("report is :" + JSON.stringify(report));
	return report;
}

initializeVideoList();

exports.getVideoList = getVideoList;
exports.qcInitiated = qcInitiated;
exports.isQcInitiated = isQcInitiated;
exports.reportAvailable = reportAvailable;
exports.isReportAvailable = isReportAvailable;
exports.getReport = getReport;
exports.getTranscodedVideoId = getTranscodedVideoId;
exports.getReportId = getReportId;