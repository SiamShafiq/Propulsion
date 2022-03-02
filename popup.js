

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
//     console.log('Turning ' + tab.url + ' red!');
//     chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="black"'
//     });
// });

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ 'url': "chrome://newtab" })
})