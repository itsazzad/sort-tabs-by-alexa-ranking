import ext from "./utils/ext";
import storage from "./utils/storage";

var status = '';

// ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   console.log(tabs);
// });
//
// ext.browserAction.onClicked.addListener(function(tab) {
//   ext.windows.getCurrent(function(window) {
//     console.log(window);
//     var tabIds = [];
//     // window.tabs.forEach(function(tab){
//     //   //get alexa info if the latest info not available
//     //
//     //   console.log(tab);
//     //   tabIds.push(tab.id);
//     // });
//     //
//     // //Sort the tabs here by id
//     //
//     // ext.tabs.move(tabIds, function(tabs){
//     //
//     // });
//   });
// });
function Alexa(url, callback) {
  var data = {
    url: url,
    popularity: null,
    updated_at: Date.now(),
  };

  storage.get(url, function (sd) {
    if (sd[url] && sd[url].popularity && (Date.now() - sd[url].updated_at) < 86400000) {
      console.info(url, 'Reading from storage');
      callback(sd[url]);
    } else {
      setLocalData();
    }
  });

  var setLocalData = function () {
    getAlexaData();
  };

  var getAlexaData = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://data.alexa.com/data?cli=10&url=' + url, true);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var popularity = parsePopularity(this);
        data.popularity = popularity;
        data.updated_at = Date.now();
        var items = {};
        items[url] = data;
        storage.set(items, function () {
          console.info(url, 'data updated');
        });

        callback(data);
      }
    };
    xhr.send();
  };

  function parsePopularity(xml) {
    var xmlDoc = xml.responseXML;
    try {
      return xmlDoc.getElementsByTagName("SD")[0].getElementsByTagName("POPULARITY")[0].getAttribute('TEXT');
    } catch (e) {
      console.error(url);
      console.error(e);
      return null;
    }
  }
}

ext.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({}, function (tabs) {
    var tabIds = [];
    for (var i = 0, tab; tab = tabs[i]; i++) {
      var currenTab = tab;
      new Alexa((new URL(tab.url)).hostname, function (data) {
        data.tabId = currenTab.id;
        tabIds.push(data);
      });
    }
    console.log(tabIds);
  });
});
