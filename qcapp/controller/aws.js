var fs = require('fs');
var constants = require('./constants');
AWS = require("aws-sdk");
AWS.config.update({
	region : 'us-east-1'
});
var creds = new AWS.SharedIniFileCredentials({
	profile : 'mqc'
});
var sqs;
if (!constants.useProxy) {
	sqs = new AWS.SQS({
		credentials : creds
	})
} else {
	sqs = new AWS.SQS({
		credentials : creds,
		httpOptions : {
			proxy : constants.proxy
		}
	});
}

var s3;
if (!constants.useProxy) {
	s3 = new AWS.S3({
		credentials : creds
	});
} else {
	s3 = new AWS.S3({
		credentials : creds,
		httpOptions : {
			proxy : constants.proxy
		}
	});
}

var qurl = "https://sqs.us-east-1.amazonaws.com/940843378204/qcrequest";
var params = {
	QueueUrl : qurl, /* required */
	AttributeNames : [
			'Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy',
	/* more items */
	],
	MaxNumberOfMessages : 1,
	MessageAttributeNames : [
	/* more items */
	],
	VisibilityTimeout : 1,
	WaitTimeSeconds : 1
};

function DefaultProcess(msg) {
	console.log("Processing: " + msg);
}
function recieve(fn) {
	sqs.receiveMessage(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} // an error occurred
		else { // successful response
			if (data.Messages === undefined) {
				console.log("No messages");
				return;
			}
			for (var i = 0; i < data.Messages.length; i++) {
				var msg = data.Messages[i];
				console.log("Message Recieved: " + msg.Body);
				if (fn === undefined) {
					fn = DefaultProcess;
				}
				fn(msg.Body);
				var p = {
					QueueUrl : qurl,
					ReceiptHandle : msg.ReceiptHandle
				};
				// TODO deleteMessage should only happen when the message is
				// processed successfully.
				sqs.deleteMessage(p, function(err, data) {
					if (err) {
						console.log(err, err.stack);
					} // an error occurred
					else
						console.log("Removed from Q"); // successful response
				});

			}
		}
	});
}

function send(msg) {
	var params = {
		MessageBody : msg, /* required */
		QueueUrl : qurl, /* required */
		DelaySeconds : 0
	};

	sqs.sendMessage(params, function(err, data) {
		if (err)
			console.log(err, err.stack); // an error occurred
		else
			console.log("Queued: " + msg); // successful response
	});
}
/**
 * This method has to fetch data from S3 and store object to local fs.
 */
function fetchAndStoreObject(bucket, key, fn) {
	if (bucket === null) {
		bucket = constants.defaultBucket;
	}
	var params = {
		Bucket : bucket, /* required */
		Key : key
	/* required */
	};
	console.log("getObject for " + JSON.stringify(params));
	var file = fs.createWriteStream('/tmp/' + key);
	s3.getObject(params).on('httpData', function(chunk) {
		file.write(chunk);
		// console.log("writing chunk in file."+key);
	}).on('httpDone', function() {
		file.end();
		console.log("file end." + key);
		fn();
	}).send();
}

function fetchObject(bucket, key, fn) {
	if (bucket === null) {
		bucket = constants.defaultBucket;
	}

	var params = {
		Bucket : bucket, /* required */
		Key : key
	/* required */
	};
	console.log("aws fetchObject.."+JSON.stringify(params));
	s3.getObject(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log("fetched object is :" + data);
			console
					.log("stringified fetched object is :"
							+ JSON.stringify(data));
			fn(data);
		}
	});

}

/**
 * This method will store object to S3 for the specified key.
 */
function putObject(bucket, key, obkject) {
	if (bucket === null) {
		bucket = constants.defaultBucket;
	}

	var params = {
		Bucket : bucket, /* required */
		Key : key, /* required */
		Body : obkject
	};
	console.log("putObject for " + JSON.stringify(obkject));
	s3.putObject(params, function(err, data) {
		if (err)
			console.log(err, err.stack); // an error occurred
		else
			console.log(data); // successful response
	});
}

function upload(bucket, key, contents) {
	if (bucket === null) {
		bucket = constants.defaultBucket;
	}
	console.log("upload called for " + bucket + "/" + key);
	console.log("contents to be uploaded :" + contents);
	var params = {
		Bucket : bucket,
		Key : key,
		Body : contents
	};
	s3.upload(params).on('httpUploadProgress', function(evt) {
		console.log(evt);
	}).send(function(err, data) {
		console.log(err, data)
	});
}

exports.recieve = recieve;
exports.send = send;
exports.fetchAndStoreObject = fetchAndStoreObject;
exports.fetchObject = fetchObject;
exports.putObject = putObject;
exports.upload = upload;