var async = require('async');
var aws = require("./aws");
var constants = require("./constants");
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
	var tid = getTranscodedVideoId(id);
	console.log("transcoded id is " + tid);
	// download and store videos (original and transcoded) on local fs for
	// processing by QC tool

	// start QC tool async
	async.series([ function(callback) {
		async.parallel([ function(callback) {
			fetchAndStoreObject(id, function() {
				callback();
			});

		}, function(callback) {
			fetchAndStoreObject(tid, function() {
				callback();
			});
		} ], callback)
	}, function(callback) {
		invokeQc(getPath(id), getPath(tid), id);
	} ]);

	// store processing status in-memory / db

	// store the results back to S3

}


function invokeQc(pathOfOriginalFile, pathOfTranscodedFile, id) {
	console.log("invoking " + constants.toolPath);
	var cmd = constants.toolPath + " -f " + pathOfOriginalFile + " -f "
			+ pathOfTranscodedFile
			+ " -metr psnr -cc YYUV  -sc 1 -cng CUSTOM results-" + id
			+ ".csv -cod " + constants.defaultPath;
	exec(cmd, function(err, data) {
		console.log("err:" + err)
		console.log("data:" + data.toString());
	});
}

function storeQcResults(id, results) {
	aws.upload(null, id, results)
}

function fetchAndStoreObject(id, fn) {
	aws.fetchAndStoreObject(null, id, fn);
}

function getTranscodedVideoId(id) {
	return id + constants.transcodedFileIdSuffix;
}

function getPath(key) {
	return constants.defaultPath + key
}


exports.startqc = startqc;
exports.getTranscodedVideoId = getTranscodedVideoId;
