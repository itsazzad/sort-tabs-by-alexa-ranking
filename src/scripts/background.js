import ext from "./utils/ext";
import storage from "./utils/storage";

var status = '';

//TODO: Need to have facility for getting list of Alexa data instead of single one
function Alexa(tab, url, callback) {
  var data = {
    url: url,
    popularity: null,
    updated_at: Date.now(),
  };

  storage.get(url, function (sd) {
    if (sd[url] && sd[url].popularity && (Date.now() - sd[url].updated_at) < 86400000) {
      console.info(url, 'Reading from storage');
      callback(tab, sd[url]);
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
      if (this.readyState === 4 && this.status === 200) {
        data.popularity = parsePopularity(this);
        data.updated_at = Date.now();
        var items = {};
        items[url] = data;
        storage.set(items, function () {
          console.info(url, 'data updated');
        });

        callback(tab, data);
      }
    };
    xhr.send();
  };

  function parsePopularity(xml) {
    var xmlDoc = xml.responseXML;
    try {
      return parseInt(
        xmlDoc.getElementsByTagName("SD")[0].getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')
      );
    } catch (e) {
      console.error(url);
      console.error(e);
      return null;
    }
  }
}

ext.browserAction.onClicked.addListener(function () {
  ext.tabs.query({currentWindow: true}, function (tabs) {
    var tabData = [];
    for (var i = 0, tab; tab = tabs[i]; i++) {
      // console.log(tab);
      new Alexa(tab, (new URL(tab.url)).hostname, function (currentTab, data) {
        if (data.popularity) {
          data.tabId = currentTab.id;
          tabData.push(data);
          tabData.sort(function (a, b) {
            return a.popularity - b.popularity;
          });
          var tabIds = tabData.map(function (obj) {
            return obj.tabId;
          });

          //TODO: Need to move a single tab instead of array of tabs
          ext.tabs.move(tabIds, {index: -1}, function (tabs) {
            // console.log(tabs);
          });
        }
      });
    }
  });
});

ext.tabs.onMoved.addListener(function (tabId, moveInfo) {
  console.info(tabId, moveInfo);
});
