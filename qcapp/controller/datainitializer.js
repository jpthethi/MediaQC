var aws = require("./aws");
var fs = require('fs');
var qc = require("./qc");
var dm = require("./datamanager");

var videoMetadata = [ {
	key : "1",
	originalFile : "BurjKhalifaPinnacleBASEJump4K.avi",
	transcodedFile : "BurjKhalifaPinnacleBASEJump4K.mp4"
}, {
	key : "2",
	originalFile : "BurjKhalifaPinnacleBASEJump4K2.avi",
	transcodedFile : "BurjKhalifaPinnacleBASEJump4K2.mp4"
}, {
	key : "3",
	originalFile : "BurjKhalifaPinnacleBASEJump4K3.avi",
	transcodedFile : "BurjKhalifaPinnacleBASEJump4K3.mp4"
}, {
	key : "4",
	originalFile : "BurjKhalifaPinnacleBASEJump4K4.avi",
	transcodedFile : "BurjKhalifaPinnacleBASEJump4K4.mp4"
} ]

function storeVideosInS3() {
	for (var i = 0; i < videoMetadata.length; i++) {
		var videoData = videoMetadata[i];
		storeVideoInS3(videoData.key, videoData.originalFile,
				videoData.transcodedFile);
	}
}

function storeVideoInS3(key, originalFile, transcodedFile) {
	uploadFileContents(key, originalFile);
	uploadFileContents(dm.getTranscodedVideoId(key), transcodedFile);
}

function uploadFileContents(key, fileName) {
	var body = fs.createReadStream('./videos/' + fileName);
	aws.upload(null, key, body);
}

exports.storeVideosInS3 = storeVideosInS3;