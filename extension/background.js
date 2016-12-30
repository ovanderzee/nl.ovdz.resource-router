// init badge decoration

extensionModel.init();
extensionModel.setBadge();

var routingResponse = function (details) {
    if (!extensionModel.isRunning || urlModel.isValidating(details.url)) {
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
