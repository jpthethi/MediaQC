var async = require('async');
/**
 * This function does the actual QC job.
 * 
 * Message will have the videoid of the original asset. Assumption is that the
 * original and the transcoded asset will have mapping of ids in memory or in
 * db.
 * 
 * Videos / assets are stored in S3, with videoid as the key and asset as value.
 */
function startqc(msg) {
	console.log('start QC for :' + msg);
	// get original video id from msg
	// get transcoded video id using the original video id

	// store videos on local fs for processing by QC tool

	// start QC tool async
	
	// store processing status in-memory / db

	// store the results back to S3

}

exports.startqc = startqc;
