import ext from "./utils/ext";
import storage from "./utils/storage";

var startTime = new Date();
setInterval(myTimer, 100);
var timeDiff = 0;
function myTimer() {
  timeDiff = (new Date()) - startTime;
  document.getElementById("timer").innerHTML = timeDiff / 1000;
}

var port = ext.runtime.connect({name: "long-lived-connection"});

port.postMessage({command: "start processing"});

port.onMessage.addListener(function(msg) {
    document.getElementById("status").innerHTML = msg.response;
});
