AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
var creds = new AWS.SharedIniFileCredentials({ profile: 'mqc' });
var sqs = new AWS.SQS({credentials: creds});
var qurl = "https://sqs.us-east-1.amazonaws.com/940843378204/qcrequest";
var s3 = new AWS.S3();
var params = {
  QueueUrl: qurl, /* required */
  AttributeNames: [
    'Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy',
    /* more items */
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    /* more items */
  ],
  VisibilityTimeout: 1,
  WaitTimeSeconds: 1
};

function DefaultProcess(msg){
  console.log("Processing: " + msg);
}
function recieve(fn)
{
  sqs.receiveMessage(params, function(err, data) {
    if (err) {console.log(err, err.stack);} // an error occurred
    else     { // successful response
      if(data.Messages === undefined)
        {console.log("No messages");return;}
      for(var i=0;i<data.Messages.length;i++){
        var msg = data.Messages[i];
        console.log("Message Recieved: " + msg.Body);
        if(fn === undefined) { fn = DefaultProcess; }
        fn(msg.Body);
        var p = { QueueUrl: qurl,  ReceiptHandle: msg.ReceiptHandle };
        sqs.deleteMessage(p, function(err, data) {
          if (err) {console.log(err, err.stack); } // an error occurred
          else     console.log("Removed from Q");           // successful response
        });

      }
    }
  });
}
//created for offline testing without AWS connectivity
function testrecieve(fn) {
	fn("invoked at "+new Date());
}

function send(msg)
{
  var params = {
    MessageBody: msg, /* required */
    QueueUrl: qurl, /* required */
    DelaySeconds: 0
  };

  sqs.sendMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("Queued: " + msg);  // successful response
  });
}
/**
 * This method has to fetch data from S3 and store object to local fs.
 */
function fetchAndStoreObject(bucket, key) {
	var params = {
		Bucket : bucket, /* required */
		Key : key /* required */
	};
	s3.getObject(params, function(err, data) {
		//TODO data has to be stored to FS
		if (err) console.log(err, err.stack); // an error occurred
		else console.log(data); // successful response
	});
}

/**
 * This method will store object to S3.
 */
function putObject(bucket, key, object) {
	var params = {
		Bucket : bucket, /* required */
		Key : key, /* required */
		Body : obkject
	};
	s3.putObject(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else console.log(data); // successful response
	});
}
exports.recieve = recieve;
exports.send = send;
exports.fetchAndStoreObject = fetchAndStoreObject;
exports.testrecieve = testrecieve;
exports.putObject = putObject;