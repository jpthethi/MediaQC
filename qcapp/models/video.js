function Video()
{
  this.id  = -1;
  this.title = "";
  this.originalMediaFile="";
  this.originalMediaFileLocation="";
  this.originalMediaFileFormat = "";
  this.transcodedMediaFile="";
  this.transcodedMediaFileLocation="";
  this.transcodedMediaFileFormat = "";
  this.dateOfTranscoding="";
  //this.Size = "";
  this.initiated=false;
  this.report = null;
}

function Report()
{
  this.videoid  = -1;
  this.runDate = new Date();
  //parameters array will contain Json object 
  this.parameters = [];
  this.status = "Success"
}

exports.Report = Report;

exports.Video = Video;
