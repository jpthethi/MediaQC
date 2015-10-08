AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
AWS.config.update({accessKeyId: 'AKIAIEUAO5UPBSQLLQUQ', secretAccessKey: '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'});
var sqs = new AWS.SQS();
var qurl = "https://sqs.us-east-1.amazonaws.com/940843378204/qcrequest";
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

exports.recieve = recieve;
exports.send = send;
