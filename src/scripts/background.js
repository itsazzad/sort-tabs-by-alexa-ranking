import ext from "./utils/ext";

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", request.data);

      sendResponse({ action: "saved" });
    }
  }
);

storage.set({ sites: value }, function() {
});

storage.get(site, function(resp) {
  console.log(resp);
  var site = resp[site];
  if(site) {
  } else {
  }
});

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  console.log(tabs);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  alert('Tabs will be sorted');
  chrome.windows.getCurrent(function(window)
  {
    var tabIds = [];
    window.tabs.forEach(function(tab){
      //get alexa info if the latest info not available

      console.log(tab);
      tabIds.push(tab.id);
    });

    //Sort the tabs here by id

    chrome.tabs.move(tabIds, function(tabs){

    });
  });
});
