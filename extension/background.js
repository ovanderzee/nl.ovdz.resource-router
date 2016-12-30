// init badge decoration

extensionModel.init();

var activeCount = 0;
for (var i = 0; i < extensionModel.urls.length; i++) {
    var item = JSON.parse(localStorage.getItem(extensionModel.urls[i]));
    if (Boolean(item.active)) {
        activeCount++;
    }
}
chrome.browserAction.setBadgeText({text: String(activeCount)});

chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 255]});




var routingResponse = function (details) {
    if (!localStorage.running || urlModel.isValidating(details.url)) {
		return {cancel: false};
    }
    var localRsrc = routeModel.localRsrc(details.url);
	if (localRsrc) {
	    var localHost = routeModel.localHost(details.url);
	    var localUrl = localHost + "/" + localRsrc;
		console.log('ROUTE ' + details.url + ' to: ' + localUrl);
		return {redirectUrl: localUrl};
	} else {
		return {cancel: false};
	}
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	return routingResponse(details);
}, {
	urls: ['*://*/*'],
	types: ['image', 'object', 'script', 'stylesheet', 'xmlhttprequest', 'other']
}, ['blocking']);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message === 'refresh') {
		sendResponse('the response');
	}
});
