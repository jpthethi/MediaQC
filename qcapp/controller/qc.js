var async = require('async');
var aws = require("./aws");
var constants = require("./constants");
var dm = require("./datamanager");
var exec = require('child_process').exec;

/**
 * This function does the actual QC job.
 * 
 * Message will have the videoid of the original asset. Assumption is that the
 * original and the transcoded asset will have mapping of ids in memory or in
 * db.
 * 
 * Videos / assets are stored in S3, with video-id as the key and asset as
 * value.
 */
function startqc(msg) {
	console.log('start QC for :' + msg);

	// get original video id from msg
	var id = JSON.parse(msg).id;
	console.log("id is " + id);

	// get transcoded video id using the original video id
	var tid = dm.getTranscodedVideoId(id);
	console.log("transcoded id is " + tid);
	// download and store videos (original and transcoded) on local fs for
	// processing by QC tool

	// start QC tool async
	async.series([ function(callback) {
		// both the downloads are in parallel

		async.parallel([ function(callback) {
			fetchAndStoreObject(id, function() {
				callback();
			});
		}, function(callback) {
			fetchAndStoreObject(tid, function() {
				callback();
			});
		} ], callback)
	},

	// QC is invoked after both the files have been downloaded.
	function(callback) {
		invokeQc(getPath(id), getPath(tid), id);
	} ]);
}

function invokeQc(pathOfOriginalFile, pathOfTranscodedFile, id) {
	console.log("invoking " + constants.toolPath);
	var cmd = constants.toolPath + " -f " + pathOfOriginalFile + " -f "
			+ pathOfTranscodedFile + " -metr psnr -cc YYUV  -sc 1 -cng CUSTOM "
			+ getResultsFileName(id) + " -cod " + constants.defaultPath;
	exec(cmd, function(err, data) {
		if (err) {
			console.log("err:" + err)
		}
		if (data) {
			// store the results back to S3
			// storing some dummy data as of now
			storeQcResults(dm.getReportId(id), JSON.stringify({
				"param1" : "value1",
				"param2" : "value2",
				"param3" : "value3"
			}));
			dm.reportAvailable(id);
			console.log("data:" + data.toString());
		}

	});
}

function getResultsFileName(id) {
	return constants.resultFilePrefix + "-" + id + "."
			+ constants.resultFileSuffix;
}

function storeQcResults(id, results) {
	aws.upload(null, id, results)
}

function fetchAndStoreObject(id, fn) {
	aws.fetchAndStoreObject(null, id, fn);
}

function getPath(key) {
	return constants.defaultPath + key
}

exports.startqc = startqc;