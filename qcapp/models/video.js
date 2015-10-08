function Video()
{
  this.id  = -1;
  this.Title = "";
  this.Size = "";
}

function Report()
{
  this.videoid  = -1;
  this.RunDate = new Date();
  this.Parameters = [];
  this.Status = "Success"
}

exports.Report = Report;

exports.Video = Video;
