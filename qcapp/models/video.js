function Video()
{
  this.id  = -1;
  this.Title = "";
  this.Size = "";
  this.initiated=false;
  //this.reportAvailable=false;
  //this.success=false;
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
