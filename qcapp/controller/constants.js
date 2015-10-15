function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("transcodedFileIdSuffix", "-t");
define("reportIdSuffix", "-r");
define("resultFilePrefix","results")
define("resultFileSuffix","csv")
define("defaultPath","/tmp/");
define("defaultBucket","mediaqc");
define("toolPath","path to QC tool");
define("useProxy",false);
define("proxy","http://<host>:<port>");



